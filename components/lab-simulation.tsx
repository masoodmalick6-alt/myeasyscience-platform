 "use client";

import { useMemo, useState } from "react";
import { RotateCcw, Info, Beaker, Timer, Ruler, Leaf, Plus, Minus } from "lucide-react";

type Subject = "chemistry" | "physics" | "biology" | "mathematics";

const samples = [
  { name: "Lemon juice", ph: 2, note: "Acidic: citrus juices contain citric acid." },
  { name: "Vinegar", ph: 3, note: "Acidic: vinegar contains acetic acid." },
  { name: "Water", ph: 7, note: "Neutral: pure water is around pH 7 at room temperature." },
  { name: "Baking soda solution", ph: 8.3, note: "Mildly basic: dissolved sodium bicarbonate makes the solution alkaline." },
  { name: "Soapy water", ph: 10, note: "Basic: many soaps are mildly to moderately alkaline." }
];
const organelles = [
  { name: "Cell wall", x: 50, y: 8, desc: "A strong outer layer that supports and protects the plant cell." },
  { name: "Cell membrane", x: 83, y: 48, desc: "A selective barrier that controls what enters and leaves the cell." },
  { name: "Nucleus", x: 45, y: 48, desc: "Contains genetic material and helps direct the cell's activities." },
  { name: "Chloroplast", x: 24, y: 30, desc: "Contains chlorophyll and captures light energy for photosynthesis." },
  { name: "Vacuole", x: 55, y: 76, desc: "A large fluid-filled space that stores materials and helps maintain turgor." },
  { name: "Cytoplasm", x: 17, y: 66, desc: "A jelly-like material where many of the cell's chemical reactions occur." }
];

