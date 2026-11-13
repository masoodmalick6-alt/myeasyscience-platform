import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Award, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CertificateWallet from "@/components/certificate-wallet";

export default async function CertificateWalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: verified, error } = await supabase
    .from("verified_certificates")
    .select("id,title,subject,teacher_note,awarded_at,teacher_id,class_id,certificate_ref,revoked_at")
    .eq("student_id", user.id)
    .order("awarded_at", { ascending: false });

  // The learner can read their own certificate rows under V31/V32 RLS.
  // Teacher profile rows are intentionally not queried here: profile RLS
  // does not grant students general access to other users' profiles.


  const records = (verified || []).map((certificate) => ({
    id: certificate.id,
    title: certificate.title,
    subject: certificate.subject,
    teacherNote: certificate.teacher_note,
    awardedAt: certificate.awarded_at,
    teacherName: "MyEasyScience teacher",
    reference: certificate.certificate_ref,
    revoked: Boolean(certificate.revoked_at),
    revocationNote: certificate.revoked_at ? "This certificate has been revoked." : null,
  }));

  return (
    <main className="container py-10 md:py-14">
      <Link href="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300"><ArrowLeft size={16}/> Certificate centre</Link>
      <div className="mt-5 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-100 p-3 text-violet-800 dark:bg-violet-950 dark:text-violet-200"><Award size={27}/></div>
        <div><p className="text-sm font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">MyEasyScience V33</p><h1 className="text-3xl font-black md:text-4xl">Student Certificate Wallet</h1></div>
      </div>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Collect personal learning certificates and teacher-verified awards in one place. Organise your achievements, open a certificate, and print a clean copy whenever you need one.</p>
      {error && <p role="status" className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">Teacher-verified records could not be loaded. Your personal certificates remain available in this browser. Ask your administrator to check the V31 and V32 certificate migrations.</p>}
      <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300"><span className="inline-flex items-center gap-2"><Award size={16}/> Personal certificates</span><span className="inline-flex items-center gap-2"><ShieldCheck size={16}/> Teacher-verified awards</span></div>
      <div className="mt-5"><CertificateWallet verifiedCertificates={records}/></div>
    </main>
  );
}
