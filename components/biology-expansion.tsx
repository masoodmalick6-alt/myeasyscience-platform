"use client";

import { useMemo, useState } from "react";
import { HeartPulse, Wind, Sun, Droplets, Sprout, RotateCcw, Leaf, Activity } from "lucide-react";

const systems = [
  { id:"circulatory", name:"Circulatory", color:"rose", organs:[["Heart","Pumps blood through the lungs and the rest of the body.","Four chambers keep oxygen-rich and oxygen-poor blood moving through separate pathways."],["Blood vessels","Arteries, veins and capillaries form a transport network.","Arteries carry blood away from the heart; veins return it; capillaries allow exchange with tissues."],["Blood","Transports gases, nutrients, wastes and immune cells.","Red blood cells carry much of the oxygen; plasma transports many dissolved substances."]] },
  { id:"respiratory", name:"Respiratory", color:"sky", organs:[["Nose and airways","Filter, warm and move incoming air.","Mucus and tiny cilia help trap and remove particles."],["Lungs","Contain branching airways ending in millions of alveoli.","Oxygen diffuses into blood and carbon dioxide diffuses into the alveoli."],["Diaphragm","A dome-shaped muscle beneath the lungs.","When it contracts, the chest cavity volume increases and air is drawn in."]] },
  { id:"digestive", name:"Digestive", color:"amber", organs:[["Stomach","Mixes food and begins substantial protein digestion.","Acid helps create conditions for enzymes such as pepsin."],["Small intestine","Completes digestion and absorbs most nutrients.","Folds, villi and microvilli provide a large surface area for absorption."],["Liver","Processes absorbed nutrients and produces bile.","Bile helps emulsify fats; the liver also stores and transforms nutrients."]] },
  { id:"nervous", name:"Nervous", color:"violet", organs:[["Brain","Processes information and coordinates responses.","Different regions contribute to movement, senses, memory and many automatic functions."],["Spinal cord","Carries signals between the brain and much of the body.","Some rapid protective responses are coordinated by spinal reflex circuits."],["Nerves","Bundles of nerve fibres connecting the central nervous system with the body.","Sensory pathways carry information inward; motor pathways carry commands outward."]] }
];

