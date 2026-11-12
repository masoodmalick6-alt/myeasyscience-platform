"use client";
import { useEffect, useMemo, useState } from "react";
import { Atom, BookOpen, Clock3, Dna, FlaskConical, Gauge, RotateCcw, Trophy, Zap } from "lucide-react";

type Question = { prompt:string; options:string[]; answer:number; explanation:string };
type Game = { id:string; title:string; subtitle:string; icon:any; questions:Question[] };

const games:Game[] = [
  { id:"elements", title:"Element Detective", subtitle:"Guess elements from their symbols and clues", icon:Atom, questions:[
    {prompt:"Which element has the symbol Fe?",options:["Fluorine","Iron","Francium","Fermium"],answer:1,explanation:"Fe comes from the Latin name ferrum, meaning iron."},
    {prompt:"Which element has atomic number 6?",options:["Carbon","Oxygen","Nitrogen","Boron"],answer:0,explanation:"Carbon has 6 protons, so its atomic number is 6."},
    {prompt:"What is the symbol for sodium?",options:["S","So","Na","Sd"],answer:2,explanation:"Sodium's symbol is Na, from the Latin natrium."},
    {prompt:"Which of these is a noble gas?",options:["Chlorine","Neon","Sodium","Calcium"],answer:1,explanation:"Neon is in Group 18, the noble gases."},
    {prompt:"Which element is a liquid metal near room temperature?",options:["Mercury","Aluminium","Copper","Iron"],answer:0,explanation:"Mercury is a metal that is liquid at typical room temperature."}
  ]},
  { id:"equations", title:"Equation Sprint", subtitle:"Choose the balanced chemical equation", icon:FlaskConical, questions:[
    {prompt:"Balance: H₂ + O₂ → H₂O",options:["H₂ + O₂ → H₂O","2H₂ + O₂ → 2H₂O","2H₂ + 2O₂ → H₂O","H₂ + 2O₂ → 2H₂O"],answer:1,explanation:"Two hydrogen molecules react with one oxygen molecule to make two water molecules."},
    {prompt:"Balance: N₂ + H₂ → NH₃",options:["N₂ + 3H₂ → 2NH₃","N₂ + H₂ → NH₃","2N₂ + 3H₂ → NH₃","N₂ + 2H₂ → 2NH₃"],answer:0,explanation:"There are 2 nitrogen atoms and 6 hydrogen atoms on each side."},
    {prompt:"Balance: Na + Cl₂ → NaCl",options:["Na + Cl₂ → NaCl","2Na + Cl₂ → 2NaCl","Na + 2Cl₂ → NaCl","2Na + 2Cl₂ → NaCl"],answer:1,explanation:"Two sodium atoms pair with the two chlorine atoms in Cl₂."},
    {prompt:"Balance: Mg + O₂ → MgO",options:["Mg + O₂ → MgO","2Mg + O₂ → 2MgO","Mg + 2O₂ → MgO","2Mg + 2O₂ → MgO"],answer:1,explanation:"Two magnesium atoms combine with one oxygen molecule to form two MgO units."},
    {prompt:"Balance: CH₄ + O₂ → CO₂ + H₂O",options:["CH₄ + O₂ → CO₂ + H₂O","CH₄ + 2O₂ → CO₂ + 2H₂O","2CH₄ + O₂ → CO₂ + H₂O","CH₄ + 3O₂ → CO₂ + H₂O"],answer:1,explanation:"The balanced combustion equation has 4 H atoms in 2H₂O and 4 O atoms in total."}
  ]},
  { id:"biology", title:"Cell Structure Match", subtitle:"Match each cell part to its main job", icon:Dna, questions:[
    {prompt:"Which structure controls many activities of a eukaryotic cell?",options:["Cell wall","Nucleus","Vacuole","Chloroplast"],answer:1,explanation:"The nucleus contains DNA and helps control cell activities."},
    {prompt:"Where does photosynthesis happen in plant cells?",options:["Mitochondrion","Ribosome","Chloroplast","Cell membrane"],answer:2,explanation:"Chloroplasts contain chlorophyll and are the main site of photosynthesis."},
    {prompt:"Which structure releases usable energy through respiration?",options:["Mitochondrion","Cell wall","Nucleus","Vacuole"],answer:0,explanation:"Mitochondria are a major site of aerobic respiration."},
    {prompt:"Which structure controls what enters and leaves the cell?",options:["Cytoplasm","Cell membrane","Nucleus","Chloroplast"],answer:1,explanation:"The cell membrane is selectively permeable."},
    {prompt:"Which structure provides extra support to plant cells?",options:["Cell wall","Ribosome","Mitochondrion","Nucleolus"],answer:0,explanation:"The cellulose cell wall strengthens and supports plant cells."}
  ]},
  { id:"physics", title:"Physics Puzzle Lab", subtitle:"Solve quick motion, force and energy problems", icon:Gauge, questions:[
    {prompt:"A runner travels 100 m in 20 s. What is the average speed?",options:["2 m/s","5 m/s","20 m/s","2000 m/s"],answer:1,explanation:"Speed = distance ÷ time = 100 ÷ 20 = 5 m/s."},
    {prompt:"What force acts on a 2 kg object accelerating at 3 m/s²?",options:["1.5 N","5 N","6 N","9 N"],answer:2,explanation:"F = ma = 2 × 3 = 6 N."},
    {prompt:"A 10 N force moves an object 4 m in its direction. How much work is done?",options:["2.5 J","14 J","40 J","400 J"],answer:2,explanation:"Work = force × distance = 10 × 4 = 40 J."},
    {prompt:"Which energy store increases when a book is lifted?",options:["Chemical","Gravitational potential","Nuclear","Elastic"],answer:1,explanation:"Lifting the book increases its gravitational potential energy."},
    {prompt:"What is the unit of electrical current?",options:["Volt","Ohm","Ampere","Watt"],answer:2,explanation:"Electric current is measured in amperes (A)."}
  ]}
];

