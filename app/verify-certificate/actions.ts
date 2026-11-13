"use server";

import { createClient } from "@/lib/supabase/server";

export type CertificateVerificationResult = {
  found?: boolean;
  is_valid?: boolean;
  certificate_ref?: string;
  certificate_title?: string;
  certificate_subject?: string;
  awarded_at?: string;
  issuer_name?: string;
  class_name?: string;
  revocation_note?: string | null;
  error?: string;
};

export async function verifyCertificate(reference: string): Promise<CertificateVerificationResult> {
  const normalized = reference.trim().toUpperCase();
  if (!/^MESV-[A-F0-9]{12}$/.test(normalized)) {
    return { error: "Enter a reference in the format MESV-XXXXXXXXXXXX." };
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("verify_certificate", { p_reference: normalized });
    if (error) return { error: "Verification is not configured yet. The site administrator must apply the V32 database migration." };
    const result = Array.isArray(data) ? data[0] : data;
    if (!result) return { found: false };
    return { found: true, ...result };
  } catch {
    return { error: "Verification is temporarily unavailable. Please try again later." };
  }
}
