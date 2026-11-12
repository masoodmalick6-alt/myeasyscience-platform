"use client";

import { useMemo, useState } from "react";
import { Microscope, Dna, HeartPulse, Sprout, RotateCcw, Info } from "lucide-react";

const slides = [
  { id:"onion", name:"Onion epidermis", note:"Plant tissue", detail:"Rectangular cells form a tile-like pattern. The cell wall is easy to see; a prepared stain may make the nucleus easier to distinguish.", shape:"rect" },
  { id:"cheek", name:"Cheek cells", note:"Animal tissue", detail:"Cheek cells are flatter and more irregular than typical plant cells. They have no cell wall or chloroplasts.", shape:"round" },
  { id:"leaf", name:"Leaf cells", note:"Photosynthetic tissue", detail:"Many leaf cells contain chloroplasts. Their green pigment absorbs light used in photosynthesis.", shape:"leaf" }
];
const organs = [
  { name:"Brain", system:"Nervous system", job:"Processes information and coordinates many body activities.", fact:"The brain communicates with the body through the spinal cord and nerves.", x:50,y:13 },
  { name:"Lungs", system:"Respiratory system", job:"Exchange oxygen and carbon dioxide between air and blood.", fact:"Gas exchange occurs across tiny air sacs called alveoli.", x:38,y:37 },
  { name:"Heart", system:"Circulatory system", job:"Pumps blood through the pulmonary and systemic circuits.", fact:"The heart has four chambers in humans.", x:57,y:43 },
  { name:"Stomach", system:"Digestive system", job:"Mixes food with acid and enzymes as digestion continues.", fact:"The stomach is one part of a longer digestive tract.", x:49,y:58 },
  { name:"Small intestine", system:"Digestive system", job:"Completes much digestion and absorbs most nutrients.", fact:"Villi and microvilli increase the surface area for absorption.", x:53,y:69 }
];

