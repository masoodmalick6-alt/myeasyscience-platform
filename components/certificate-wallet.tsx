"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Search, ShieldCheck, Printer, Trash2, ExternalLink, Filter } from "lucide-react";

type PersonalCertificate = {
  id: string;
  learner: string;
  title: string;
  area: string;
  date: string;
  code: string;
};

type VerifiedCertificate = {
  id: string;
  title: string;
  subject: string;
  teacherNote: string | null;
  awardedAt: string;
  teacherName: string;
  reference: string;
  revoked: boolean;
  revocationNote: string | null;
};

type WalletItem = {
  id: string;
  title: string;
  subject: string;
  awardedAt: string;
  kind: "personal" | "verified";
  status: "Personal" | "Verified" | "Revoked";
  detail: string;
  reference?: string;
  learner?: string;
  teacher?: string;
};

const STORAGE_KEY = "myeasyscience-certificates-v30";

function printableDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function CertificateWallet({ verifiedCertificates }: { verifiedCertificates: VerifiedCertificate[] }) {
  const [personal, setPersonal] = useState<PersonalCertificate[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPersonal(parsed.filter((item) =>
          item && typeof item.id === "string" && typeof item.title === "string"
          && typeof item.code === "string" && typeof item.date === "string"
        ));
      }
    } catch {
      setPersonal([]);
    }
    setReady(true);
  }, []);

  const items = useMemo<WalletItem[]>(() => [
    ...personal.map((certificate) => ({
      id: `personal:${certificate.id}`,
      title: certificate.title,
      subject: certificate.area,
      awardedAt: certificate.date,
      kind: "personal" as const,
      status: "Personal" as const,
      detail: "Personal learning milestone certificate. This is a self-created keepsake, not a teacher-verified award.",
      reference: certificate.code,
      learner: certificate.learner,
    })),
    ...verifiedCertificates.map((certificate) => ({
      id: `verified:${certificate.id}`,
      title: certificate.title,
      subject: certificate.subject,
      awardedAt: certificate.awardedAt,
      kind: "verified" as const,
      status: certificate.revoked ? "Revoked" as const : "Verified" as const,
      detail: certificate.teacherNote || `Awarded by ${certificate.teacherName}.`,
      reference: certificate.reference,
      teacher: certificate.teacherName,
    })),
  ].sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime()), [personal, verifiedCertificates]);

  const filtered = useMemo(() => items.filter((item) => {
    const matchesCategory = category === "all" || item.status.toLowerCase() === category;
    const haystack = `${item.title} ${item.subject} ${item.status} ${item.reference || ""} ${item.teacher || ""}`.toLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLowerCase());
  }), [items, category, query]);

  const selected = items.find((item) => item.id === selectedId) || null;
  const verifiedCount = verifiedCertificates.filter((item) => !item.revoked).length;

  function removePersonal(id: string) {
    const next = personal.filter((item) => `personal:${item.id}` !== id);
    setPersonal(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Browser storage may be unavailable. */ }
    if (selectedId === id) setSelectedId(null);
  }

  function printSelected() {
    if (!selected) return;
    window.print();
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500 dark:text-slate-400">All certificates</p><p className="mt-1 text-3xl font-black">{items.length}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Teacher-verified</p><p className="mt-1 text-3xl font-black">{verifiedCount}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Personal keepsakes</p><p className="mt-1 text-3xl font-black">{personal.length}</p></div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-xl font-black">Your collection</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search, filter and select a certificate to view or print.</p></div>
          <div className="flex flex-wrap gap-2">
            <a href="/certificates" className="btn btn-secondary"><Award size={16}/> Create personal certificate</a>
            <a href="/verified-certificates" className="btn btn-secondary"><ShieldCheck size={16}/> Verified awards</a>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block"><span className="sr-only">Search certificates</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, subject, reference or teacher" className="field pl-10"/></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><Filter size={16}/><span className="sr-only">Filter certificate type</span><select className="field min-w-40" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All certificates</option><option value="personal">Personal</option><option value="verified">Verified</option><option value="revoked">Revoked</option></select></label>
        </div>

        {!ready ? <p className="py-10 text-center text-sm text-slate-500">Loading personal certificates…</p> :
          filtered.length ? <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => <button type="button" key={item.id} onClick={() => setSelectedId(item.id)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selectedId === item.id ? "border-violet-500 ring-2 ring-violet-200 dark:ring-violet-900" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-950`}>
              <div className="flex items-start justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "Verified" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : item.status === "Revoked" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"}`}>{item.status === "Verified" ? "Teacher verified" : item.status === "Revoked" ? "Revoked" : "Personal"}</span>{item.kind === "verified" ? <ShieldCheck size={18} className="text-emerald-700 dark:text-emerald-300"/> : <Award size={18} className="text-amber-700 dark:text-amber-300"/>}</div>
              <h3 className="mt-4 text-lg font-black">{item.title}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.subject}</p><p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{printableDate(item.awardedAt)}</p>
              {item.reference && <p className="mt-2 truncate font-mono text-xs text-slate-500">{item.reference}</p>}
            </button>)}
          </div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"><Award className="mx-auto text-slate-400" size={30}/><h3 className="mt-3 font-bold">No certificates match this view</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try another search or create a personal certificate to start your collection.</p></div>}
      </section>

      {selected && <section className="wallet-print-area overflow-hidden rounded-3xl border-2 border-violet-200 bg-white p-6 text-slate-900 shadow-sm dark:border-violet-900 dark:bg-slate-900 dark:text-white md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-violet-800 dark:text-violet-200">{selected.kind === "verified" ? <ShieldCheck size={20}/> : <Award size={20}/>}<span className="text-xs font-black uppercase tracking-[.16em]">{selected.status === "Verified" ? "Teacher-verified certificate" : selected.status === "Revoked" ? "Revoked certificate record" : "Personal learning certificate"}</span></div><span className="text-xs font-bold text-slate-500">MyEasyScience · V33 Wallet</span></div>
        <div className="mx-auto max-w-2xl py-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700 dark:text-amber-300">Certificate of achievement</p>
          <h2 className="mt-5 text-3xl font-black md:text-4xl">{selected.title}</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{selected.subject}</p>
          <div className="mx-auto my-7 h-px max-w-xs bg-slate-300 dark:bg-slate-700"/>
          <p className="text-sm text-slate-500 dark:text-slate-400">Awarded {printableDate(selected.awardedAt)}</p>
          {selected.learner && <p className="mt-2 text-lg font-bold">{selected.learner}</p>}
          {selected.teacher && <p className="mt-2 text-sm">Issued by {selected.teacher}</p>}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selected.detail}</p>
          {selected.reference && <p className="mt-5 font-mono text-sm font-bold tracking-wider">{selected.reference}</p>}
          {selected.kind === "personal" && <p className="mt-5 text-xs text-amber-700 dark:text-amber-300">Personal keepsake — not independently verified by a teacher.</p>}
          {selected.status === "Revoked" && <p className="mt-5 text-sm font-bold text-red-700 dark:text-red-300">This teacher-issued certificate is revoked and is not currently valid.</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 wallet-actions">
          <button type="button" onClick={printSelected} className="btn btn-primary"><Printer size={16}/> Print / Save as PDF</button>
          {selected.kind === "personal" && <button type="button" onClick={() => removePersonal(selected.id)} className="btn btn-secondary text-red-700"><Trash2 size={16}/> Remove from wallet</button>}
          {selected.kind === "verified" && selected.reference && <a className="btn btn-secondary" href="/verify-certificate"><ExternalLink size={16}/> Public verification</a>}
        </div>
      </section>}
      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Personal certificates are stored in this browser and are not teacher verified. Teacher-issued certificates are retrieved from Supabase for your signed-in account and retain their verification or revocation status.</p>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          .wallet-print-area, .wallet-print-area * { visibility: visible !important; }
          .wallet-print-area { position: absolute !important; inset: 0 !important; width: 100% !important; border: 0 !important; box-shadow: none !important; }
          .wallet-actions { display: none !important; }
          @page { size: landscape; margin: 14mm; }
        }
      `}</style>
    </div>
  );
}