const speedQuestions:Question[] = [
  ...games.flatMap(g=>g.questions),
  {prompt:"What is the pH of a neutral solution at 25°C?",options:["0","7","10","14"],answer:1,explanation:"At 25°C, a neutral aqueous solution has pH 7."},
  {prompt:"Which planet is known as the Red Planet?",options:["Venus","Mars","Jupiter","Mercury"],answer:1,explanation:"Iron-rich dust gives Mars its reddish appearance."},
  {prompt:"What is the approximate value of π to 2 decimal places?",options:["3.12","3.14","3.16","3.41"],answer:1,explanation:"π is approximately 3.14159."},
  {prompt:"Which blood cells carry oxygen?",options:["White blood cells","Platelets","Red blood cells","Nerve cells"],answer:2,explanation:"Red blood cells contain haemoglobin, which carries oxygen."}
];

export function ScienceArcade() {
  const [gameId,setGameId]=useState("elements");
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<number[]>([]);
  const [selected,setSelected]=useState<number|null>(null);
  const [finished,setFinished]=useState(false);
  const [speedMode,setSpeedMode]=useState(false);
  const [seconds,setSeconds]=useState(60);
  const [speedIndex,setSpeedIndex]=useState(0);
  const [speedScore,setSpeedScore]=useState(0);
  const game=games.find(g=>g.id===gameId)!;
  const score=useMemo(()=>answers.reduce((sum,a,i)=>sum+(a===game.questions[i].answer?1:0),0),[answers,game]);
  const q=speedMode?speedQuestions[speedIndex%speedQuestions.length]:game.questions[index];

  useEffect(()=>{
    if(!speedMode||finished)return;
    const timer=window.setInterval(()=>setSeconds(s=>{
      if(s<=1){window.clearInterval(timer);setFinished(true);return 0;}
      return s-1;
    }),1000);
    return ()=>window.clearInterval(timer);
  },[speedMode,finished]);

  function startGame(id:string) {setGameId(id);setSpeedMode(false);setIndex(0);setAnswers([]);setSelected(null);setFinished(false);}
  function startSpeed() {setSpeedMode(true);setGameId("elements");setSeconds(60);setSpeedIndex(0);setSpeedScore(0);setIndex(0);setAnswers([]);setSelected(null);setFinished(false);}
  function choose(n:number) {
    if(selected!==null||finished)return;
    setSelected(n);
    if(speedMode) {
      if(n===q.answer)setSpeedScore(s=>s+1);
      // Move to the next speed question after a short feedback window.
      window.setTimeout(()=>{setSpeedIndex(i=>i+1);setSelected(null);},650);
    } else {
      const next=[...answers,n];setAnswers(next);
      if(index===game.questions.length-1)setFinished(true);
    }
  }
  function next() {setIndex(i=>i+1);setSelected(null);}
  function restart() {speedMode?startSpeed():startGame(gameId);}
  const Icon=game.icon;

  return <div className="space-y-6">
    <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {games.map(g=>{const I=g.icon;return <button key={g.id} onClick={()=>startGame(g.id)} className={`text-left rounded-2xl border p-4 transition ${!speedMode&&gameId===g.id?"border-blue-500 bg-blue-50 ring-2 ring-blue-100":"border-slate-200 bg-white hover:border-blue-300"}`}><I className="text-blue-700" size={23}/><div className="font-black mt-3">{g.title}</div><p className="text-xs text-slate-500 mt-1">{g.subtitle}</p></button>;})}
      <button onClick={startSpeed} className={`text-left rounded-2xl border p-4 transition ${speedMode?"border-amber-500 bg-amber-50 ring-2 ring-amber-100":"border-slate-200 bg-white hover:border-amber-300"}`}><Zap className="text-amber-600" size={23}/><div className="font-black mt-3">60-Second Mix</div><p className="text-xs text-slate-500 mt-1">Race against the clock across all subjects</p></button>
    </section>

    <section className="card p-6 md:p-8">
      {!speedMode&&<div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider"><Icon size={16}/>{game.title}</div>}
      {speedMode?<div className="flex justify-between items-center gap-3"><div><div className="text-xs uppercase tracking-wider font-bold text-amber-700">Timed competition</div><h2 className="text-2xl font-black mt-1">60-Second Mix</h2></div><div className={`rounded-xl px-4 py-2 font-black text-xl tabular-nums ${seconds<=10?"bg-rose-100 text-rose-700":"bg-amber-50 text-amber-800"}`}><Clock3 className="inline mr-2" size={18}/>{seconds}s</div></div>:<div className="flex justify-between items-center gap-3"><div><div className="text-xs uppercase tracking-wider font-bold text-slate-500">Practice round</div><h2 className="text-2xl font-black mt-1">{game.title}</h2></div><div className="text-sm font-bold text-slate-500">Question {index+1} / {game.questions.length}</div></div>}
      {!finished&&<><div className="h-2 rounded-full bg-slate-100 mt-5 overflow-hidden"><div className={`h-full transition-all ${speedMode?"bg-amber-500":"bg-blue-600"}`} style={{width:speedMode?`${(seconds/60)*100}%`:`${(index/game.questions.length)*100}%`}}/></div>
        <h3 className="text-xl md:text-2xl font-bold mt-7">{q.prompt}</h3>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">{q.options.map((o,i)=><button key={o} onClick={()=>choose(i)} disabled={selected!==null} className={`text-left rounded-xl border p-4 font-semibold transition ${selected===null?"border-slate-200 hover:border-blue-400 hover:bg-blue-50":i===q.answer?"border-emerald-300 bg-emerald-50 text-emerald-800":i===selected?"border-rose-300 bg-rose-50 text-rose-800":"border-slate-100 text-slate-400"}`}>{String.fromCharCode(65+i)}. {o}</button>)}</div>
        {selected!==null&&!speedMode&&<div className="mt-5 rounded-xl bg-blue-50 p-4"><div className="font-bold">{selected===q.answer?"Correct!":"Good try — learn from this one."}</div><p className="text-sm text-slate-600 mt-1">{q.explanation}</p><button onClick={next} className="btn btn-primary mt-3">{index===game.questions.length-1?"See results":"Next question"}</button></div>}
        {speedMode&&<div className="flex justify-between text-sm text-slate-500 mt-5"><span>Correct answers: <b className="text-emerald-700">{speedScore}</b></span><span>Keep moving — next question loads automatically</span></div>}
      </>}
      {finished&&<div className="text-center py-6"><Trophy className="mx-auto text-amber-500" size={46}/><h3 className="text-2xl font-black mt-3">{speedMode?"Time is up!":"Round complete!"}</h3><div className="text-5xl font-black text-blue-700 mt-3">{speedMode?speedScore:score}<span className="text-lg text-slate-400"> / {speedMode?"—":game.questions.length}</span></div><p className="text-slate-600 mt-2">{speedMode?"Correct answers in one minute.":score===game.questions.length?"Perfect score! Excellent work.":score>=3?"Great effort — keep practising!":"Good start. Try again and improve your score."}</p><button onClick={restart} className="btn btn-primary mt-5"><RotateCcw size={16}/> Play again</button></div>}
    </section>
    <p className="text-xs text-slate-400">These games run in your browser. Scores are not saved to your MyEasyScience account or included in official progress reports.</p>
  </div>;
}