export function BiologyAdvanced() {
  const [tab,setTab]=useState("microscope");
  const [slide,setSlide]=useState("onion");
  const [zoom,setZoom]=useState(2);
  const [mom,setMom]=useState("Aa");
  const [dad,setDad]=useState("Aa");
  const [organ,setOrgan]=useState("Heart");
  const [prey,setPrey]=useState(60);
  const [predator,setPredator]=useState(18);
  const [season,setSeason]=useState(0);
  const [history,setHistory]=useState<{prey:number,predator:number}[]>([]);
  const selectedSlide=slides.find(s=>s.id===slide)!;
  const selectedOrgan=organs.find(o=>o.name===organ)!;
  const alleles=(g:string)=>g.split("");
  const offspring=useMemo(()=>{
    const a=alleles(mom), b=alleles(dad);
    return [a[0]+b[0],a[0]+b[1],a[1]+b[0],a[1]+b[1]].map(g=>g[0]===g[1]?g:g.split("").sort().join(""));
  },[mom,dad]);
  const dominant=offspring.filter(g=>g.includes("A")).length;
  function runSeason(){
    const nextPrey=Math.max(0,Math.min(100,Math.round(prey + prey*0.18 - predator*0.35)));
    const nextPred=Math.max(0,Math.min(100,Math.round(predator + predator*0.08 + prey*0.08 - predator*0.12)));
    setPrey(nextPrey); setPredator(nextPred); setSeason(s=>s+1);
    setHistory(h=>[...h.slice(-5),{prey:nextPrey,predator:nextPred}]);
  }
  function resetEco(){setPrey(60);setPredator(18);setSeason(0);setHistory([]);}
  return <section className="mt-10 space-y-5">
    <div><p className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Biology studio · new activities</p><h2 className="text-3xl font-black mt-2">Go deeper with biology simulations</h2><p className="text-slate-600 mt-2">Explore sample slides, model inherited traits, investigate body organs and experiment with population changes.</p></div>
    <div className="grid sm:grid-cols-4 gap-3">
      {[["microscope","Virtual microscope",Microscope],["genetics","Genetics simulator",Dna],["anatomy","Anatomy explorer",HeartPulse],["ecosystem","Population lab",Sprout]].map(([id,label,Icon]:any)=><button key={id} onClick={()=>setTab(id)} className={`rounded-2xl border p-4 text-left ${tab===id?"bg-emerald-50 border-emerald-500 ring-2 ring-emerald-100":"bg-white border-slate-200 hover:border-emerald-300"}`}><Icon size={22} className="text-emerald-700"/><div className="font-extrabold mt-2">{label}</div></button>)}
    </div>
    {tab==="microscope" && <div className="card p-5 md:p-7">
      <h3 className="text-2xl font-black">Virtual microscope</h3><p className="text-sm text-slate-600 mt-1">Choose a prepared sample and change the magnification. These are schematic teaching illustrations, not microscope photographs.</p>
      <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-6 mt-5">
        <div className="space-y-3"><label className="block text-sm font-bold">Prepared slide</label><select className="field w-full" value={slide} onChange={e=>setSlide(e.target.value)}>{slides.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select><label className="block text-sm font-bold pt-2">Magnification · {zoom*100}×</label><input className="w-full accent-emerald-600" type="range" min="1" max="8" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><div className="flex justify-between text-xs text-slate-500"><span>100×</span><span>800×</span></div><div className="rounded-xl bg-emerald-50 p-4"><b>{selectedSlide.note}</b><p className="text-sm leading-6 mt-2 text-slate-700">{selectedSlide.detail}</p></div></div>
        <div className="rounded-3xl bg-slate-950 p-5 flex items-center justify-center min-h-[300px] overflow-hidden"><div className="rounded-full border-[12px] border-slate-600 bg-emerald-950 w-full max-w-[340px] aspect-square flex items-center justify-center overflow-hidden"><div style={{transform:`scale(${zoom/2})`}} className="grid grid-cols-3 gap-1 transition-transform duration-300">{Array.from({length:9},(_,i)=><div key={i} className={`${selectedSlide.shape==="rect"?"rounded-md w-16 h-20 border-2 border-emerald-300 bg-lime-300/20":selectedSlide.shape==="leaf"?"rounded-[45%] w-16 h-20 border-2 border-lime-300 bg-green-400/20":"rounded-[45%] w-16 h-16 border-2 border-sky-300 bg-sky-300/20"} relative`}><span className="absolute w-3 h-3 rounded-full bg-fuchsia-300/90 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"/>{selectedSlide.shape==="leaf"&&<span className="absolute inset-y-2 left-3 right-3 border-l border-r border-lime-200"/>}</div>)}</div></div></div>
      </div>
    </div>}
    {tab==="genetics" && <div className="card p-5 md:p-7">
      <h3 className="text-2xl font-black">Simple inheritance simulator</h3><p className="text-sm text-slate-600 mt-1">Model one gene with two alleles: A is dominant and a is recessive. This is a simplified Mendelian example, not a prediction of a real person's traits.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">{[["Parent 1",mom,setMom],["Parent 2",dad,setDad]].map(([label,value,setter]:any)=><label key={label} className="font-bold text-sm">{label}<select className="field w-full mt-2" value={value} onChange={e=>setter(e.target.value)}><option value="AA">AA</option><option value="Aa">Aa</option><option value="aa">aa</option></select></label>)}</div>
      <div className="mt-6 max-w-md"><div className="font-bold mb-2">Punnett square outcomes</div><div className="grid grid-cols-3 gap-2 text-center"><div/><div className="rounded-lg bg-slate-100 p-3 font-black">{mom[0]}</div><div className="rounded-lg bg-slate-100 p-3 font-black">{mom[1]}</div><div className="rounded-lg bg-slate-100 p-3 font-black">{dad[0]}</div><div className="rounded-lg bg-emerald-100 p-3 font-black text-emerald-900">{offspring[0]}</div><div className="rounded-lg bg-emerald-100 p-3 font-black text-emerald-900">{offspring[2]}</div><div className="rounded-lg bg-slate-100 p-3 font-black">{dad[1]}</div><div className="rounded-lg bg-emerald-100 p-3 font-black text-emerald-900">{offspring[1]}</div><div className="rounded-lg bg-emerald-100 p-3 font-black text-emerald-900">{offspring[3]}</div></div></div>
      <div className="mt-5 rounded-xl bg-blue-50 p-4"><b>Model result</b><p className="text-sm mt-1">{dominant}/4 outcomes have at least one dominant A allele ({dominant*25}%); {(4-dominant)}/4 are aa ({(4-dominant)*25}%). Each square represents an equally likely allele combination in this simplified model.</p></div>
    </div>}
    {tab==="anatomy" && <div className="card p-5 md:p-7">
      <h3 className="text-2xl font-black">Human anatomy explorer</h3><p className="text-sm text-slate-600 mt-1">Select an organ marker to explore its system and function. The diagram is schematic and not to scale.</p>
      <div className="grid lg:grid-cols-[.8fr_1fr] gap-6 mt-5 items-center">
        <div className="rounded-2xl bg-rose-50 p-5 flex justify-center"><svg viewBox="0 0 200 340" className="w-full max-w-[220px]" role="img" aria-label="Simplified human torso diagram with selectable organ markers"><circle cx="100" cy="34" r="27" fill="#f3c9ae" stroke="#9a5d49" strokeWidth="2"/><path d="M75 66 Q42 70 35 115 L48 200 L60 200 L65 145 L68 300 L132 300 L135 145 L140 200 L152 200 L165 115 Q158 70 125 66Z" fill="#f3c9ae" stroke="#9a5d49" strokeWidth="2"/><path d="M100 82 L100 115 M100 115 Q70 98 67 135 Q68 160 96 155 Q100 150 100 115 Q130 98 133 135 Q132 160 104 155" fill="#fda4af" stroke="#be123c" strokeWidth="2"/><path d="M100 119 L100 166" stroke="#be123c" strokeWidth="4"/><path d="M84 170 Q65 175 80 202 Q100 220 120 202 Q135 175 116 170Z" fill="#f59e0b" stroke="#92400e" strokeWidth="2"/>{organs.map(o=><g key={o.name} onClick={()=>setOrgan(o.name)} className="cursor-pointer"><circle cx={o.x*2} cy={o.y*3.1} r={organ===o.name?10:7} fill={organ===o.name?"#047857":"#2563eb"} stroke="white" strokeWidth="2"/><circle cx={o.x*2} cy={o.y*3.1} r="14" fill="transparent"/></g>)}</svg></div>
        <div className="rounded-2xl border p-5"><div className="text-xs uppercase tracking-wider font-bold text-rose-700">Selected organ</div><h4 className="text-2xl font-black mt-2">{selectedOrgan.name}</h4><span className="inline-block mt-2 rounded-full bg-rose-50 text-rose-800 px-3 py-1 text-xs font-bold">{selectedOrgan.system}</span><p className="mt-4 text-slate-700 leading-7">{selectedOrgan.job}</p><div className="mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-600"><Info size={16} className="inline mr-2"/>{selectedOrgan.fact}</div><div className="flex flex-wrap gap-2 mt-5">{organs.map(o=><button key={o.name} onClick={()=>setOrgan(o.name)} className={`text-xs rounded-lg border px-3 py-2 font-bold ${organ===o.name?"bg-rose-700 text-white border-rose-700":"border-slate-200 hover:bg-rose-50"}`}>{o.name}</button>)}</div></div>
      </div>
    </div>}
    {tab==="ecosystem" && <div className="card p-5 md:p-7">
      <h3 className="text-2xl font-black">Predator–prey population lab</h3><p className="text-sm text-slate-600 mt-1">Adjust starting populations, then run a simplified season to see how populations might change. This toy model is illustrative, not a scientific forecast.</p>
      <div className="grid md:grid-cols-2 gap-5 mt-5">{[["Prey population",prey,setPrey],["Predator population",predator,setPredator]].map(([label,value,setter]:any)=><label key={label} className="text-sm font-bold">{label}: {value}<input type="range" min="0" max="100" value={value} onChange={e=>setter(Number(e.target.value))} className="w-full accent-emerald-600 mt-2"/></label>)}</div>
      <div className="grid grid-cols-2 gap-3 mt-5"><div className="rounded-xl bg-lime-50 p-4"><div className="text-xs text-lime-800 font-bold">PREY</div><div className="text-3xl font-black text-lime-900">{prey}</div></div><div className="rounded-xl bg-orange-50 p-4"><div className="text-xs text-orange-800 font-bold">PREDATORS</div><div className="text-3xl font-black text-orange-900">{predator}</div></div></div>
      <div className="flex flex-wrap gap-3 mt-5"><button className="btn btn-primary" onClick={runSeason}>Run next season</button><button className="btn btn-secondary" onClick={resetEco}><RotateCcw size={16}/> Reset model</button><span className="self-center text-sm text-slate-500">Season {season}</span></div>
      {history.length>0&&<div className="mt-5 rounded-xl bg-slate-50 p-4"><b>Population history</b><div className="mt-3 space-y-2">{history.map((h,i)=><div key={i} className="grid grid-cols-[70px_1fr] gap-3 items-center text-sm"><span className="text-slate-500">Season {i+1}</span><div className="flex gap-3"><span className="text-lime-800 font-bold">Prey {h.prey}</span><span className="text-orange-800 font-bold">Predators {h.predator}</span></div></div>)}</div></div>}
    </div>}
  </section>;
}
