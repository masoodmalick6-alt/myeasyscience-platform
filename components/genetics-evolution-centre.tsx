"use client";

import { useMemo, useState } from "react";
import { Dna, Sprout, Shuffle, RotateCcw, Bug, Trees, ArrowRight, Info } from "lucide-react";

const alleleOptions = ["AA","Aa","aa"];
const alleleProb: Record<string,number> = { AA:1, Aa:0.5, aa:0 };
const traitNames = ["Freckles (simplified model)","Flower pigment (simplified model)"];
const speciesData = [
  { id:"light", name:"Light-coloured beetles", color:"#d6b46a", initial:50, fitness:0.35 },
  { id:"dark", name:"Dark-coloured beetles", color:"#475569", initial:50, fitness:0.85 }
];

export function GeneticsEvolutionCentre(){
  const [parentA,setParentA]=useState("Aa");
  const [parentB,setParentB]=useState("Aa");
  const [trait,setTrait]=useState(0);
  const [generation,setGeneration]=useState(0);
  const [mutation,setMutation]=useState(false);
  const [mutSeq,setMutSeq]=useState("ATGCCGTA");
  const [habitat,setHabitat]=useState("dark");
  const [lightCount,setLightCount]=useState(50);
  const [darkCount,setDarkCount]=useState(50);
  const [round,setRound]=useState(0);
  const [history,setHistory]=useState<{round:number,light:number,dark:number}[]>([]);
  const [selected,setSelected]=useState("natural");

  const punnett = useMemo(()=>{
    const a=parentA.split(""),b=parentB.split("");
    return [a[0]+b[0],a[0]+b[1],a[1]+b[0],a[1]+b[1]].map(g=>g[0]===g[1]?g:g.split("").sort().join(""));
  },[parentA,parentB]);
  const dominant=punnett.filter(g=>g.includes("A")).length;
  const recessive=4-dominant;
  const mutated=useMemo(()=>{
    const bases=mutSeq.split("");
    if(mutation && bases.length>2) bases[2]=bases[2]==="A"?"T":"A";
    return bases.join("");
  },[mutSeq,mutation]);
  const selectedSpecies=speciesData.find(s=>s.id===habitat)!;
  const darkAdv=habitat==="dark";

  function resetSelection(){setGeneration(0);setMutation(false);setMutSeq("ATGCCGTA");}
  function runSelection(){
    const lightFitness=darkAdv?0.25:0.82;
    const darkFitness=darkAdv?0.82:0.25;
    const total=lightCount*lightFitness+darkCount*darkFitness;
    const nextLight=total===0?0:Math.round(100*(lightCount*lightFitness)/total);
    const nextDark=100-nextLight;
    setLightCount(nextLight);setDarkCount(nextDark);setRound(r=>r+1);
    setHistory(h=>[...h.slice(-5),{round:round+1,light:nextLight,dark:nextDark}]);
  }
  function resetSelectionSim(){setLightCount(50);setDarkCount(50);setRound(0);setHistory([]);setHabitat("dark");}
  function mutate(){setMutation(true);setGeneration(g=>g+1);}

  return <section className="mt-12 space-y-6">
    <div><p className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Biology expansion · genetics and evolution</p><h2 className="text-3xl font-black mt-2">Genetics & Evolution Centre</h2><p className="text-slate-600 mt-2">Investigate inheritance, explore mutations and model how natural selection can change a population over generations.</p></div>
    <div className="grid sm:grid-cols-3 gap-3">
      {[["inheritance","Inheritance lab",Dna],["mutation","Mutation explorer",Shuffle],["selection","Natural selection lab",Trees]].map(([id,label,Icon]:any)=><button key={id} onClick={()=>setSelected(id)} className={`rounded-2xl border p-4 text-left ${selected===id?"bg-violet-50 border-violet-500 ring-2 ring-violet-100":"bg-white border-slate-200 hover:border-violet-300"}`}><Icon size={22} className="text-violet-700"/><div className="font-extrabold mt-2">{label}</div><div className="text-xs text-slate-500 mt-1">Interactive simulation</div></button>)}
    </div>

    {selected==="inheritance"&&<div className="card p-5 md:p-7">
      <div className="flex items-center gap-2 text-violet-700"><Dna/><span className="text-sm font-bold uppercase tracking-wider">Mendelian inheritance</span></div>
      <h3 className="text-2xl font-black mt-2">Build a Punnett square</h3>
      <p className="text-sm text-slate-600 mt-1">Choose the genotype of each parent. A is treated as dominant and a as recessive in this simplified single-gene model.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-5">{[["Parent 1",parentA,setParentA],["Parent 2",parentB,setParentB]].map(([label,value,setter]:any)=><label className="text-sm font-bold" key={label}>{label}<select className="field w-full mt-2" value={value} onChange={e=>setter(e.target.value)}>{alleleOptions.map(g=><option key={g}>{g}</option>)}</select></label>)}</div>
      <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-6 mt-6">
        <div><div className="font-bold mb-2">Offspring allele combinations</div><div className="grid grid-cols-3 gap-2 max-w-xs text-center"><div/><div className="rounded-lg bg-slate-100 p-3 font-black">{parentA[0]}</div><div className="rounded-lg bg-slate-100 p-3 font-black">{parentA[1]}</div><div className="rounded-lg bg-slate-100 p-3 font-black">{parentB[0]}</div><div className="rounded-lg bg-violet-100 p-3 font-black">{punnett[0]}</div><div className="rounded-lg bg-violet-100 p-3 font-black">{punnett[2]}</div><div className="rounded-lg bg-slate-100 p-3 font-black">{parentB[1]}</div><div className="rounded-lg bg-violet-100 p-3 font-black">{punnett[1]}</div><div className="rounded-lg bg-violet-100 p-3 font-black">{punnett[3]}</div></div></div>
        <div className="rounded-2xl bg-violet-50 p-5"><div className="text-xs font-bold uppercase tracking-wider text-violet-800">Expected outcomes</div><div className="grid grid-cols-2 gap-3 mt-3"><div className="bg-white rounded-xl p-4"><div className="text-sm text-slate-500">Dominant phenotype</div><div className="text-3xl font-black text-violet-900">{dominant*25}%</div></div><div className="bg-white rounded-xl p-4"><div className="text-sm text-slate-500">Recessive phenotype</div><div className="text-3xl font-black text-violet-900">{recessive*25}%</div></div></div><p className="text-sm text-violet-950 mt-3">These are expected probabilities across many offspring, not guaranteed results for a small family.</p></div>
      </div>
      <label className="block text-sm font-bold mt-5">Example trait<select className="field mt-2 w-full max-w-sm" value={trait} onChange={e=>setTrait(Number(e.target.value))}>{traitNames.map((t,i)=><option value={i} key={t}>{t}</option>)}</select></label>
      <p className="text-xs text-slate-500 mt-2">{traitNames[trait]} is only a teaching label; real human traits such as freckles are not reliably explained by one dominant/recessive gene.</p>
    </div>}

    {selected==="mutation"&&<div className="card p-5 md:p-7">
      <div className="flex items-center gap-2 text-violet-700"><Shuffle/><span className="text-sm font-bold uppercase tracking-wider">DNA variation</span></div>
      <h3 className="text-2xl font-black mt-2">Explore a point mutation</h3>
      <p className="text-sm text-slate-600 mt-1">Change one base in this short illustrative DNA sequence. A mutation is a change in genetic material; its effect depends on where it occurs and how it changes gene function.</p>
      <label className="block text-sm font-bold mt-5">Starting DNA sequence<input className="field w-full mt-2 font-mono tracking-widest" value={mutSeq} maxLength={20} onChange={e=>{setMutSeq(e.target.value.toUpperCase().replace(/[^ATCG]/g,""));setMutation(false)}}/></label>
      <div className="grid md:grid-cols-2 gap-4 mt-5"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500 font-bold">ORIGINAL</div><div className="font-mono text-xl tracking-widest mt-2 break-all">{mutSeq||"—"}</div></div><div className="rounded-xl bg-violet-50 p-4"><div className="text-xs text-violet-700 font-bold">MUTATED MODEL</div><div className="font-mono text-xl tracking-widest mt-2 break-all">{mutation?mutated:"Select mutate to compare"}</div></div></div>
      <div className="flex flex-wrap gap-3 mt-5"><button className="btn btn-primary" onClick={mutate} disabled={mutation||mutSeq.length<3}>Introduce one substitution</button><button className="btn btn-secondary" onClick={resetSelection}><RotateCcw size={15}/> Reset</button></div>
      {mutation&&<div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950"><b>What changed?</b><p className="mt-1">One DNA base was substituted in this demonstration. A substitution may have no effect, alter a protein, or affect gene regulation. This sequence is not a real gene and no health outcome can be inferred from it.</p></div>}
    </div>}

    {selected==="selection"&&<div className="card p-5 md:p-7">
      <div className="flex items-center gap-2 text-violet-700"><Trees/><span className="text-sm font-bold uppercase tracking-wider">Evolution by natural selection</span></div>
      <h3 className="text-2xl font-black mt-2">Beetle camouflage simulation</h3>
      <p className="text-sm text-slate-600 mt-1">Model how a habitat can change survival and reproduction probabilities for different colour variants. The fitness values are teaching assumptions, not real measured data.</p>
      <label className="block text-sm font-bold mt-5">Habitat background<select className="field mt-2 w-full max-w-sm" value={habitat} onChange={e=>setHabitat(e.target.value)}><option value="dark">Dark bark</option><option value="light">Pale sand</option></select></label>
      <div className="grid md:grid-cols-2 gap-3 mt-5"><div className="rounded-xl p-4 border" style={{background:habitat==="light"?"#fff7e6":"#e2e8f0"}}><div className="text-xs font-bold">LIGHT BEETLES</div><div className="text-3xl font-black mt-1">{lightCount}%</div><div className="h-3 bg-white/70 rounded-full mt-3 overflow-hidden"><div className="h-full rounded-full" style={{width:`${lightCount}%`,background:"#d6b46a"}}/></div></div><div className="rounded-xl p-4 border" style={{background:habitat==="dark"?"#e2e8f0":"#fff7e6"}}><div className="text-xs font-bold">DARK BEETLES</div><div className="text-3xl font-black mt-1">{darkCount}%</div><div className="h-3 bg-white/70 rounded-full mt-3 overflow-hidden"><div className="h-full rounded-full" style={{width:`${darkCount}%`,background:"#475569"}}/></div></div></div>
      <div className="flex flex-wrap gap-3 mt-5"><button className="btn btn-primary" onClick={runSelection}>Run next generation <ArrowRight size={16}/></button><button className="btn btn-secondary" onClick={resetSelectionSim}><RotateCcw size={15}/> Reset population</button><span className="self-center text-sm text-slate-500">Generation {round}</span></div>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700"><b>Interpretation:</b> On dark bark, the model gives dark beetles a higher survival weight; on pale sand, light beetles have the advantage. Over generations, the population proportions may shift. Natural selection acts on heritable variation already present or arising through mutation.</div>
      {history.length>0&&<div className="mt-5"><b className="text-sm">Generation history</b><div className="mt-2 space-y-2">{history.map(h=><div key={h.round} className="flex justify-between text-sm border-b pb-2"><span>Generation {h.round}</span><span>Light {h.light}% · Dark {h.dark}%</span></div>)}</div></div>}
    </div>}
    <div className="rounded-xl bg-slate-50 border p-4 text-sm text-slate-600 flex gap-2"><Info size={17} className="shrink-0 mt-0.5"/>These are simplified teaching models. In real populations, inheritance, mutation, gene interactions, genetic drift, migration and environmental conditions can all influence evolution.</div>
  </section>;
}
