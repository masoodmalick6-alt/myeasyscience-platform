"use client";

import { useState } from "react";
import { Dna, Microscope, Leaf, HeartPulse, RotateCcw, CheckCircle2, Lightbulb } from "lucide-react";

type Organelle = { name: string; role: string; detail: string };
const organelles: Organelle[] = [
  { name: "Nucleus", role: "Control centre", detail: "Stores most of the cell's DNA and helps control cell activities." },
  { name: "Cell membrane", role: "Selective barrier", detail: "Controls what enters and leaves the cell, helping maintain a stable internal environment." },
  { name: "Cytoplasm", role: "Working space", detail: "A jelly-like region where many of the cell's chemical reactions happen." },
  { name: "Mitochondrion", role: "Energy release", detail: "Carries out aerobic respiration, transferring energy into ATP that cells can use." },
  { name: "Ribosomes", role: "Protein makers", detail: "Join amino acids together to build proteins using instructions from messenger RNA." },
  { name: "Chloroplast", role: "Photosynthesis", detail: "In plant and algal cells, chlorophyll captures light energy for photosynthesis." },
  { name: "Cell wall", role: "Support", detail: "A strong outer layer in plants, fungi and many microbes. Plant cell walls contain cellulose." },
  { name: "Vacuole", role: "Storage", detail: "A plant cell's large permanent vacuole stores cell sap and helps keep the cell firm." }
];
const dnaQuestions = [
  { prompt: "A", answer: "T", why: "In DNA, adenine (A) pairs with thymine (T)." },
  { prompt: "C", answer: "G", why: "In DNA, cytosine (C) pairs with guanine (G)." },
  { prompt: "T", answer: "A", why: "Thymine (T) pairs with adenine (A)." },
  { prompt: "G", answer: "C", why: "Guanine (G) pairs with cytosine (C)." }
];
const chains = [
  { id: "grass", name: "Grass", kind: "Producer", level: 1, fact: "Grass makes its own food using sunlight." },
  { id: "grasshopper", name: "Grasshopper", kind: "Primary consumer", level: 2, fact: "The grasshopper gets energy by eating plants." },
  { id: "frog", name: "Frog", kind: "Secondary consumer", level: 3, fact: "A frog can eat grasshoppers." },
  { id: "snake", name: "Snake", kind: "Tertiary consumer", level: 4, fact: "A snake may eat a frog in this example food chain." }
];
const bodyPairs = [
  { organ: "Heart", system: "Circulatory", desc: "Pumps blood around the body." },
  { organ: "Lungs", system: "Respiratory", desc: "Exchange oxygen and carbon dioxide." },
  { organ: "Stomach", system: "Digestive", desc: "Helps break down food." },
  { organ: "Brain", system: "Nervous", desc: "Processes information and coordinates responses." }
];