export function BiologyExpansion() {
  const [system,setSystem]=useState("circulatory");
  const [organ,setOrgan]=useState("Heart");
  const [plantTab,setPlantTab]=useState("photosynthesis");
  const [light,setLight]=useState(65);
  const [carbon,setCarbon]=useState(55);
  const [temperature,setTemperature]=useState(24);
  const [humidity,setHumidity]=useState(50);
  const [wind,setWind]=useState(35);
  const [water,setWater]=useState(true);
  const [oxygen,setOxygen]=useState(true);
  const [seedTemp,setSeedTemp]=useState(22);
  const [germDays,setGermDays]=useState(0);

  const activeSystem=systems.find(s=>s.id===system)!;
  const activeOrgan=activeSystem.organs.find(o=>o[0]===organ) || activeSystem.organs[0];
  const photoRate=useMemo(()=>{
    const lightFactor=Math.min(light/65,1.25);
    const co2Factor=Math.min(carbon/55,1.25);
    const tempFactor=temperature<10?0.15:temperature<20?0.55:temperature<=30?1:Math.max(0.15,1-(temperature-30)*0.055);
    return Math.round(100*Math.min(lightFactor,co2Factor,tempFactor));
  },[light,carbon,temperature]);
  const transpiration=Math.round(Math.min(100,(light*.32)+(wind*.38)+((100-humidity)*.30)));
  const germinationReady=water&&oxygen&&seedTemp>=10&&seedTemp<=35;
  const stage=germDays===0?"Dry seed":!germinationReady?"Conditions need adjusting":germDays<2?"Seed absorbs water (imbibition)":germDays<4?"Root begins to emerge":germDays<6?"Shoot begins to grow":"Young seedling";

  function changeSystem(id:string){setSystem(id);setOrgan(systems.find(s=>s.id===id)!.organs[0][0]);}
  function resetPlant(){setLight(65);setCarbon(55);setTemperature(24);setHumidity(50);setWind(35);setWater(true);setOxygen(true);setSeedTemp(22);setGermDays(0);}

  return <section className="mt-12 space-y-6">
    <div><p className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Biology expansion · new</p><h2 className="text-3xl font-black mt-2">Human body and plant science studio</h2><p className="text-slate-600 mt-2">Explore organ systems and investigate the factors that affect plant processes.</p></div>
    <div className="card p-5 md:p-7">
      <div className="flex items-center gap-2 text-rose-700"><HeartPulse/><span className="text-sm font-bold uppercase tracking-wider">Interactive human body</span></div>
      <h3 className="text-2xl font-black mt-2">Explore organs by body system</h3>
      <p className="text-sm text-slate-600 mt-1">Choose a system, then select an organ to see its role and a key biology fact.</p>
      <div className="flex flex-wrap gap-2 mt-5">{systems.map(s=><button key={s.id} onClick={()=>changeSystem(s.id)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${system===s.id?"bg-rose-700 text-white border-rose-700":"border-slate-200 hover:bg-rose-50"}`}>{s.name}</button>)}</div>
      <div className="grid lg:grid-cols-[.75fr_1.25fr] gap-5 mt-5">
        <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold uppercase text-slate-500 mb-3">Organs and structures</div>{activeSystem.organs.map(o=><button key={o[0]} onClick={()=>setOrgan(o[0])} className={`block w-full text-left rounded-xl p-3 mb-2 border ${organ===o[0]?"bg-white border-rose-400 shadow-sm":"border-transparent hover:bg-white"}`}><div className="font-extrabold">{o[0]}</div><div className="text-xs text-slate-500 mt-1">{o[1]}</div></button>)}</div>
        <div className="rounded-2xl border p-5 flex flex-col justify-center"><div className="text-xs font-bold uppercase tracking-wider text-rose-700">Selected structure · {activeSystem.name} system</div><h4 className="text-3xl font-black mt-2">{activeOrgan[0]}</h4><p className="text-slate-700 leading-7 mt-4">{activeOrgan[1]}</p><div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-950"><b>Biology fact</b><p className="mt-1">{activeOrgan[2]}</p></div><div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><Activity size={15}/> Structure and function work together to support homeostasis.</div></div>
      </div>
    </div>
    <div className="card p-5 md:p-7">
      <div className="flex items-center gap-2 text-emerald-700"><Leaf/><span className="text-sm font-bold uppercase tracking-wider">Plant biology laboratory</span></div>
      <h3 className="text-2xl font-black mt-2">Investigate how plants work</h3>
      <div className="flex flex-wrap gap-2 mt-5">{[["photosynthesis","Photosynthesis"],["transpiration","Transpiration"],["germination","Seed germination"]].map(([id,label])=><button key={id} onClick={()=>setPlantTab(id)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${plantTab===id?"bg-emerald-700 text-white border-emerald-700":"border-slate-200 hover:bg-emerald-50"}`}>{label}</button>)}</div>
      {plantTab==="photosynthesis"&&<div className="grid lg:grid-cols-[1fr_.9fr] gap-6 mt-6">
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">Adjust light, carbon dioxide and temperature. The indicator is a simplified relative rate model, not measured experimental data.</p>
          {[["Light intensity",light,setLight,"%"],["Carbon dioxide availability",carbon,setCarbon,"%"]].map(([label,value,setter,unit]:any)=><label key={label} className="block text-sm font-bold">{label}: {value}{unit}<input className="w-full accent-emerald-600 mt-2" type="range" min="0" max="100" value={value} onChange={e=>setter(Number(e.target.value))}/></label>)}
          <label className="block text-sm font-bold">Temperature: {temperature}°C<input className="w-full accent-emerald-600 mt-2" type="range" min="0" max="45" value={temperature} onChange={e=>setTemperature(Number(e.target.value))}/></label>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-5 flex flex-col justify-center"><div className="text-xs uppercase tracking-wider font-bold text-emerald-800">Relative photosynthesis indicator</div><div className="text-5xl font-black text-emerald-900 mt-2">{photoRate}%</div><div className="h-4 rounded-full bg-white overflow-hidden mt-4"><div className="h-full bg-emerald-600 rounded-full transition-all" style={{width:`${photoRate}%`}}/></div><p className="text-sm text-emerald-950 mt-4">{photoRate<30?"One or more factors may be strongly limiting the rate in this simplified model.":photoRate<80?"The rate is moderate; increasing a limiting factor may raise it.":"Conditions are favourable in this simplified model, though other factors can still limit photosynthesis."}</p><p className="text-xs text-emerald-800 mt-3">Photosynthesis uses light energy to help convert carbon dioxide and water into sugars, releasing oxygen.</p></div>
      </div>}
      {plantTab==="transpiration"&&<div className="grid lg:grid-cols-[1fr_.9fr] gap-6 mt-6">
        <div className="space-y-4"><p className="text-sm text-slate-600">Explore how environmental conditions can affect water loss from leaves.</p>{[["Light intensity",light,setLight],["Air movement",wind,setWind],["Relative humidity",humidity,setHumidity]].map(([label,value,setter]:any)=><label key={label} className="block text-sm font-bold">{label}: {value}%<input type="range" min="0" max="100" value={value} onChange={e=>setter(Number(e.target.value))} className="w-full accent-sky-600 mt-2"/></label>)}</div>
        <div className="rounded-2xl bg-sky-50 p-5 flex flex-col justify-center"><div className="text-xs uppercase tracking-wider font-bold text-sky-800">Relative transpiration indicator</div><div className="text-5xl font-black text-sky-900 mt-2">{transpiration}%</div><div className="h-4 rounded-full bg-white overflow-hidden mt-4"><div className="h-full bg-sky-600 rounded-full" style={{width:`${transpiration}%`}}/></div><p className="text-sm text-sky-950 mt-4">Water vapour usually diffuses out through stomata. Wind can remove humid air near the leaf, while high humidity reduces the water-vapour gradient.</p></div>
      </div>}
      {plantTab==="germination"&&<div className="grid lg:grid-cols-[1fr_.9fr] gap-6 mt-6">
        <div className="space-y-4"><p className="text-sm text-slate-600">A seed needs suitable conditions to germinate. Adjust the conditions, then advance the model one day at a time.</p><label className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={water} onChange={e=>setWater(e.target.checked)}/><span className="font-bold text-sm">Water available</span></label><label className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={oxygen} onChange={e=>setOxygen(e.target.checked)}/><span className="font-bold text-sm">Oxygen available</span></label><label className="block text-sm font-bold">Temperature: {seedTemp}°C<input type="range" min="0" max="45" value={seedTemp} onChange={e=>setSeedTemp(Number(e.target.value))} className="w-full accent-emerald-600 mt-2"/></label><div className="flex gap-2"><button className="btn btn-primary" onClick={()=>setGermDays(d=>Math.min(6,d+1))} disabled={!germinationReady||germDays>=6}>Advance one day</button><button className="btn btn-secondary" onClick={()=>setGermDays(0)}><RotateCcw size={15}/> Restart</button></div></div>
        <div className="rounded-2xl bg-lime-50 p-5 flex flex-col justify-center"><div className="text-xs uppercase tracking-wider font-bold text-lime-800">Seed development model</div><div className="text-2xl font-black text-lime-950 mt-2">{stage}</div><div className="mt-5 flex items-end justify-center h-32"><div className="relative w-20 h-14 rounded-[50%] bg-amber-700 border-4 border-amber-900"><div className="absolute w-2 h-10 bg-lime-700 left-1/2 -top-8 -translate-x-1/2 rounded-full" style={{height:germDays>=4?52: germDays>=2?24:0}}/><div className="absolute w-10 h-2 bg-amber-100 left-1/2 -bottom-3 -translate-x-1/2 rounded-full" style={{width:germDays>=2?42:0}}/></div></div><p className="text-sm text-lime-950 mt-4">{!germinationReady?"Provide water, oxygen and a suitable temperature (represented here as 10–35°C) to begin.":germDays===0?"Conditions are suitable. Advance the model to see the stages.":`Day ${germDays}: ${stage.toLowerCase()}. Real germination timing varies by species and environment.`}</p><div className="h-2 rounded-full bg-white mt-4 overflow-hidden"><div className="h-full bg-lime-700" style={{width:`${germDays/6*100}%`}}/></div></div>
      </div>}
      <div className="mt-6 flex justify-end"><button className="text-sm font-bold text-slate-500 hover:text-slate-800" onClick={resetPlant}>Reset plant experiments</button></div>
    </div>
  </section>;
}
