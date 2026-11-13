import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import CertificateVerificationPortal from "@/components/certificate-verification-portal";

export default function VerifyCertificatePage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-900"><ShieldCheck size={16}/> Certificate verification</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">MyEasyScience Verification Portal</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Check the authenticity and current status of a teacher-issued certificate using its unique reference.</p>
    </div>
    <CertificateVerificationPortal/>
    <p className="mt-7 text-sm text-slate-500">Looking for your own awards? <Link href="/verified-certificates" className="font-bold text-blue-700">View your verified certificates</Link>.</p>
  </main>;
}