export function LabSimulation({ subject }: { subject: Subject }) {
  if (subject === "chemistry") return <ChemistryLab/>;
  if (subject === "physics") return <PhysicsLab/>;
  if (subject === "biology") return <BiologyLab/>;
  return <MathLab/>;
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="card p-5 md:p-7">{children}</section>;
}
function ChemistryLab() {
  const [sample, setSample] = useState(2);
  const current = samples[sample];
  const colour = current.ph < 6 ? "#ef7891" : current.ph > 8 ? "#5796df" : "#a78bdb";
  const reset = () => setSample(2);
  return <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-5">
    <Panel>
      <div className="flex items-center gap-2 font-extrabold text-lg"><Beaker className="text-blue-700"/> Choose a sample</div>
      <p className="text-sm text-slate-500 mt-2">Select a sample to add a virtual indicator.</p>
      <div className="grid gap-2 mt-5">{samples.map((s, i) => <button key={s.name} onClick={() => setSample(i)} className={`text-left rounded-xl border p-3 flex justify-between items-center ${sample === i ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}><span className="font-bold text-sm">{s.name}</span><span className="text-xs font-bold text-slate-500">pH {s.ph}</span></button>)}</div>
      <button onClick={reset} className="btn btn-secondary text-sm mt-5"><RotateCcw size={15}/> Reset experiment</button>
    </Panel>
    <Panel>
      <div className="font-extrabold text-lg">Indicator observation</div>
      <div className="rounded-2xl bg-slate-50 min-h-56 mt-4 flex items-center justify-center flex-col">
        <div className="w-28 h-36 rounded-b-[2rem] border-[5px] border-slate-300 shadow-inner relative overflow-hidden bg-white">
          <div className="absolute bottom-0 left-0 right-0 h-[72%] transition-colors duration-500" style={{ backgroundColor: colour, opacity: .85 }}/>
          <div className="absolute top-0 left-0 right-0 h-5 bg-white/70"/>
        </div>
        <span className="text-xs font-bold text-slate-500 mt-3">Simulated indicator colour</span>
      </div>
      <div className="mt-5"><div className="flex justify-between text-xs font-bold text-slate-500"><span>Acidic</span><span>Neutral</span><span>Basic</span></div><div className="h-3 rounded-full mt-2" style={{background:"linear-gradient(90deg,#e65c78,#d7a3a5,#9d8ed1,#4c8ed7)"}}/><div className="relative h-5"><div className="absolute -top-1 w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow" style={{left:`${(current.ph/14)*100}%`, transform:"translateX(-50%)"}}/></div></div>
      <div className="rounded-xl bg-blue-50 p-4 mt-3"><div className="font-extrabold text-blue-900">{current.name} · pH {current.ph}</div><p className="text-sm text-blue-900/80 mt-1 leading-6">{current.note}</p></div>
    </Panel>
  </div>;
}
function PhysicsLab() {
  const [length, setLength] = useState(1);
  const [angle, setAngle] = useState(20);
  const period = 2 * Math.PI * Math.sqrt(length / 9.81);
  const [showFormula, setShowFormula] = useState(false);
  return <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-5">
    <Panel>
      <div className="flex items-center gap-2 font-extrabold text-lg"><Ruler className="text-violet-700"/> Experiment controls</div>
      <label className="block text-sm font-bold mt-6">Pendulum length: {length.toFixed(1)} m</label>
      <input aria-label="Pendulum length" type="range" min="0.2" max="2.5" step="0.1" value={length} onChange={e=>setLength(Number(e.target.value))} className="w-full mt-3 accent-violet-700"/>
      <div className="flex justify-between text-xs text-slate-500"><span>0.2 m</span><span>2.5 m</span></div>
      <label className="block text-sm font-bold mt-7">Starting angle: {angle}°</label>
      <input aria-label="Starting angle" type="range" min="5" max="40" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))} className="w-full mt-3 accent-violet-700"/>
      <div className="flex justify-between text-xs text-slate-500"><span>5°</span><span>40°</span></div>
      <button onClick={()=>{setLength(1);setAngle(20);}} className="btn btn-secondary text-sm mt-6"><RotateCcw size={15}/> Reset</button>
    </Panel>
    <Panel>
      <div className="font-extrabold text-lg">Pendulum model</div>
      <div className="bg-slate-50 rounded-2xl mt-4 h-64 relative overflow-hidden flex justify-center">
        <div className="absolute top-7 w-28 h-2 rounded bg-slate-400"/>
        <div className="absolute top-9 w-1 h-5 bg-slate-500"/>
        <div className="absolute top-10 w-1 bg-violet-400 origin-top transition-transform" style={{height:`${Math.min(170, length*100)}px`, transform:`rotate(${angle}deg)`}}>
          <div className="absolute -bottom-4 -left-4 w-9 h-9 rounded-full bg-violet-600 border-4 border-violet-200 shadow-lg"/>
        </div>
        <div className="absolute bottom-4 text-xs text-slate-500">Illustrative position · not animated to scale</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl bg-violet-50 p-4"><div className="text-xs font-bold text-violet-700">Estimated period</div><div className="text-2xl font-black text-violet-950 mt-1">{period.toFixed(2)} s</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-500">Swing frequency</div><div className="text-2xl font-black mt-1">{(1/period).toFixed(2)} Hz</div></div>
      </div>
      <button onClick={()=>setShowFormula(v=>!v)} className="text-sm text-violet-700 font-bold mt-4">{showFormula ? "Hide" : "Show"} the physics</button>
      {showFormula && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">For small angles, T ≈ 2π√(L/g), where L is length and g ≈ 9.81 m/s². A longer pendulum has a longer period.</p>}
    </Panel>
  </div>;
}
function BiologyLab() {
  const [selected, setSelected] = useState("Nucleus");
  const item = organelles.find(o=>o.name===selected) || organelles[0];
  return <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-5">
    <Panel>
      <div className="flex items-center gap-2 font-extrabold text-lg"><Leaf className="text-emerald-700"/> Interactive plant cell</div>
      <p className="text-sm text-slate-500 mt-2">Select a labelled structure to inspect it.</p>
      <div className="relative mx-auto my-6 w-full max-w-[470px] aspect-[1.15] rounded-[45%] border-[12px] border-emerald-700 bg-emerald-100 shadow-inner">
        <div className="absolute inset-3 rounded-[45%] border-4 border-emerald-500 bg-emerald-50/80"/>
        <div className="absolute left-[38%] top-[34%] w-[25%] h-[27%] rounded-full bg-indigo-300 border-4 border-indigo-500 flex items-center justify-center text-[10px] font-bold text-indigo-950">Nucleus</div>
        <div className="absolute left-[12%] top-[23%] w-[17%] h-[10%] rounded-full bg-green-500 border-2 border-green-700 rotate-[-25deg]"/>
        <div className="absolute right-[14%] top-[25%] w-[17%] h-[10%] rounded-full bg-green-500 border-2 border-green-700 rotate-[25deg]"/>
        <div className="absolute left-[27%] bottom-[13%] w-[47%] h-[25%] rounded-[45%] bg-sky-200/90 border-2 border-sky-500"/>
        <div className="absolute left-[8%] bottom-[25%] w-5 h-5 rounded-full bg-green-500"/>
        <div className="absolute right-[9%] bottom-[28%] w-5 h-5 rounded-full bg-green-500"/>
        {organelles.map(o=><button key={o.name} title={o.name} onClick={()=>setSelected(o.name)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 w-7 h-7 text-xs font-black shadow ${selected===o.name ? "bg-slate-900 text-white border-white scale-110" : "bg-white text-slate-700 border-slate-300 hover:scale-110"}`} style={{left:`${o.x}%`,top:`${o.y}%`}}>{o.name==="Nucleus"?"N":o.name==="Vacuole"?"V":o.name==="Chloroplast"?"C":o.name==="Cell wall"?"W":o.name==="Cell membrane"?"M":"+"}</button>)}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">{organelles.map(o=><button key={o.name} onClick={()=>setSelected(o.name)} className={`rounded-full px-3 py-2 text-xs font-bold ${selected===o.name?"bg-emerald-700 text-white":"bg-emerald-50 text-emerald-800"}`}>{o.name}</button>)}</div>
    </Panel>
    <Panel>
      <div className="text-sm uppercase tracking-wider text-emerald-700 font-bold">Microscope notes</div>
      <h2 className="text-2xl font-black mt-2">{item.name}</h2>
      <p className="text-slate-600 leading-7 mt-3">{item.desc}</p>
      <div className="rounded-xl bg-emerald-50 p-4 mt-6"><div className="font-bold text-emerald-900">Observation prompt</div><p className="text-sm text-emerald-900/80 mt-1">How might this structure help a plant cell survive? Try selecting another structure and compare their jobs.</p></div>
      <div className="text-xs text-slate-500 mt-5">Diagram is simplified and not to scale. Plant cells contain additional structures not shown here.</div>
    </Panel>
  </div>;
}
function MathLab() {
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(4);
  const area = width * height, perimeter = 2 * (width + height);
  const scale = 20;
  return <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-5">
    <Panel>
      <div className="font-extrabold text-lg">Adjust your rectangle</div>
      <label className="block text-sm font-bold mt-6">Width: {width} units</label>
      <input aria-label="Rectangle width" type="range" min="1" max="10" step="1" value={width} onChange={e=>setWidth(Number(e.target.value))} className="w-full mt-3 accent-amber-600"/>
      <label className="block text-sm font-bold mt-6">Height: {height} units</label>
      <input aria-label="Rectangle height" type="range" min="1" max="8" step="1" value={height} onChange={e=>setHeight(Number(e.target.value))} className="w-full mt-3 accent-amber-600"/>
      <button onClick={()=>{setWidth(6);setHeight(4);}} className="btn btn-secondary text-sm mt-6"><RotateCcw size={15}/> Reset shape</button>
      <div className="rounded-xl bg-amber-50 p-4 mt-6"><div className="font-bold text-amber-950">Think about it</div><p className="text-sm text-amber-950/80 mt-1">Can two rectangles have the same area but different perimeters? Try changing the width and height to investigate.</p></div>
    </Panel>
    <Panel>
      <div className="font-extrabold text-lg">Your shape</div>
      <div className="h-64 rounded-2xl bg-slate-50 mt-4 flex items-center justify-center overflow-hidden">
        <div className="border-[3px] border-amber-700 bg-amber-300/70 flex items-center justify-center text-amber-950 font-black transition-all" style={{width:`${width*scale}px`,height:`${height*scale}px`,maxWidth:"90%",maxHeight:"85%"}}>{width} × {height}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl bg-amber-50 p-4"><div className="text-xs font-bold text-amber-800">Area</div><div className="text-2xl font-black mt-1">{area} units²</div><div className="text-xs text-slate-500 mt-1">width × height</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-500">Perimeter</div><div className="text-2xl font-black mt-1">{perimeter} units</div><div className="text-xs text-slate-500 mt-1">2 × (width + height)</div></div>
      </div>
    </Panel>
  </div>;
}
