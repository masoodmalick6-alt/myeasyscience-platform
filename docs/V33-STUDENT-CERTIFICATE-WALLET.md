# MyEasyScience V33 — Student Certificate Wallet

**Version:** V33  
**Base:** MyEasyScience V32 Certificate Verification Portal  
**Route:** `/certificate-wallet`

## Purpose

V33 adds a single student-facing wallet for collecting, organising and printing personal learning certificates and teacher-verified certificates.

## Features

- Combined collection of personal certificate-centre awards and teacher-issued verified awards.
- Search by certificate title, subject, reference, status or issuing teacher.
- Filter by all, personal, verified or revoked.
- Select a certificate to view its printable layout.
- Print or save the selected certificate as PDF through the browser print dialog.
- Clearly distinguish self-created personal keepsakes from teacher-verified awards.
- Display the live revoked status of teacher-issued records.
- Provide a public verification link for teacher-issued certificates.

## Exact V33 file changes

### New files

- `myeasyscience-platform/app/certificate-wallet/page.tsx` — authenticated server route. Reads only the current learner's `verified_certificates` records and teacher display names.
- `myeasyscience-platform/components/certificate-wallet.tsx` — client wallet for local personal certificates, search/filter, detail view and print layout.
- `myeasyscience-platform/docs/V33-STUDENT-CERTIFICATE-WALLET.md` — this release note.

### Changed files

- `myeasyscience-platform/app/certificates/page.tsx` — adds a direct link to the wallet.
- `myeasyscience-platform/components/site-header.tsx` — adds Certificate Wallet navigation.

## Data and privacy

Teacher-verified certificates are fetched server-side after `supabase.auth.getUser()` and are explicitly filtered with `.eq("student_id", user.id)`. Existing Supabase RLS policies from V31/V32 remain the authoritative database security boundary. The page does not use a service-role key.

Personal certificates created by the existing certificate achievement centre are stored in the browser's local storage under its existing key, `myeasyscience-certificates-v30`. They are personal keepsakes and are not represented as teacher-verified. They remain local to that browser/device.

## Supabase migration

**No V33 SQL migration is required.** The wallet reuses `public.verified_certificates`, its `certificate_ref` and `revoked_at` fields, and the V31/V32 RLS policies and verification function. Apply the existing V31 and V32 migrations in order if they have not already been applied:

1. `supabase/migrations/20261112_v31_verified_certificates.sql`
2. `supabase/migrations/20261113_v32_certificate_verification.sql`

Do not loosen or disable RLS.

## Compatibility and validation

The wallet uses the existing Next.js App Router, TypeScript, Tailwind classes, lucide-react icons, Supabase server client and existing dark-mode variants. A production build and live Supabase test require dependencies and project environment variables; they are not claimed as completed in this package.
