"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, BookOpenCheck, CheckCircle2, Printer, Trash2 } from "lucide-react";

type Milestone = { id: string; title: string; area: string; description: string };
type Certificate = { id: string; learner: string; title: string; area: string; date: string; code: string };

const milestones: Milestone[] = [
  { id: "science-explorer", title: "Science Explorer", area: "All subjects", description: "Completed a learning journey exploring multiple areas of science." },
  { id: "biology", title: "Biology Discovery", area: "Biology", description: "Completed a biology learning milestone covering living systems and life processes." },
  { id: "chemistry", title: "Chemistry Foundations", area: "Chemistry", description: "Completed a chemistry learning milestone covering matter, elements and reactions." },
  { id: "physics", title: "Physics Foundations", area: "Physics", description: "Completed a physics learning milestone exploring forces, energy and physical systems." },
  { id: "mathematics", title: "Mathematics Practice", area: "Mathematics", description: "Completed a mathematics learning milestone using reasoning and problem solving." },
  { id: "coding", title: "Coding & Computational Thinking", area: "Computer Science", description: "Completed a coding milestone exploring algorithms and programming concepts." },
  { id: "earth-space", title: "Earth & Space Discovery", area: "Earth Science and Astronomy", description: "Completed a learning milestone exploring our planet and the wider universe." },
  { id: "assessment", title: "Science Assessment Practice", area: "Assessment", description: "Completed a practice assessment and reviewed the learning feedback." }
];

const storageKey = "myeasyscience-certificates-v30";

