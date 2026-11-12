"use client";
import { useMemo, useState } from "react";
import { Award, CheckCircle2, RotateCcw, Trophy } from "lucide-react";

const questions = [
  {q:"Which particle has a negative electric charge?",o:["Proton","Neutron","Electron","Nucleus"],a:2,e:"Electrons carry a negative charge and are found around the nucleus."},
  {q:"What is the chemical symbol for oxygen?",o:["Ox","O","Og","On"],a:1,e:"O is the symbol for oxygen."},
  {q:"Which organelle is the main site of photosynthesis in plant cells?",o:["Mitochondrion","Chloroplast","Nucleus","Ribosome"],a:1,e:"Chloroplasts contain chlorophyll, which absorbs light energy."},
  {q:"What force pulls objects towards Earth?",o:["Friction","Magnetism","Gravity","Upthrust"],a:2,e:"Gravity attracts masses towards one another."},
  {q:"What is the SI unit of force?",o:["Joule","Watt","Pascal","Newton"],a:3,e:"Force is measured in newtons (N)."},
  {q:"What is the value of 7 × 8?",o:["54","56","64","48"],a:1,e:"Seven groups of eight make fifty-six."},
  {q:"Which state of matter has a fixed volume but no fixed shape?",o:["Solid","Liquid","Gas","Plasma"],a:1,e:"A liquid flows to fit its container but keeps a near-fixed volume."},
  {q:"Which gas do plants take in during photosynthesis?",o:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],a:2,e:"Plants use carbon dioxide and water to make sugars using light energy."},
  {q:"What is the closest star to Earth?",o:["Sirius","The Sun","Proxima Centauri","Polaris"],a:1,e:"The Sun is our nearest star."},
  {q:"A triangle has angles 50° and 60°. What is the third angle?",o:["60°","70°","80°","90°"],a:1,e:"Angles in a triangle add up to 180°, so 180 − 50 − 60 = 70°."}
];

export function ScienceChallenge() {
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<number[]>([]);
  const [selected,setSelected]=useState<number|null>(null);
  const [finished,setFinished]=useState(false);
  const score=useMemo(()=>answers.reduce((s,a,i)=>s+(a===questions[i].a?1:0),0),[answers]);
  const current=questions[index];
  function choose(option:number) {
    if(selected!==null)return;
    setSelected(option);
    const next=[...answers,option]; setAnswers(next);
    if(index===questions.length-1)setFinished(true);
  }
  function next() { setIndex(v=>v+1); setSelected(null); }
  function restart() { setIndex(0); setAnswers([]); setSelected(null); setFinished(false); }
  if(finished) return <section className="card p-7 text-center">
    <Trophy size={42} className="mx-auto text-amber-500"/>
    <h2 className="text-2xl font-black mt-3">Challenge complete!</h2>
    <div className="text-5xl font-black text-blue-700 mt-3">{score}/{questions.length}</div>
    <p className="text-slate-600 mt-2">{score>=9?"Outstanding science knowledge!":score>=7?"Great work — keep building your knowledge.":score>=5?"Good effort. Review the explanations and try again.":"Every attempt helps you learn. Have another go!"}</p>
    <div className="grid sm:grid-cols-2 gap-3 text-left mt-6">{questions.map((q,i)=><div className="rounded-xl bg-slate-50 p-3 text-sm" key={i}><div className="font-bold">{i+1}. {q.q}</div><div className={answers[i]===q.a?"text-emerald-700":"text-rose-700"}>Your answer: {q.o[answers[i]]}</div>{answers[i]!==q.a&&<div className="text-emerald-700">Correct: {q.o[q.a]}</div>}<p className="text-slate-500 mt-1">{q.e}</p></div>)}</div>
    <button onClick={restart} className="btn btn-primary mt-6"><RotateCcw size={16}/> Play again</button>
    <p className="text-xs text-slate-400 mt-3">This quick challenge runs in your browser; its score is not saved to your account.</p>
  </section>;
  return <section className="card p-6 md:p-8">
    <div className="flex justify-between items-center gap-3"><div><div className="text-xs uppercase tracking-wider font-bold text-blue-700">Mixed-subject challenge</div><h2 className="text-2xl font-black mt-1">Test your science skills</h2></div><div className="text-sm font-bold text-slate-500">Question {index+1} of {questions.length}</div></div>
    <div className="h-2 rounded-full bg-slate-100 mt-5 overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{width:`${(index/questions.length)*100}%`}}/></div>
    <h3 className="text-xl font-bold mt-7">{current.q}</h3>
    <div className="grid sm:grid-cols-2 gap-3 mt-5">{current.o.map((option,i)=><button key={option} onClick={()=>choose(i)} disabled={selected!==null} className={`text-left rounded-xl border p-4 font-semibold transition ${selected===null?"border-slate-200 hover:border-blue-400 hover:bg-blue-50":i===current.a?"border-emerald-300 bg-emerald-50 text-emerald-800":i===selected?"border-rose-300 bg-rose-50 text-rose-800":"border-slate-100 text-slate-400"}`}>{String.fromCharCode(65+i)}. {option}{selected!==null&&i===current.a&&<CheckCircle2 className="inline ml-2" size={17}/>}</button>)}</div>
    {selected!==null&&<div className="mt-5 rounded-xl bg-blue-50 p-4"><div className="font-bold">{selected===current.a?"Correct!":"Not quite — keep going!"}</div><p className="text-sm text-slate-600 mt-1">{current.e}</p><button onClick={next} className="btn btn-primary mt-3">{index===questions.length-1?"See results":"Next question"}</button></div>}
  </section>;
}

export function PrintCertificate({ courseTitle, learnerName }: {courseTitle:string;learnerName:string}) {
  return <button onClick={()=>window.print()} className="btn btn-secondary print:hidden"><Award size={16}/> Print certificate</button>;
}
