-- V31: teacher-verified student certificates.
-- Apply this migration in Supabase SQL Editor before using the teacher issue workflow.
create table if not exists public.verified_certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  subject text not null default 'General Science',
  teacher_note text check (teacher_note is null or char_length(teacher_note) <= 500),
  awarded_at timestamptz not null default now()
);

create index if not exists verified_certificates_student_idx
  on public.verified_certificates(student_id, awarded_at desc);
create index if not exists verified_certificates_teacher_idx
  on public.verified_certificates(teacher_id, awarded_at desc);

alter table public.verified_certificates enable row level security;

drop policy if exists "Students can view their verified certificates" on public.verified_certificates;
create policy "Students can view their verified certificates"
  on public.verified_certificates for select
  using (student_id = auth.uid());

drop policy if exists "Issuing teachers can view certificates they awarded" on public.verified_certificates;
create policy "Issuing teachers can view certificates they awarded"
  on public.verified_certificates for select
  using (teacher_id = auth.uid() or public.is_admin());

drop policy if exists "Teachers can award certificates to their class members" on public.verified_certificates;
create policy "Teachers can award certificates to their class members"
  on public.verified_certificates for insert
  with check (
    teacher_id = auth.uid()
    and public.is_teacher()
    and exists (
      select 1 from public.classes c
      join public.class_members m on m.class_id = c.id
      where c.id = class_id
        and c.teacher_id = auth.uid()
        and m.student_id = student_id
    )
  );

drop policy if exists "Admins can manage verified certificates" on public.verified_certificates;
create policy "Admins can manage verified certificates"
  on public.verified_certificates for all
  using (public.is_admin())
  with check (public.is_admin());