export function BiologyExplorer() {
  const [tab, setTab] = useState("cell");
  const [selectedOrganelle, setSelectedOrganelle] = useState(organelles[0].name);
  const [dnaIndex, setDnaIndex] = useState(0);
  const [dnaChoice, setDnaChoice] = useState("");
  const [dnaScore, setDnaScore] = useState(0);
  const [dnaDone, setDnaDone] = useState(false);
  const [chain, setChain] = useState<string[]>([]);
  const [bodyIndex, setBodyIndex] = useState(0);
  const [bodyChoice, setBodyChoice] = useState("");
  const [bodyScore, setBodyScore] = useState(0);
  const [bodyDone, setBodyDone] = useState(false);

  const currentOrganelle = organelles.find(x => x.name === selectedOrganelle)!;
  const currentDna = dnaQuestions[dnaIndex];
  const currentBody = bodyPairs[bodyIndex];
  const chainCorrect = chain.length === chains.length && chain.every((id, i) => id === chains[i].id);
  const chainComplete = chain.length === chains.length;

  function answerDna(base: string) {
    if (dnaChoice || dnaDone) return;
    setDnaChoice(base);
    if (base === currentDna.answer) setDnaScore(s => s + 1);
  }
  function nextDna() {
    if (dnaIndex === dnaQuestions.length - 1) setDnaDone(true);
    else { setDnaIndex(i => i + 1); setDnaChoice(""); }
  }
  function answerBody(system: string) {
    if (bodyChoice || bodyDone) return;
    setBodyChoice(system);
    if (system === currentBody.system) setBodyScore(s => s + 1);
  }
  function nextBody() {
    if (bodyIndex === bodyPairs.length - 1) setBodyDone(true);
    else { setBodyIndex(i => i + 1); setBodyChoice(""); }
  }
  function resetDna() { setDnaIndex(0); setDnaChoice(""); setDnaScore(0); setDnaDone(false); }
  function resetBody() { setBodyIndex(0); setBodyChoice(""); setBodyScore(0); setBodyDone(false); }

  return <div className="space-y-6">
    <div className="grid sm:grid-cols-4 gap-3">
      {[["cell","Cell explorer",Microscope],["dna","DNA pairing",Dna],["ecosystem","Food chain",Leaf],["body","Body systems",HeartPulse]].map(([id,label,Icon]: any) =>
        <button key={id} onClick={() => setTab(id)} className={`rounded-2xl border p-4 text-left transition ${tab===id ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100" : "border-slate-200 bg-white hover:border-emerald-300"}`}>
          <Icon size={22} className={tab===id ? "text-emerald-700" : "text-slate-500"}/><div className="font-extrabold mt-2">{label}</div><div className="text-xs text-slate-500 mt-1">Explore and practise</div>
        </button>)}
    </div>

    {tab === "cell" && <section className="card p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Interactive cell lab</p><h2 className="text-2xl font-black mt-1">Explore a plant cell</h2><p className="text-slate-600 text-sm mt-2">Select a labelled part to discover what it does.</p></div><span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">Tap any label</span></div>
      <div className="grid lg:grid-cols-[1fr_.85fr] gap-6 mt-6 items-center">
        <div className="rounded-3xl bg-emerald-50 p-4 md:p-6">
          <svg viewBox="0 0 440 300" role="img" aria-label="Simplified plant cell diagram with selectable organelles" className="w-full max-h-[330px]">
            <rect x="18" y="18" width="404" height="264" rx="75" fill="#bbf7d0" stroke="#15803d" strokeWidth="8"/>
            <rect x="31" y="31" width="378" height="238" rx="65" fill="#ecfccb" stroke="#65a30d" strokeWidth="3"/>
            <ellipse cx="214" cy="150" rx="62" ry="50" fill="#bfdbfe" stroke="#2563eb" strokeWidth="3"/>
            <circle cx="214" cy="150" r="18" fill="#1d4ed8"/>
            <ellipse cx="105" cy="100" rx="38" ry="18" fill="#86efac" stroke="#15803d" strokeWidth="3"/>
            <path d="M76 100h58 M86 91h38 M86 109h38" stroke="#15803d" strokeWidth="2"/>
            <ellipse cx="320" cy="92" rx="38" ry="18" fill="#86efac" stroke="#15803d" strokeWidth="3"/>
            <path d="M291 92h58 M301 83h38 M301 101h38" stroke="#15803d" strokeWidth="2"/>
            <ellipse cx="118" cy="210" rx="24" ry="12" fill="#fca5a5" stroke="#be123c" strokeWidth="2" transform="rotate(-25 118 210)"/>
            <ellipse cx="310" cy="205" rx="24" ry="12" fill="#fca5a5" stroke="#be123c" strokeWidth="2" transform="rotate(25 310 205)"/>
            <ellipse cx="215" cy="235" rx="48" ry="19" fill="#fde68a" stroke="#a16207" strokeWidth="2"/>
            <g fill="#166534" fontSize="11" fontWeight="700"><text x="214" y="155" textAnchor="middle">NUCLEUS</text><text x="105" y="73" textAnchor="middle">CHLOROPLAST</text><text x="320" y="65" textAnchor="middle">CHLOROPLAST</text><text x="214" y="239" textAnchor="middle">VACUOLE</text></g>
            <g fill="#334155" fontSize="10"><text x="220" y="14" textAnchor="middle">CELL WALL</text><text x="220" y="295" textAnchor="middle">CELL MEMBRANE + CYTOPLASM</text></g>
          </svg>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {organelles.map(o => <button key={o.name} onClick={()=>setSelectedOrganelle(o.name)} className={`text-xs font-bold rounded-xl px-3 py-2 border ${selectedOrganelle===o.name ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100"}`}>{o.name}</button>)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Selected structure</div><h3 className="text-2xl font-black mt-2">{currentOrganelle.name}</h3><div className="inline-block mt-2 bg-blue-50 text-blue-800 rounded-full px-3 py-1 text-xs font-bold">{currentOrganelle.role}</div><p className="text-slate-600 leading-7 mt-4">{currentOrganelle.detail}</p>
          <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 flex gap-2"><Lightbulb size={18} className="shrink-0 mt-0.5"/>Plant cells have a cell wall, chloroplasts and usually a large permanent vacuole. Animal cells do not have these structures.</div>
        </div>
      </div>
    </section>}

    {tab === "dna" && <section className="card p-5 md:p-7">
      <p className="text-emerald-700 text-sm font-bold uppercase tracking-wider">DNA base-pair challenge</p><h2 className="text-2xl font-black mt-1">Build the matching DNA strand</h2><p className="text-slate-600 text-sm mt-2">Choose the base that pairs with the one shown.</p>
      {!dnaDone ? <div className="max-w-xl mx-auto text-center py-8">
        <div className="text-sm text-slate-500 font-bold">BASE ON THE ORIGINAL STRAND</div><div className="mx-auto my-4 w-24 h-24 rounded-3xl bg-blue-100 text-blue-800 grid place-items-center text-5xl font-black">{currentDna.prompt}</div>
        <div className="text-slate-600 font-semibold">Which base belongs opposite it?</div>
        <div className="grid grid-cols-4 gap-3 mt-5">{["A","T","C","G"].map(b=><button key={b} onClick={()=>answerDna(b)} className={`rounded-2xl border-2 py-4 text-2xl font-black ${dnaChoice===b ? (b===currentDna.answer ? "bg-emerald-100 border-emerald-500 text-emerald-800" : "bg-rose-100 border-rose-400 text-rose-800") : "border-slate-200 hover:border-blue-400"}`}>{b}</button>)}</div>
        {dnaChoice && <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left"><p className="font-bold">{dnaChoice===currentDna.answer ? "That's right!" : "Not quite — try to remember the pairing rule."}</p><p className="text-sm text-slate-600 mt-1">{currentDna.why}</p><button className="btn btn-primary mt-3" onClick={nextDna}>{dnaIndex===dnaQuestions.length-1 ? "See score" : "Next base"}</button></div>}
        <p className="text-sm text-slate-500 mt-5">Question {dnaIndex+1} of {dnaQuestions.length} · Score {dnaScore}</p>
      </div> : <div className="text-center py-10"><CheckCircle2 className="mx-auto text-emerald-600" size={44}/><h3 className="text-2xl font-black mt-3">DNA challenge complete</h3><p className="text-slate-600 mt-2">You scored {dnaScore} out of {dnaQuestions.length}.</p><button onClick={resetDna} className="btn btn-primary mt-5"><RotateCcw size={16}/> Try again</button></div>}
    </section>}

    {tab === "ecosystem" && <section className="card p-5 md:p-7">
      <p className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Ecosystem builder</p><h2 className="text-2xl font-black mt-1">Arrange a food chain</h2><p className="text-slate-600 text-sm mt-2">Select the organisms in the order energy flows, starting with the producer.</p>
      <div className="grid sm:grid-cols-4 gap-3 mt-6">{chains.map(c=><button key={c.id} disabled={chain.includes(c.id)||chainComplete} onClick={()=>setChain(v=>[...v,c.id])} className={`rounded-2xl border p-4 text-left disabled:opacity-60 ${chain.includes(c.id) ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-emerald-400"}`}><div className="text-xs text-slate-500 font-bold">{c.kind}</div><div className="font-black text-lg mt-1">{c.name}</div><div className="text-xs text-slate-500 mt-2">{chain.includes(c.id) ? `Position ${chain.indexOf(c.id)+1}` : "Tap to add"}</div></button>)}</div>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4"><div className="font-bold mb-3">Your food chain</div><div className="flex flex-wrap items-center gap-2">{chain.length ? chain.map((id,i)=><span key={id} className="flex items-center gap-2"><span className="rounded-lg bg-white border px-3 py-2 font-bold">{chains.find(c=>c.id===id)?.name}</span>{i<chain.length-1 && <span className="text-emerald-700 font-black">→</span>}</span>) : <span className="text-sm text-slate-500">Your choices will appear here.</span>}</div>
      {chainComplete && <div className={`mt-4 p-4 rounded-xl ${chainCorrect ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}><p className="font-bold">{chainCorrect ? "Excellent — the energy pathway is correct!" : "Good try! Review the energy pathway."}</p><p className="text-sm mt-1">{chainCorrect ? "Energy moves from the producer to consumers." : "The correct order is grass → grasshopper → frog → snake."}</p><button className="underline text-sm font-bold mt-2" onClick={()=>setChain([])}>Reset activity</button></div>}</div>
      <p className="text-sm text-slate-500 mt-4">Remember: arrows in a food chain point in the direction energy is transferred.</p>
    </section>}

    {tab === "body" && <section className="card p-5 md:p-7">
      <p className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Human biology challenge</p><h2 className="text-2xl font-black mt-1">Match organs to body systems</h2><p className="text-slate-600 text-sm mt-2">Choose the system that includes the organ shown.</p>
      {!bodyDone ? <div className="max-w-xl mx-auto text-center py-8"><div className="text-xs font-bold text-slate-500">ORGAN {bodyIndex+1} OF {bodyPairs.length}</div><div className="text-3xl font-black my-5">{currentBody.organ}</div><p className="text-slate-600">{currentBody.desc}</p><div className="grid grid-cols-2 gap-3 mt-6">{["Circulatory","Respiratory","Digestive","Nervous"].map(s=><button key={s} onClick={()=>answerBody(s)} className={`rounded-xl border p-4 font-bold ${bodyChoice===s ? (s===currentBody.system ? "bg-emerald-100 border-emerald-500" : "bg-rose-100 border-rose-400") : "hover:border-emerald-400"}`}>{s}</button>)}</div>
        {bodyChoice && <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left"><p className="font-bold">{bodyChoice===currentBody.system ? "Correct match!" : `The answer is ${currentBody.system}.`}</p><p className="text-sm text-slate-600 mt-1">{currentBody.desc}</p><button className="btn btn-primary mt-3" onClick={nextBody}>{bodyIndex===bodyPairs.length-1 ? "See score" : "Next organ"}</button></div>}</div> : <div className="text-center py-10"><CheckCircle2 className="mx-auto text-emerald-600" size={44}/><h3 className="text-2xl font-black mt-3">Body systems complete</h3><p className="text-slate-600 mt-2">You scored {bodyScore} out of {bodyPairs.length}.</p><button onClick={resetBody} className="btn btn-primary mt-5"><RotateCcw size={16}/> Practise again</button></div>}
    </section>}
  </div>;
}
