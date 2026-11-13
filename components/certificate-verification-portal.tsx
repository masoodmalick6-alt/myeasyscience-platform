"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Search, ShieldCheck, XCircle } from "lucide-react";
import { verifyCertificate, type CertificateVerificationResult } from "@/app/verify-certificate/actions";

export default function CertificateVerificationPortal() {
  const [reference,setReference]=useState("");
  const [result,setResult]=useState<CertificateVerificationResult|null>(null);
  const [error,setError]=useState("");
  const [pending,startTransition]=useTransition();

  function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setResult(null);
    startTransition(async()=> {
      const response=await verifyCertificate(reference);
      if(response.error) setError(response.error);
      else setResult(response);
    });
  }

  return <div className="space-y-6">
    <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-emerald-950 p-6 text-white md:p-9">
      <div className="flex items-center gap-3 text-emerald-200"><ShieldCheck size={24}/><span className="text-sm font-bold uppercase tracking-[.18em]">Public verification</span></div>
      <h2 className="mt-4 text-3xl font-black md:text-4xl">Check a certificate reference</h2>
      <p className="mt-3 max-w-2xl leading-7 text-indigo-50">Enter the unique reference printed on a teacher-issued MyEasyScience certificate to check whether the award is currently valid.</p>
    </section>
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <label htmlFor="certificate-reference" className="block text-sm font-bold text-slate-800 dark:text-slate-100">Certificate reference</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id="certificate-reference" value={reference} onChange={e=>setReference(e.target.value.toUpperCase())} placeholder="MESV-XXXXXXXXXXXX" maxLength={17} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white p-3 font-mono uppercase tracking-wider dark:border-slate-700 dark:bg-slate-950" required pattern="MESV-[A-F0-9]{12}" title="MESV followed by 12 hexadecimal characters."/>
        <button type="submit" disabled={pending||!reference.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-50"><Search size={18}/>{pending?"Checking…":"Verify certificate"}</button>
      </div>
      <p className="mt-2 text-xs text-slate-500">The reference is case-insensitive. Only teacher-issued certificates have public verification references.</p>
    </form>
    {error&&<div role="alert" className="flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100"><AlertCircle className="shrink-0" size={19}/><span>{error}</span></div>}
    {result&&!result.found&&<div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900"><XCircle className="shrink-0 text-slate-500" size={22}/><div><h3 className="font-bold">No matching certificate found</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Check the reference for typing errors or contact the issuing teacher.</p></div></div>}
    {result?.found&&<section className={`rounded-2xl border p-5 ${result.is_valid?"border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40":"border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"}`}>
      <div className="flex items-center gap-3">{result.is_valid?<CheckCircle2 className="text-emerald-700 dark:text-emerald-300" size={28}/>:<XCircle className="text-red-700 dark:text-red-300" size={28}/>}<div><p className={`text-xs font-black uppercase tracking-wider ${result.is_valid?"text-emerald-800 dark:text-emerald-200":"text-red-800 dark:text-red-200"}`}>Verification result</p><h3 className="text-xl font-black">{result.is_valid?"Valid teacher-issued certificate":"Certificate revoked"}</h3></div></div>
      <div className="mt-5 grid gap-4 border-t border-black/10 pt-4 sm:grid-cols-2">
        <div><p className="text-xs text-slate-500">Certificate title</p><p className="mt-1 font-bold text-slate-900 dark:text-white">{result.certificate_title}</p></div>
        <div><p className="text-xs text-slate-500">Subject</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">{result.certificate_subject}</p></div>
        <div><p className="text-xs text-slate-500">Issued by</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">{result.issuer_name}</p></div>
        <div><p className="text-xs text-slate-500">Date awarded</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">{result.awarded_at?new Date(result.awarded_at).toLocaleDateString():"—"}</p></div>
        <div><p className="text-xs text-slate-500">Certificate reference</p><p className="mt-1 font-mono font-bold text-slate-900 dark:text-white">{result.certificate_ref}</p></div>
        <div><p className="text-xs text-slate-500">Classroom</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">{result.class_name||"Not listed"}</p></div>
      </div>
      {!result.is_valid&&result.revocation_note&&<p className="mt-4 rounded-xl bg-white/70 p-3 text-sm text-red-900 dark:bg-slate-900 dark:text-red-200">Revocation note: {result.revocation_note}</p>}
      <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">This confirms the record in the MyEasyScience certificate system. It does not establish external accreditation or equivalence to a formal qualification.</p>
    </section>}
  </div>;
}
