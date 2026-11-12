"use client";

import { useMemo, useState } from "react";
import { Waves, Magnet, Thermometer, Orbit, GraduationCap, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

type Topic = "waves" | "magnetism" | "thermal" | "space" | "exam";
const quiz = [
 {q:"A wave has frequency 5 Hz and wavelength 2 m. What is its speed?",o:["2.5 m/s","7 m/s","10 m/s"],a:2,why:"Wave speed = frequency × wavelength = 5 × 2 = 10 m/s."},
 {q:"What happens to the north poles of two bar magnets when brought together?",o:["They attract","They repel","Nothing happens"],a:1,why:"Like magnetic poles repel; unlike poles attract."},
 {q:"Which process transfers thermal energy through empty space?",o:["Conduction","Convection","Radiation"],a:2,why:"Thermal radiation can travel through a vacuum using electromagnetic waves."},
 {q:"Which planet is known for its prominent ring system?",o:["Mars","Saturn","Mercury"],a:1,why:"Saturn has a spectacular system of rings made mostly of ice and rocky particles."},
 {q:"When light enters glass from air at an angle, it usually…",o:["Bends towards the normal","Stops moving","Turns into sound"],a:0,why:"Light slows down in glass and refracts towards the normal when entering from air."},
];
const planets = [
 {name:"Mercury",distance:"0.39 AU",gravity:3.7,year:"88 Earth days",fact:"Smallest planet; heavily cratered surface."},
 {name:"Venus",distance:"0.72 AU",gravity:8.87,year:"225 Earth days",fact:"Dense atmosphere creates an extreme greenhouse effect."},
 {name:"Earth",distance:"1.00 AU",gravity:9.81,year:"365 days",fact:"Known to support abundant liquid water at the surface."},
 {name:"Mars",distance:"1.52 AU",gravity:3.71,year:"687 Earth days",fact:"A cold desert world with volcanoes and ancient river features."},
 {name:"Jupiter",distance:"5.20 AU",gravity:24.79,year:"11.86 Earth years",fact:"Largest planet; a gas giant with many moons."},
 {name:"Saturn",distance:"9.58 AU",gravity:10.44,year:"29.4 Earth years",fact:"A gas giant with bright, extensive rings."},
 {name:"Uranus",distance:"19.2 AU",gravity:8.69,year:"84 Earth years",fact:"An ice giant that rotates with an extreme axial tilt."},
 {name:"Neptune",distance:"30.1 AU",gravity:11.15,year:"165 Earth years",fact:"A distant ice giant with very fast winds."},
];

export function PhysicsFrontiersLab(){
 const [topic,setTopic]=useState<Topic>("waves");
 const [frequency,setFrequency]=useState(4);
 const [wavelength,setWavelength]=useState(2);
 const [angle,setAngle]=useState(35);
 const [turns,setTurns]=useState(80);
 const [coilCurrent,setCoilCurrent]=useState(2);
 const [mass,setMass]=useState(2);
 const [specificHeat,setSpecificHeat]=useState(4200);
 const [deltaT,setDeltaT]=useState(15);
 const [planet,setPlanet]=useState("Earth");
 const [massOnPlanet,setMassOnPlanet]=useState(60);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const waveSpeed=frequency*wavelength;
 const reflection=angle;
 const magneticIndex=Math.round(turns/10*coilCurrent);
 const heat=mass*specificHeat*deltaT;
 const selectedPlanet=planets.find(p=>p.name===planet)!;
 const quizScore=quiz.filter((q,i)=>answers[i]===q.a).length;
 const quizComplete=Object.keys(answers).length===quiz.length;
 const tabs:[Topic,string][]=[["waves","Waves & light"],["magnetism","Magnetism"],["thermal","Heat & thermal energy"],["space","Space & planets"],["exam","Physics exam practice"]];
 return <section className="mt-10 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 md:p-8">
  <div className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-800">V22 · Physics frontiers</div>
  <h2 className="mt-3 text-3xl font-black text-slate-900">Explore waves, fields, heat and space</h2>
  <p className="mt-2 max-w-3xl leading-7 text-slate-600">Build on the foundations of motion and circuits with new interactive models, planet facts and exam-style questions.</p>
  <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Physics frontiers activities">
   {tabs.map(([id,label])=><button key={id} role="tab" aria-selected={topic===id} onClick={()=>setTopic(id)} className={`rounded-xl px-4 py-2 text-sm font-bold ${topic===id?"bg-indigo-700 text-white":"border bg-white text-slate-700 hover:border-indigo-300"}`}>{label}</button>)}
  </div>

  {topic==="waves"&&<div className="mt-6 grid gap-5 lg:grid-cols-2">
   <div className="rounded-2xl border bg-white p-5"><div className="flex items-center gap-2"><Waves className="text-indigo-700"/><h3 className="text-xl font-black">Wave speed explorer</h3></div><p className="mt-2 text-sm text-slate-600">Change frequency and wavelength to calculate wave speed.</p><label className="mt-5 block text-sm font-bold">Frequency: {frequency} Hz</label><input type="range" min="1" max="20" value={frequency} onChange={e=>setFrequency(+e.target.value)} className="w-full"/><label className="mt-4 block text-sm font-bold">Wavelength: {wavelength.toFixed(1)} m</label><input type="range" min=".2" max="5" step=".1" value={wavelength} onChange={e=>setWavelength(+e.target.value)} className="w-full"/><div className="mt-4 rounded-xl bg-indigo-50 p-4"><p className="text-xs font-bold uppercase text-indigo-700">Equation</p><p className="mt-1 text-lg font-black text-indigo-950">v = f × λ</p><p className="text-sm text-indigo-900">Wave speed = frequency × wavelength</p></div></div>
   <div className="rounded-2xl border bg-white p-5"><h3 className="text-xl font-black">Your wave</h3><div className="mt-5 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-slate-950"><svg viewBox="0 0 360 120" className="h-full w-full" role="img" aria-label="Schematic wave pattern"><path d={Array.from({length:181},(_,i)=>`${i===0?"M":"L"} ${i*2} ${60-30*Math.sin(i/180*frequency*2*Math.PI)}`).join(" ")} fill="none" stroke="#67e8f9" strokeWidth="3"/></svg></div><p className="mt-5 text-4xl font-black tabular-nums text-indigo-800">{waveSpeed.toFixed(1)} <span className="text-lg">m/s</span></p><p className="mt-2 text-sm text-slate-600">Increasing frequency or wavelength increases wave speed in this model. In a real medium, wave speed is set by the medium, so changing frequency changes wavelength accordingly.</p>
    <div className="mt-5 border-t pt-4"><h4 className="font-bold">Reflection of light</h4><p className="mt-1 text-sm text-slate-600">For a plane mirror, angle of incidence equals angle of reflection (measured from the normal).</p><label className="mt-3 block text-sm font-semibold">Angle of incidence: {angle}°</label><input type="range" min="0" max="80" value={angle} onChange={e=>setAngle(+e.target.value)} className="w-full"/><p className="mt-1 font-bold text-indigo-800">Angle of reflection: {reflection}°</p></div>
   </div>
  </div>}

  {topic==="magnetism"&&<div className="mt-6 grid gap-5 md:grid-cols-2">
   <div className="rounded-2xl border bg-white p-5"><div className="flex items-center gap-2"><Magnet className="text-indigo-700"/><h3 className="text-xl font-black">Electromagnet explorer</h3></div><p className="mt-2 text-sm text-slate-600">An electromagnet's strength depends on factors including coil turns, current and its core material.</p><label className="mt-5 block text-sm font-bold">Coil turns: {turns}</label><input type="range" min="10" max="200" step="10" value={turns} onChange={e=>setTurns(+e.target.value)} className="w-full"/><label className="mt-4 block text-sm font-bold">Current: {coilCurrent.toFixed(1)} A</label><input type="range" min=".5" max="5" step=".5" value={coilCurrent} onChange={e=>setCoilCurrent(+e.target.value)} className="w-full"/><div className="mt-5 flex items-center justify-center rounded-xl bg-slate-950 p-6"><div className="flex items-center gap-1"><span className="rounded-l-lg bg-rose-600 px-3 py-4 font-black text-white">N</span><div className="flex h-12 items-center gap-1 rounded-md bg-slate-500 px-2">{Array.from({length:Math.min(12,Math.round(turns/15))}).map((_,i)=><span key={i} className="h-10 w-1.5 rounded-full bg-amber-300"/>)}</div><span className="rounded-r-lg bg-blue-600 px-3 py-4 font-black text-white">S</span></div></div></div>
   <div className="rounded-2xl border bg-white p-5"><h3 className="text-xl font-black">Relative field-strength indicator</h3><p className="mt-2 text-sm text-slate-600">This index is proportional to turns × current for comparison, not a measurement in tesla.</p><p className="mt-5 text-5xl font-black text-indigo-800">{magneticIndex}<span className="text-base text-slate-500"> relative units</span></p><div className="mt-3 h-4 rounded-full bg-slate-100"><div className="h-4 rounded-full bg-indigo-600 transition-all" style={{width:`${Math.min(100,magneticIndex/100*100)}%`}}/></div><div className="mt-5 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-950"><strong>Remember:</strong> Current through a coil produces a magnetic field. Increasing turns or current generally strengthens the field; an iron core can strengthen it further.</div></div>
  </div>}

  {topic==="thermal"&&<div className="mt-6 grid gap-5 md:grid-cols-2">
   <div className="rounded-2xl border bg-white p-5"><div className="flex items-center gap-2"><Thermometer className="text-orange-600"/><h3 className="text-xl font-black">Heating calculator</h3></div><p className="mt-2 text-sm text-slate-600">Estimate energy transferred to change the temperature of a substance without a change of state.</p><label className="mt-5 block text-sm font-bold">Mass: {mass.toFixed(1)} kg</label><input type="range" min=".1" max="10" step=".1" value={mass} onChange={e=>setMass(+e.target.value)} className="w-full"/><label className="mt-4 block text-sm font-bold">Specific heat capacity: {specificHeat} J/kg°C</label><input type="range" min="400" max="4500" step="100" value={specificHeat} onChange={e=>setSpecificHeat(+e.target.value)} className="w-full"/><label className="mt-4 block text-sm font-bold">Temperature change: {deltaT}°C</label><input type="range" min="1" max="80" value={deltaT} onChange={e=>setDeltaT(+e.target.value)} className="w-full"/></div>
   <div className="rounded-2xl border bg-white p-5"><h3 className="text-xl font-black">Thermal energy result</h3><p className="mt-5 text-4xl font-black text-orange-700">{Math.round(heat).toLocaleString()} <span className="text-lg">J</span></p><p className="mt-2 text-sm text-slate-600">Q = m × c × ΔT</p><div className="mt-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-950">The calculation assumes no change of state and a constant specific heat capacity over the temperature interval. Heat transfers by conduction, convection and radiation.</div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold"><div className="rounded-lg bg-slate-50 p-3">Conduction</div><div className="rounded-lg bg-slate-50 p-3">Convection</div><div className="rounded-lg bg-slate-50 p-3">Radiation</div></div></div>
  </div>}

  {topic==="space"&&<div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
   <div className="rounded-2xl border bg-white p-5"><div className="flex items-center gap-2"><Orbit className="text-indigo-700"/><h3 className="text-xl font-black">Solar system explorer</h3></div><p className="mt-2 text-sm text-slate-600">Choose a planet to compare its orbit and surface gravity.</p><div className="mt-4 grid grid-cols-2 gap-2">{planets.map(p=><button key={p.name} onClick={()=>setPlanet(p.name)} className={`rounded-lg border p-2 text-sm font-bold ${planet===p.name?"border-indigo-500 bg-indigo-50 text-indigo-900":"border-slate-200"}`}>{p.name}</button>)}</div></div>
   <div className="rounded-2xl border bg-white p-5"><div className="flex items-center justify-between"><h3 className="text-xl font-black">{selectedPlanet.name}</h3><span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">{selectedPlanet.distance} from Sun</span></div><p className="mt-3 text-slate-600">{selectedPlanet.fact}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Surface gravity</p><p className="mt-1 text-2xl font-black">{selectedPlanet.gravity} m/s²</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Orbital period</p><p className="mt-1 text-lg font-black">{selectedPlanet.year}</p></div></div><label className="mt-5 block text-sm font-bold">Your mass: {massOnPlanet} kg</label><input type="range" min="10" max="150" value={massOnPlanet} onChange={e=>setMassOnPlanet(+e.target.value)} className="w-full"/><div className="mt-3 rounded-xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">Your weight on {selectedPlanet.name}</p><p className="mt-1 text-3xl font-black text-indigo-950">{(massOnPlanet*selectedPlanet.gravity).toFixed(1)} N</p><p className="mt-1 text-xs text-indigo-900">Mass stays the same; weight changes with gravitational field strength.</p></div></div>
  </div>}

  {topic==="exam"&&<div className="mt-6 rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><GraduationCap className="text-indigo-700"/><h3 className="text-xl font-black">Physics exam practice</h3></div><p className="mt-1 text-sm text-slate-500">Five questions across waves, magnetism, thermal physics, light and space.</p></div><span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-800">Score: {quizScore}/{quiz.length}</span></div>
   <div className="mt-5 space-y-4">{quiz.map((item,i)=><div key={item.q} className="rounded-xl border p-4"><p className="font-bold">{i+1}. {item.q}</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{item.o.map((option,j)=><button key={option} onClick={()=>{setAnswers(a=>({...a,[i]:j}));setSubmitted(false)}} className={`rounded-lg border p-2 text-left text-sm ${answers[i]===j?"border-indigo-500 bg-indigo-50":""}`}>{option}</button>)}</div>{submitted&&<p className={`mt-3 flex gap-2 text-sm ${answers[i]===item.a?"text-emerald-700":"text-slate-600"}`}>{answers[i]===item.a?<CheckCircle2 size={16}/>:<XCircle size={16}/>}<span>{item.why}</span></p>}</div>)}</div>
   <div className="mt-5 flex flex-wrap gap-2"><button disabled={!quizComplete} onClick={()=>setSubmitted(true)} className="rounded-lg bg-indigo-700 px-4 py-2 font-bold text-white disabled:opacity-40">Mark my answers</button><button onClick={()=>{setAnswers({});setSubmitted(false)}} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-bold"><RotateCcw size={14}/> Reset quiz</button></div>
   {submitted&&<p className="mt-4 rounded-xl bg-indigo-50 p-4 font-black text-indigo-900">You scored {quizScore} out of {quiz.length}.</p>}
  </div>}
  <p className="mt-6 border-t border-indigo-100 pt-4 text-xs leading-5 text-slate-500">Educational models only. Simplified calculations and diagrams do not replace experiments, measured data or a full physics course.</p>
 </section>;
}