export default function CertificateAchievementCentre() {
  const [learner, setLearner] = useState("");
  const [milestoneId, setMilestoneId] = useState(milestones[0].id);
  const [confirmed, setConfirmed] = useState(false);
  const [records, setRecords] = useState<Certificate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setRecords(JSON.parse(saved) as Certificate[]);
    } catch {
      setRecords([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, ready]);

  const milestone = milestones.find(item => item.id === milestoneId) ?? milestones[0];
  const selected = useMemo(() => records.find(record => record.id === selectedId) ?? null, [records, selectedId]);

  function issueCertificate() {
    const name = learner.trim();
    if (!name || !confirmed) return;
    const now = new Date();
    const code = `MES-${now.getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const certificate: Certificate = {
      id: `${Date.now()}-${code}`,
      learner: name,
      title: milestone.title,
      area: milestone.area,
      date: now.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
      code
    };
    setRecords(previous => [certificate, ...previous]);
    setSelectedId(certificate.id);
    setConfirmed(false);
  }

  function removeCertificate(id: string) {
    setRecords(previous => previous.filter(record => record.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  return <div className="space-y-7">
    <section className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-amber-950 p-6 text-white md:p-9">
      <div className="flex items-center gap-3 text-amber-200"><Award size={23}/><span className="text-sm font-bold uppercase tracking-[.18em]">Celebrate your progress</span></div>
      <h2 className="mt-4 text-3xl font-black md:text-4xl">Every discovery deserves recognition.</h2>
      <p className="mt-3 max-w-2xl leading-7 text-indigo-50">Create a personalised certificate for a learning milestone, revisit your achievements and print a keepsake to celebrate your effort.</p>
    </section>

    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2"><BookOpenCheck className="text-violet-700 dark:text-violet-300"/><h3 className="text-xl font-black text-slate-900 dark:text-white">Create a certificate</h3></div>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Choose the milestone you have completed and enter the learner name exactly as it should appear.</p>
        <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Learner name
          <input value={learner} onChange={event => setLearner(event.target.value)} maxLength={70} placeholder="Enter your name" className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/>
        </label>
        <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Learning milestone
          <select value={milestoneId} onChange={event => setMilestoneId(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">{milestones.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select>
        </label>
        <div className="mt-3 rounded-xl bg-violet-50 p-3 text-sm leading-6 text-violet-950 dark:bg-violet-950 dark:text-violet-100"><strong>{milestone.area}</strong><br/>{milestone.description}</div>
        <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300"><input type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 accent-violet-700"/><span>I confirm that I have completed this learning milestone.</span></label>
        <button onClick={issueCertificate} disabled={!learner.trim() || !confirmed} className="mt-5 w-full rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40">Create my certificate</button>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Certificates are self-reported acknowledgements of learning activity, not accredited qualifications or independently verified awards.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black text-slate-900 dark:text-white">My achievements</h3><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{records.length} earned</span></div>
        {!records.length ? <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"><Award className="mx-auto text-slate-400" size={34}/><p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">Your achievement shelf is waiting</p><p className="mt-1 text-sm text-slate-500">Create your first certificate when you complete a milestone.</p></div> :
          <div className="mt-4 space-y-3">{records.map(record=><div key={record.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${selectedId===record.id?"border-violet-400 bg-violet-50 dark:bg-violet-950/40":"border-slate-200 dark:border-slate-700"}`}><button onClick={()=>setSelectedId(record.id)} className="min-w-0 flex-1 text-left"><p className="truncate font-bold text-slate-900 dark:text-white">{record.title}</p><p className="mt-1 text-xs text-slate-500">{record.date} · {record.area}</p></button><button onClick={()=>removeCertificate(record.id)} aria-label={`Delete ${record.title}`} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"><Trash2 size={17}/></button></div>)}</div>}
        {selected && <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700"><p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Selected certificate</p>
          <div id="myeasyscience-print-certificate" className="certificate-paper relative overflow-hidden border-[8px] border-double border-amber-500 bg-[#fffdf5] p-5 text-center text-slate-900 sm:p-8">
            <div className="absolute inset-2 border border-amber-200 pointer-events-none"/>
            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-500 text-amber-700"><Award size={26}/></div>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[.28em] text-indigo-900">MyEasyScience</p>
              <h4 className="mt-3 font-serif text-2xl font-bold tracking-wide text-indigo-950 sm:text-3xl">Certificate of Achievement</h4>
              <p className="mt-3 text-xs italic text-slate-600">This certificate recognises that</p>
              <p className="mt-2 break-words font-serif text-2xl font-bold text-indigo-950 sm:text-3xl">{selected.learner}</p>
              <div className="mx-auto my-3 h-px max-w-[220px] bg-amber-500"/>
              <p className="text-sm text-slate-700">has self-reported completion of the learning milestone</p>
              <p className="mt-2 font-serif text-xl font-bold text-indigo-950">{selected.title}</p>
              <p className="mt-1 text-xs text-slate-600">{selected.area}</p>
              <p className="mx-auto mt-4 max-w-sm text-[10px] leading-4 text-slate-500">A celebration of curiosity, effort and continued learning. This is a non-accredited, self-reported learning acknowledgement.</p>
              <div className="mt-5 flex justify-between gap-3 text-left text-[10px] text-slate-600"><div><div className="mb-1 h-px w-24 bg-slate-500"/><strong>Date awarded</strong><br/>{selected.date}</div><div className="text-right"><div className="mb-1 ml-auto h-px w-24 bg-slate-500"/><strong>Certificate reference</strong><br/>{selected.code}</div></div>
            </div>
          </div>
          <button onClick={()=>window.print()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800"><Printer size={18}/> Print / Save as PDF</button>
          <p className="mt-2 text-xs text-slate-500">In the print dialog, choose “Save as PDF” to keep a digital copy.</p>
        </div>}
      </section>
    </div>
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"><div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18}/> Your achievements stay on this device</div><p className="mt-1">This version stores certificates in this browser only. They are not synced to a student account or verified by a teacher. Clearing browser storage may remove them.</p></div>
    <style jsx global>{`
      @media print {
        body * { visibility: hidden !important; }
        #myeasyscience-print-certificate, #myeasyscience-print-certificate * { visibility: visible !important; }
        #myeasyscience-print-certificate { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        @page { size: landscape; margin: 12mm; }
      }
    `}</style>
  </div>;
}
