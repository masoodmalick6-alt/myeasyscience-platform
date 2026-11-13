import CertificateAchievementCentre from "@/components/certificate-achievement-centre";
import { Award, Wallet } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900"><Award size={16}/> Achievements</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Student Certificate & Achievement Centre</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Celebrate the learning milestones you have completed with personalised certificates you can print or save as PDFs.</p>
    </div>
    <div className="mb-6"><Link href="/certificate-wallet" className="btn btn-primary"><Wallet size={17}/> Open my certificate wallet</Link></div>
    <CertificateAchievementCentre />
  </main>;
}
