-- V32: public certificate verification references and revocation support.
-- Apply after V31. Public users can verify a reference but cannot enumerate records.
alter table public.verified_certificates
  add column if not exists certificate_ref text,
  add column if not exists revoked_at timestamptz,
  add column if not exists revocation_note text;

update public.verified_certificates
set certificate_ref = 'MESV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
where certificate_ref is null;

create unique index if not exists verified_certificates_certificate_ref_uidx
  on public.verified_certificates(certificate_ref);

alter table public.verified_certificates
  alter column certificate_ref set not null;

create or replace function public.assign_certificate_reference()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.certificate_ref is null or new.certificate_ref = '' then
    new.certificate_ref := 'MESV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  end if;
  return new;
end;
$$;

drop trigger if exists verified_certificate_reference_before_insert on public.verified_certificates;
create trigger verified_certificate_reference_before_insert
before insert on public.verified_certificates
for each row execute procedure public.assign_certificate_reference();

create or replace function public.verify_certificate(p_reference text)
returns table (
  is_valid boolean,
  certificate_ref text,
  certificate_title text,
  certificate_subject text,
  awarded_at timestamptz,
  issuer_name text,
  class_name text,
  revocation_note text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (vc.revoked_at is null) as is_valid,
    vc.certificate_ref,
    vc.title as certificate_title,
    vc.subject as certificate_subject,
    vc.awarded_at,
    coalesce(issuer.full_name, 'MyEasyScience teacher') as issuer_name,
    c.name as class_name,
    case when vc.revoked_at is not null then vc.revocation_note else null end as revocation_note
  from public.verified_certificates vc
  left join public.profiles issuer on issuer.id = vc.teacher_id
  left join public.classes c on c.id = vc.class_id
  where upper(trim(p_reference)) = upper(vc.certificate_ref)
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Teachers may revoke certificates they issued; administrators may revoke any.
drop policy if exists "Teachers can revoke their own issued certificates" on public.verified_certificates;
create policy "Teachers can revoke their own issued certificates"
  on public.verified_certificates for update
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());
