"use client";

import { useMemo, useState } from "react";
import { Leaf, Network, CloudSun, Trees, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";

type Habitat = "forest" | "pond" | "grassland";
const habitatData = {
  forest: { name: "Temperate forest", icon: "🌳", species: ["Oak tree", "Caterpillar", "Mouse", "Songbird", "Fox", "Fungi"], intro: "A layered habitat with trees, shrubs, leaf litter and many feeding relationships.", baseline: 82 },
  pond: { name: "Freshwater pond", icon: "🪷", species: ["Algae", "Zooplankton", "Minnow", "Frog", "Heron", "Bacteria"], intro: "A freshwater ecosystem where energy moves from algae through aquatic consumers.", baseline: 74 },
  grassland: { name: "Grassland", icon: "🌾", species: ["Grass", "Grasshopper", "Rabbit", "Snake", "Hawk", "Soil fungi"], intro: "An open habitat dominated by grasses, grazers and predators.", baseline: 68 },
};
const foodLinks = [
  { from: "Grass", to: "Grasshopper", label: "Grass → Grasshopper" },
  { from: "Grasshopper", to: "Frog", label: "Grasshopper → Frog" },
  { from: "Frog", to: "Snake", label: "Frog → Snake" },
  { from: "Snake", to: "Hawk", label: "Snake → Hawk" },
  { from: "Oak leaves", to: "Caterpillar", label: "Oak leaves → Caterpillar" },
  { from: "Caterpillar", to: "Songbird", label: "Caterpillar → Songbird" },
  { from: "Mouse", to: "Fox", label: "Mouse → Fox" },
];
const scenarios = [
  { title: "Native flowering plants increase", description: "More native flowers provide nectar and pollen and can support more pollinators.", effect: 12, tip: "Habitat resources increase; other factors still limit population sizes." },
  { title: "A pesticide affects many insects", description: "Insect populations fall, reducing food for some birds and other insect-eaters.", effect: -18, tip: "A change at one trophic level can affect other parts of a food web." },
  { title: "A wetland is drained", description: "Species that depend on shallow water and wetland vegetation lose habitat.", effect: -24, tip: "Habitat loss can reduce biodiversity and disrupt ecosystem functions." },
  { title: "A wildlife corridor is restored", description: "Connected habitat allows some populations to move between suitable areas.", effect: 9, tip: "Connectivity can support movement, recolonisation and gene flow." },
];

export function EcologyEcosystemsLab() {
  const [tab, setTab] = useState<"web"|"habitat"|"climate">("web");
  const [selected, setSelected] = useState<string[]>([]);
  const [habitat, setHabitat] = useState<Habitat>("forest");
  const [scenario, setScenario] = useState(0);
  const [applied, setApplied] = useState<number[]>([]);
  const [temperature, setTemperature] = useState(1);
  const [rainfall, setRainfall] = useState(0);
  const [treeCover, setTreeCover] = useState(70);
  const webScore = selected.filter(x => ["Grass → Grasshopper","Grasshopper → Frog","Frog → Snake","Snake → Hawk"].includes(x)).length;
  const biodiversity = useMemo(() => {
    const climateEffect = Math.round((temperature - 1) * 12 + rainfall * 0.16 + (treeCover - 70) * 0.22);
    const humanEffect = applied.reduce((sum, i) => sum + scenarios[i].effect, 0);
    return Math.max(5, Math.min(100, habitatData[habitat].baseline + climateEffect + humanEffect));
  }, [temperature, rainfall, treeCover, habitat, applied]);
  const current = scenarios[scenario];
  const toggleLink = (label: string) => setSelected(s => s.includes(label) ? s.filter(x=>x!==label) : [...s,label]);

  return <section className="mt-10 rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 md:p-8">
    <div className="flex flex-wrap items-center gap-2 text-green-800 text-sm font-bold"><span className="rounded-full bg-green-100 px-3 py-1">V19 · Interactive ecology lab</span><span className="text-slate-500 font-medium">Ecosystems · biodiversity · environmental change</span></div>
    <h2 className="mt-3 text-3xl font-black text-slate-900">Explore the connections that keep ecosystems alive</h2>
    <p className="mt-2 max-w-3xl leading-7 text-slate-600">Build a food web, investigate habitat biodiversity and experiment with simplified environmental change scenarios.</p>
    <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Ecology lab activities">
      <button role="tab" aria-selected={tab==="web"} onClick={()=>setTab("web")} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab==="web"?"bg-green-700 text-white":"bg-white border text-slate-700"}`}>Food web builder</button>
      <button role="tab" aria-selected={tab==="habitat"} onClick={()=>setTab("habitat")} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab==="habitat"?"bg-green-700 text-white":"bg-white border text-slate-700"}`}>Biodiversity explorer</button>
      <button role="tab" aria-selected={tab==="climate"} onClick={()=>setTab("climate")} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab==="climate"?"bg-green-700 text-white":"bg-white border text-slate-700"}`}>Environmental change</button>
    </div>

    {tab==="web" && <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center gap-2"><Network className="text-green-700"/><h3 className="text-xl font-black">Connect who eats whom</h3></div>
        <p className="mt-2 text-sm text-slate-600">Select links in this simplified grassland chain. The arrow points from the food to the organism that eats it.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">{foodLinks.slice(0,4).map(link=><button key={link.label} onClick={()=>toggleLink(link.label)} className={`rounded-xl border p-3 text-left text-sm font-bold ${selected.includes(link.label)?"border-green-500 bg-green-50 text-green-900":"border-slate-200 hover:border-green-400"}`}>{selected.includes(link.label)?"✓ ":"＋ "}{link.label}</button>)}</div>
        <div className="mt-4 rounded-xl bg-slate-50 p-4"><div className="flex justify-between text-sm"><strong>Correct links selected</strong><strong>{webScore}/4</strong></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-green-600" style={{width:`${webScore/4*100}%`}}/></div><p className="mt-3 text-sm text-slate-600">{webScore===4?"Great work — you have connected this simple food chain.":"Build the chain from grass to grasshopper, frog, snake and hawk."}</p></div>
        <button onClick={()=>setSelected([])} className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold"><RotateCcw size={15}/> Reset web</button>
      </div>
      <aside className="rounded-2xl bg-slate-900 p-5 text-white"><Leaf className="text-lime-300" size={30}/><h3 className="mt-3 text-xl font-black">Energy flows; matter cycles</h3><p className="mt-2 text-sm leading-6 text-slate-300">Producers capture energy, consumers obtain energy by eating other organisms, and decomposers break down dead material and waste.</p><div className="mt-4 rounded-xl bg-white/10 p-4 text-sm"><strong>Key idea</strong><p className="mt-1 text-slate-300">Food-web arrows show the direction of energy transfer — from the organism being eaten to the eater.</p></div><p className="mt-4 text-xs text-slate-400">Real food webs contain many more species and overlapping feeding relationships.</p></aside>
    </div>}

    {tab==="habitat" && <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl border bg-white p-5"><h3 className="text-xl font-black">Choose a habitat</h3><div className="mt-4 grid gap-2">{(Object.keys(habitatData) as Habitat[]).map(key=><button key={key} onClick={()=>setHabitat(key)} className={`flex items-center gap-3 rounded-xl border p-3 text-left ${habitat===key?"border-green-500 bg-green-50":"border-slate-200"}`}><span className="text-3xl">{habitatData[key].icon}</span><span><strong className="block">{habitatData[key].name}</strong><span className="text-xs text-slate-500">{habitatData[key].species.length} example species</span></span></button>)}</div><p className="mt-4 text-sm leading-6 text-slate-600">{habitatData[habitat].intro}</p></div>
      <div className="rounded-2xl border bg-white p-5"><div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black">Species snapshot</h3><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Illustrative index</span></div><div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">{habitatData[habitat].species.map((species,i)=><div key={species} className="rounded-xl bg-slate-50 p-4"><span className="text-2xl">{["🌱","🐛","🐭","🐦","🦊","🍄"][i]}</span><p className="mt-2 text-sm font-bold">{species}</p></div>)}</div><div className="mt-4 rounded-xl bg-green-50 p-4"><p className="text-sm font-bold text-green-900">Biodiversity is more than a species count</p><p className="mt-1 text-sm text-green-900/80">It includes variation within species, the number and variety of species, and the diversity of ecosystems.</p></div></div>
    </div>}

    {tab==="climate" && <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-2xl border bg-white p-5"><div className="flex items-center gap-2"><CloudSun className="text-green-700"/><h3 className="text-xl font-black">Change environmental conditions</h3></div><p className="mt-2 text-sm text-slate-600">Adjust the teaching-model variables and apply ecosystem events. The index is not a measured biodiversity forecast.</p>
        <div className="mt-5 space-y-5">
          <div><div className="flex justify-between text-sm font-semibold"><label htmlFor="eco-temp">Temperature shift</label><span>{temperature>0?"+":""}{temperature} model units</span></div><input id="eco-temp" type="range" min="-2" max="3" step="1" value={temperature} onChange={e=>setTemperature(Number(e.target.value))} className="w-full accent-green-700"/><div className="flex justify-between text-xs text-slate-400"><span>Cooler</span><span>Warmer</span></div></div>
          <div><div className="flex justify-between text-sm font-semibold"><label htmlFor="eco-rain">Rainfall change</label><span>{rainfall>0?"+":""}{rainfall}%</span></div><input id="eco-rain" type="range" min="-50" max="50" step="5" value={rainfall} onChange={e=>setRainfall(Number(e.target.value))} className="w-full accent-green-700"/></div>
          <div><div className="flex justify-between text-sm font-semibold"><label htmlFor="eco-tree">Habitat cover</label><span>{treeCover}%</span></div><input id="eco-tree" type="range" min="10" max="100" step="5" value={treeCover} onChange={e=>setTreeCover(Number(e.target.value))} className="w-full accent-green-700"/></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>{setTemperature(1);setRainfall(0);setTreeCover(70);setApplied([])}} className="rounded-xl border px-4 py-2 text-sm font-bold">Reset model</button><span className="self-center text-xs text-slate-500">All variables are illustrative.</span></div>
      </div>
      <aside className="rounded-2xl bg-slate-900 p-5 text-white"><Trees size={30} className="text-lime-300"/><h3 className="mt-3 text-xl font-black">Model biodiversity index</h3><div className="mt-4 text-5xl font-black tabular-nums">{biodiversity}<span className="text-lg text-slate-400">/100</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-lime-400 transition-all" style={{width:`${biodiversity}%`}}/></div><p className="mt-3 text-sm text-slate-300">This relative score responds to the selected settings; it is not a scientific prediction for a real habitat.</p><div className="mt-5 border-t border-white/15 pt-4"><h4 className="font-bold">Apply an ecosystem event</h4><select value={scenario} onChange={e=>setScenario(Number(e.target.value))} className="mt-2 w-full rounded-lg bg-white p-2 text-slate-900">{scenarios.map((s,i)=><option key={s.title} value={i}>{s.title}</option>)}</select><p className="mt-2 text-sm text-slate-300">{current.description}</p><button onClick={()=>setApplied(a=>a.includes(scenario)?a:[...a,scenario])} disabled={applied.includes(scenario)} className="mt-3 rounded-lg bg-lime-300 px-3 py-2 text-sm font-black text-slate-900 disabled:opacity-50">{applied.includes(scenario)?"Event applied":"Apply event"}</button><p className="mt-3 text-xs text-lime-100">{current.tip}</p><p className="mt-2 text-xs text-slate-400">Applied events: {applied.length}</p></div></aside>
    </div>}
    <p className="mt-6 border-t border-green-100 pt-4 text-xs leading-5 text-slate-500">Learning model only. Ecosystem responses depend on local species, interactions, geography and time. The sliders and index are illustrative and should not be used as environmental forecasts.</p>
  </section>;
}
