"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Bug, Dna, Wind, RotateCcw, CheckCircle2, XCircle, Microscope } from "lucide-react";

type Tab = "microbes" | "immunity" | "prevention" | "resistance";

const microbeInfo = {
  bacteria: {
    name: "Bacteria", shape: "Single-celled prokaryotes", color: "bg-sky-100 text-sky-800",
    description: "Bacteria are living cells without a nucleus. Many are harmless or helpful, while some can cause disease.",
    facts: ["Usually have a cell membrane, cytoplasm and ribosomes", "Many have a cell wall; some move using flagella", "Reproduce mainly by binary fission"],
    example: "Lactobacillus — a group used in making yoghurt"
  },
  viruses: {
    name: "Viruses", shape: "Non-cellular infectious agents", color: "bg-violet-100 text-violet-800",
    description: "Viruses are not cells. They contain genetic material inside a protein coat and can make copies only by using a host cell.",
    facts: ["Contain DNA or RNA as genetic material", "Have a protein coat called a capsid", "Some also have a lipid envelope"],
    example: "Influenza virus — infects cells in the respiratory tract"
  },
  fungi: {
    name: "Fungi", shape: "Eukaryotes: yeasts or multicellular forms", color: "bg-amber-100 text-amber-800",
    description: "Fungi are organisms with cells that contain nuclei. They absorb nutrients from their surroundings.",
    facts: ["Yeasts are single-celled; moulds form hyphae", "Fungal cell walls contain chitin", "Many decompose dead material; some cause infections"],
    example: "Saccharomyces cerevisiae — baker's yeast"
  },
  protozoa: {
    name: "Protozoa", shape: "Single-celled eukaryotes", color: "bg-emerald-100 text-emerald-800",
    description: "Protozoa are diverse single-celled organisms with a nucleus. Some live freely; others are parasites.",
    facts: ["Have a nucleus and other cell structures", "Some move using cilia, flagella or pseudopodia", "Some species cause diseases"],
    example: "Paramecium — a freshwater microorganism"
  },
};

const preventionQuestions = [
  { q: "A classroom feels stuffy during a respiratory illness season. Which action can reduce the build-up of airborne particles?", options: ["Improve ventilation", "Share drinking bottles", "Keep windows sealed all day"], answer: 0, why: "Fresh-air exchange helps dilute airborne particles. Follow local guidance for indoor air quality." },
  { q: "You are preparing food. What is the best everyday way to reduce transfer of microbes from hands to food?", options: ["Wash hands with soap and water", "Wipe hands on clothing", "Rinse hands for one second"], answer: 0, why: "Thorough handwashing with soap and water helps remove dirt and microbes." },
  { q: "Why are recommended vaccines useful at a population level?", options: ["They train immune responses against specific targets", "They treat every infection instantly", "They replace all hygiene measures"], answer: 0, why: "Vaccines prepare immune memory for particular pathogens; they complement, not replace, other prevention measures." },
  { q: "Raw food and ready-to-eat food are being prepared. Which practice helps prevent cross-contamination?", options: ["Use separate clean equipment", "Use the same unwashed board", "Leave food at room temperature for hours"], answer: 0, why: "Separate, properly cleaned equipment reduces transfer between foods." },
];

const stages = [
  { title: "1. Barrier defences", text: "Skin, mucus and other physical or chemical barriers help stop microbes entering the body.", tag: "Innate immunity" },
  { title: "2. Early response", text: "If microbes get past barriers, cells and chemical signals of the innate immune system respond quickly.", tag: "Innate immunity" },
  { title: "3. Recognition and presentation", text: "Some immune cells display pieces of a microbe (antigens), helping activate a targeted response.", tag: "Bridge to adaptive immunity" },
  { title: "4. Targeted response", text: "B cells can make antibodies; T cells help coordinate responses or destroy infected cells.", tag: "Adaptive immunity" },
  { title: "5. Immune memory", text: "Some B and T cells remain as memory cells, allowing a faster response if the same antigen is encountered again.", tag: "Adaptive immunity" },
];

