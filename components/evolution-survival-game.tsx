"use client";

import { useMemo, useState } from "react";
import { Dna, Sprout, Target, RotateCcw, Trophy, ArrowRight } from "lucide-react";

type Environment = "snow" | "forest" | "sand";
type Trait = "white" | "brown" | "gold";
const environments: Record<Environment, {name:string; emoji:string; advantage:Trait; description:string}> = {
  snow: {name:"Snowy tundra", emoji:"❄️", advantage:"white", description:"Pale fur makes an animal harder to see against snow."},
  forest: {name:"Dark forest", emoji:"🌲", advantage:"brown", description:"Dark brown fur blends into shaded bark and soil."},
  sand: {name:"Pale desert", emoji:"🏜️", advantage:"gold", description:"Golden fur is less visible against dry sand."},
};
const traitInfo: Record<Trait,{name:string;emoji:string;className:string}> = {
  white:{name:"White fur",emoji:"🐇",className:"bg-slate-200"},
  brown:{name:"Brown fur",emoji:"🐿️",className:"bg-amber-700"},
  gold:{name:"Golden fur",emoji:"🦊",className:"bg-yellow-400"},
};
const start = {white:34,brown:33,gold:33};

export function EvolutionSurvivalGame() {
  const [environment,setEnvironment] = useState<Environment>("snow");
  const [population,setPopulation] = useState<Record<Trait,number>>(start);
  const [generation,setGeneration] = useState(0);
  const [history,setHistory] = useState<Record<Trait,number>[]>([start]);
  const [challenge,setChallenge] = useState(false);
  const [answer,setAnswer] = useState("");
  const [feedback,setFeedback] = useState("");
  const total = useMemo(()=>Object.values(population).reduce((a,b)=>a+b,0),[population]);
  const dominant = (Object.keys(population) as Trait[]).sort((a,b)=>population[b]-population[a])[0];
  const advantage = environments[environment].advantage;

  function advance() {
    // Simplified selection: better-camouflaged individuals leave more offspring.
    const weights: Record<Trait,number> = {white: environment==="snow"?1.7:0.75,brown:environment==="forest"?1.7:0.75,gold:environment==="sand"?1.7:0.75};
    const weighted = (Object.keys(population) as Trait[]).map(t=>population[t]*weights[t]);
    const sum = weighted.reduce((a,b)=>a+b,0);
    const next: Record<Trait,number> = {
      white: Math.round(weighted[0]/sum*100),
      brown: Math.round(weighted[1]/sum*100),
      gold: Math.round(weighted[2]/sum*100),
    };
    // Small illustrative variation represents new heritable variation.
    const mutationShift = 1;
    next[advantage] = Math.min(98,next[advantage]+mutationShift);
    const other = (Object.keys(next) as Trait[]).filter(t=>t!==advantage).sort((a,b)=>next[b]-next[a])[0];
    next[other] = Math.max(1,next[other]-mutationShift);
    const diff = 100 - Object.values(next).reduce((a,b)=>a+b,0);
    next[advantage] += diff;
    setPopulation(next);
    setGeneration(g=>g+1);
    setHistory(h=>[...h,next]);
  }
  function reset() {
    setPopulation(start);setGeneration(0);setHistory([start]);setFeedback("");setAnswer("");
  }
  const correct = answer === advantage;
  return <section className="mt-10 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-5 md:p-8">
    <div className="flex flex-wrap items-center gap-2 text-violet-800 text-sm font-bold"><span className="rounded-full bg-violet-100 px-3 py-1">V20 · Evolution game</span><span className="text-slate-500 font-medium">Inherited traits · natural selection · adaptation</span></div>
    <h2 className="mt-3 text-3xl font-black text-slate-900">Survive the changing habitat</h2>
    <p className="mt-2 max-w-3xl leading-7 text-slate-600">Guide a fictional population of small mammals through changing environments. Choose a habitat, predict which inherited fur colour may help, and advance generations to see how trait frequencies can shift.</p>

    <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2"><Sprout className="text-violet-700"/><h3 className="text-xl font-black">Choose the environment</h3></div>
        <div className="mt-4 grid gap-2">
          {(Object.keys(environments) as Environment[]).map(key=><button key={key} onClick={()=>{setEnvironment(key);reset()}} className={`flex items-center gap-3 rounded-xl border p-3 text-left ${environment===key?"border-violet-500 bg-violet-50 ring-2 ring-violet-100":"border-slate-200 hover:border-violet-300"}`}><span className="text-3xl">{environments[key].emoji}</span><span><strong className="block">{environments[key].name}</strong><span className="text-xs text-slate-500">{environments[key].description}</span></span></button>)}
        </div>
        <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white"><Target className="text-fuchsia-300"/><h4 className="mt-2 font-black">Your prediction</h4><p className="mt-1 text-sm text-slate-300">Which inherited fur colour is likely to be less visible to predators here?</p>
          <select value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback("")}} className="mt-3 w-full rounded-lg bg-white p-2 text-slate-900"><option value="">Choose a trait…</option>{(Object.keys(traitInfo) as Trait[]).map(t=><option key={t} value={t}>{traitInfo[t].name}</option>)}</select>
          <button onClick={()=>setFeedback(answer?(correct?"Correct prediction! Better camouflage can increase survival and reproduction in this model.":"Not quite. Look at the habitat background and compare the fur colours."):"Choose a trait first.")} className="mt-3 rounded-lg bg-fuchsia-300 px-3 py-2 text-sm font-black text-slate-900">Check prediction</button>
          {feedback && <p className="mt-3 text-sm text-fuchsia-100">{feedback}</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Population tracker</h3><p className="text-sm text-slate-500">Generation {generation} · total represented as 100 individuals</p></div><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">Leading trait: {traitInfo[dominant].name}</span></div>
        <div className="mt-5 space-y-4">
          {(Object.keys(population) as Trait[]).map(t=><div key={t}><div className="flex items-center justify-between gap-3 text-sm"><span className="font-bold">{traitInfo[t].emoji} {traitInfo[t].name}</span><strong>{population[t]}%</strong></div><div className="mt-2 h-5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all duration-500 ${t==="white"?"bg-slate-300":t==="brown"?"bg-amber-700":"bg-yellow-400"}`} style={{width:`${population[t]}%`}}/></div></div>)}
        </div>
        <div className="mt-5 rounded-xl bg-violet-50 p-4"><p className="text-sm font-bold text-violet-900">Selection pressure in this habitat</p><p className="mt-1 text-sm text-violet-900/80">{environments[environment].description} In this simplified simulation, that trait has a survival and reproduction advantage.</p></div>
        <div className="mt-5 flex flex-wrap gap-2"><button onClick={advance} disabled={generation>=12} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 font-bold text-white disabled:opacity-40">Advance generation <ArrowRight size={16}/></button><button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700"><RotateCcw size={15}/> Reset population</button></div>
        {generation>=12 && <p className="mt-3 text-sm font-semibold text-violet-800">You reached the 12-generation limit. Change the environment or reset to try again.</p>}
        <div className="mt-5 border-t border-slate-100 pt-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Trophy size={16} className="text-amber-500"/> Population history</div><div className="mt-3 flex h-20 items-end gap-1">{history.map((h,i)=><div key={i} className="flex flex-1 flex-col justify-end gap-0.5" title={`Generation ${i}`}><div className="rounded-t-sm bg-slate-300" style={{height:`${h.white*0.55}px`}}/><div className="bg-amber-700" style={{height:`${h.brown*0.55}px`}}/><div className="rounded-b-sm bg-yellow-400" style={{height:`${h.gold*0.55}px`}}/></div>)}</div><p className="mt-2 text-xs text-slate-500">Each column shows the proportions of white, brown and golden fur across generations.</p></div>
      </div>
    </div>

    <div className="mt-5 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl bg-white/80 p-4"><strong className="text-slate-900">Variation</strong><p className="mt-1 text-sm text-slate-600">Individuals in a population can inherit different versions of traits.</p></div>
      <div className="rounded-xl bg-white/80 p-4"><strong className="text-slate-900">Selection</strong><p className="mt-1 text-sm text-slate-600">Some inherited traits can affect survival and reproductive success in a particular environment.</p></div>
      <div className="rounded-xl bg-white/80 p-4"><strong className="text-slate-900">Adaptation</strong><p className="mt-1 text-sm text-slate-600">Across generations, helpful inherited traits can become more common in a population.</p></div>
    </div>
    <p className="mt-5 border-t border-violet-100 pt-4 text-xs leading-5 text-slate-500">Educational toy model only. Natural selection acts on existing heritable variation; individuals do not evolve because they need to. Real populations are affected by many factors, including migration, genetic drift, mating patterns and changing environments. This simulation is not a scientific prediction.</p>
  </section>;
}