export function MicrobiologyLab() {
  const [tab, setTab] = useState<Tab>("microbes");
  const [microbe, setMicrobe] = useState<keyof typeof microbeInfo>("bacteria");
  const [stage, setStage] = useState(0);
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [antibiotic, setAntibiotic] = useState(true);
  const [generations, setGenerations] = useState(0);
  const resistant = useMemo(() => {
    let p = 0.08;
    for (let i = 0; i < generations; i++) {
      // Illustrative selection: resistant bacteria survive treatment more often.
      const susceptibleSurvival = antibiotic ? 0.12 : 0.88;
      const resistantSurvival = antibiotic ? 0.82 : 0.88;
      p = (p * resistantSurvival) / (p * resistantSurvival + (1 - p) * susceptibleSurvival);
      p = Math.min(0.99, Math.max(0.01, p));
    }
    return p;
  }, [generations, antibiotic]);
  const current = microbeInfo[microbe];
  const score = preventionQuestions.reduce((n, item, i) => n + (answers[i] === item.answer ? 1 : 0), 0);

  return <section className="mt-10 rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 md:p-8">
    <div className="flex flex-wrap items-center gap-2 text-cyan-800 text-sm font-bold"><span className="rounded-full bg-cyan-100 px-3 py-1 inline-flex items-center gap-2"><Microscope size={15}/> V18 · Virtual biology lab</span><span className="text-slate-500 font-medium">Microbiology & immunity</span></div>
    <h2 className="mt-3 text-3xl font-black text-slate-900">Meet the microbes. Understand your defences.</h2>
    <p className="mt-2 max-w-3xl text-slate-600 leading-7">Explore different kinds of microorganisms, step through an immune response, practise prevention choices and model how antibiotic resistance can become more common.</p>

    <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Microbiology lab activities">
      {([
        ["microbes", "Microbe explorer"], ["immunity", "Immune response"], ["prevention", "Prevention challenge"], ["resistance", "Resistance model"]
      ] as [Tab, string][]).map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === id ? "bg-cyan-700 text-white shadow" : "bg-white text-slate-700 border border-slate-200 hover:border-cyan-400"}`}>{label}</button>)}
    </div>

    {tab === "microbes" && <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(microbeInfo) as (keyof typeof microbeInfo)[]).map((key) => <button key={key} onClick={() => setMicrobe(key)} className={`rounded-2xl border p-4 text-left transition ${microbe === key ? "border-cyan-500 bg-white ring-2 ring-cyan-100" : "border-slate-200 bg-white/70 hover:border-cyan-300"}`}>
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${microbeInfo[key].color}`}>{microbeInfo[key].name}</span>
          <div className="mt-3 flex h-20 items-center justify-center">
            {key === "bacteria" && <div className="relative h-12 w-20 rotate-[-18deg] rounded-full border-4 border-sky-500 bg-sky-200"><span className="absolute left-4 top-3 h-2 w-2 rounded-full bg-sky-700"/><span className="absolute left-10 top-6 h-2 w-2 rounded-full bg-sky-700"/><span className="absolute -right-5 top-5 h-5 w-8 border-b-2 border-sky-500 rounded-full"/></div>}
            {key === "viruses" && <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-violet-500 bg-violet-200"><div className="h-5 w-5 rounded-full bg-violet-600"/>{Array.from({length:8}).map((_,i)=><span key={i} className="absolute h-4 w-1 origin-bottom rounded-full bg-violet-500" style={{transform:`rotate(${i*45}deg) translateY(-27px)`}}/>)}</div>}
            {key === "fungi" && <div className="relative h-14 w-16"><div className="absolute bottom-0 left-6 h-9 w-5 rounded-t-full bg-amber-300 border-2 border-amber-600"/><div className="absolute bottom-7 left-1 h-5 w-14 rounded-t-full border-2 border-amber-700 bg-amber-200"/><div className="absolute bottom-0 left-0 h-2 w-16 rounded-full bg-amber-500"/></div>}
            {key === "protozoa" && <div className="relative h-14 w-16 rounded-[45%] border-4 border-emerald-500 bg-emerald-200 rotate-12"><span className="absolute left-6 top-4 h-4 w-4 rounded-full bg-emerald-700"/>{Array.from({length:7}).map((_,i)=><span key={i} className="absolute left-7 top-[-5px] h-3 w-0.5 origin-bottom bg-emerald-600" style={{transform:`rotate(${i*22-66}deg) translateY(-7px)`}}/>)}</div>}
          </div>
          <p className="text-xs text-slate-500">{microbeInfo[key].shape}</p>
        </button>)}
      </div>
      <div className="rounded-2xl bg-white p-5 border border-slate-200">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${current.color}`}>Selected group</span>
        <h3 className="mt-3 text-2xl font-black text-slate-900">{current.name}</h3>
        <p className="mt-2 text-slate-600 leading-7">{current.description}</p>
        <h4 className="mt-5 font-bold text-slate-900">Key features</h4>
        <ul className="mt-2 space-y-2">{current.facts.map((fact) => <li key={fact} className="flex gap-2 text-sm text-slate-700"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600"/>{fact}</li>)}</ul>
        <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide font-bold text-slate-500">Example</p><p className="mt-1 font-semibold text-slate-800">{current.example}</p></div>
        {microbe === "viruses" && <p className="mt-4 text-sm text-violet-800 bg-violet-50 rounded-xl p-3">Remember: antibiotics target bacterial structures or processes. They do not treat viral infections.</p>}
      </div>
    </div>}

    {tab === "immunity" && <div className="mt-6 grid gap-5 md:grid-cols-[1fr_0.8fr]">
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black">Follow the response</h3><span className="text-sm font-bold text-cyan-800">Step {stage + 1} of {stages.length}</span></div>
        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-cyan-600 transition-all" style={{width:`${((stage+1)/stages.length)*100}%`}}/></div>
        <div className="mt-6 min-h-36 rounded-2xl bg-cyan-50 p-5">
          <span className="text-xs uppercase tracking-wide font-bold text-cyan-800">{stages[stage].tag}</span>
          <h4 className="mt-2 text-2xl font-black text-slate-900">{stages[stage].title}</h4>
          <p className="mt-2 leading-7 text-slate-700">{stages[stage].text}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2"><button disabled={stage===0} onClick={()=>setStage(s=>s-1)} className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 disabled:opacity-40">Previous</button><button onClick={()=>setStage(s=>s===stages.length-1?0:s+1)} className="rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white">{stage===stages.length-1?"Restart journey":"Next step"}</button></div>
      </div>
      <aside className="rounded-2xl bg-slate-900 p-5 text-white">
        <ShieldCheck size={30} className="text-cyan-300"/>
        <h3 className="mt-3 text-xl font-black">Two connected systems</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300"><strong className="text-white">Innate immunity</strong> responds quickly and broadly. It includes barriers, inflammation and cells that act against many kinds of threats.</p>
        <p className="mt-3 text-sm leading-6 text-slate-300"><strong className="text-white">Adaptive immunity</strong> targets particular antigens. B cells, T cells and immune memory help make the response specific.</p>
        <p className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-cyan-100">This is a simplified overview. Real immune responses overlap and involve many more cell types and signals.</p>
      </aside>
    </div>}

    {tab === "prevention" && <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Everyday prevention challenge</h3><p className="mt-1 text-sm text-slate-500">Choose the strongest general prevention action in each scenario.</p></div><span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-800">Score: {score}/{preventionQuestions.length}</span></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {preventionQuestions.map((item,i)=><div key={item.q} className="rounded-xl border border-slate-200 p-4">
          <p className="font-bold text-slate-900">{i+1}. {item.q}</p>
          <div className="mt-3 space-y-2">{item.options.map((option,j)=><button key={option} onClick={()=>setAnswers(a=>({...a,[i]:j}))} className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${answers[i]===j ? (j===item.answer?"border-emerald-400 bg-emerald-50 text-emerald-900":"border-rose-300 bg-rose-50 text-rose-900") : "border-slate-200 hover:border-cyan-400"}`}>{option}</button>)}</div>
          {answers[i]!==undefined && <p className={`mt-3 flex gap-2 text-sm ${answers[i]===item.answer?"text-emerald-700":"text-slate-600"}`}>{answers[i]===item.answer?<CheckCircle2 size={17}/>:<XCircle size={17}/>}<span>{item.why}</span></p>}
        </div>)}
      </div>
      <button onClick={()=>setAnswers({})} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"><RotateCcw size={15}/> Reset challenge</button>
    </div>}

    {tab === "resistance" && <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <h3 className="text-xl font-black">Natural selection in a bacterial population</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Start with a small resistant minority. In this teaching model, treatment removes susceptible bacteria more often, so resistant bacteria make up a larger share of survivors.</p>
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm font-bold"><span>Antibiotic exposure</span><span className={antibiotic?"text-rose-700":"text-emerald-700"}>{antibiotic?"Treatment applied":"No treatment"}</span></div>
          <div className="mt-3 flex gap-2"><button onClick={()=>{setAntibiotic(true);setGenerations(0)}} className={`rounded-lg px-3 py-2 text-sm font-bold ${antibiotic?"bg-rose-700 text-white":"bg-white border text-slate-700"}`}>Apply treatment</button><button onClick={()=>{setAntibiotic(false);setGenerations(0)}} className={`rounded-lg px-3 py-2 text-sm font-bold ${!antibiotic?"bg-emerald-700 text-white":"bg-white border text-slate-700"}`}>No treatment</button></div>
          <div className="mt-5"><div className="flex justify-between text-sm"><span>Generation {generations}</span><strong>{Math.round(resistant*100)}% resistant</strong></div><div className="mt-2 flex h-7 overflow-hidden rounded-full bg-slate-200"><div className="bg-fuchsia-600 transition-all" style={{width:`${resistant*100}%`}}/><div className="bg-sky-400 transition-all" style={{width:`${(1-resistant)*100}%`}}/></div><div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600"><span>■ Resistant</span><span>■ Susceptible</span></div></div>
          <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>setGenerations(g=>Math.min(8,g+1))} disabled={generations>=8} className="rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white disabled:opacity-40">Advance one generation</button><button onClick={()=>setGenerations(0)} className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700">Reset</button></div>
        </div>
      </div>
      <aside className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-center gap-2"><Dna className="text-fuchsia-700"/><h3 className="text-xl font-black">What does it show?</h3></div>
        <p className="mt-3 text-sm leading-6 text-slate-600">Antibiotic resistance is a population-level change. Resistant variants may already exist; when an antibiotic is used, susceptible bacteria are more likely to be removed and resistant ones can become a larger fraction of the survivors.</p>
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><strong>Important:</strong> Antibiotics do not make bacteria deliberately adapt, and this simplified model does not represent a real infection or treatment plan.</div>
        <p className="mt-4 text-sm leading-6 text-slate-600">Use antibiotics only when prescribed by a qualified healthcare professional, and follow their instructions. They do not work against viruses.</p>
      </aside>
    </div>}
    <p className="mt-6 border-t border-cyan-100 pt-4 text-xs leading-5 text-slate-500">Educational simulation only. The diagrams and numerical model are illustrative, not clinical tools or laboratory protocols. No real microorganisms are cultured or handled.</p>
  </section>;
}
