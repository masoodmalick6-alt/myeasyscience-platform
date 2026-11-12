"use client";

import { useMemo, useState } from "react";
import { HeartPulse, Brain, Dna, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const organQuestions = [
  {q:"Which organ pumps blood around the body?", options:["Lungs","Heart","Kidneys","Stomach"],a:1,why:"The heart is a muscular pump that moves blood through the circulatory system."},
  {q:"Where does most gas exchange take place in the lungs?",options:["Trachea","Bronchi","Alveoli","Diaphragm"],a:2,why:"Tiny air sacs called alveoli provide a large surface for oxygen and carbon dioxide exchange."},
  {q:"Which organ absorbs most digested nutrients?",options:["Small intestine","Large intestine","Liver","Oesophagus"],a:0,why:"The small intestine has villi and microvilli that provide a large absorptive surface."},
  {q:"Which part of the brain helps coordinate balance and movement?",options:["Cerebellum","Medulla","Hypothalamus","Cerebrum"],a:0,why:"The cerebellum helps coordinate movement, posture and balance."},
  {q:"Which organs filter blood and produce urine?",options:["Liver","Kidneys","Pancreas","Lungs"],a:1,why:"The kidneys filter blood, regulate water and ion balance, and produce urine."}
];
const alleles = ["A","a"];
export function HumanBiologyChallengeCentre(){
 const [tab,setTab]=useState<"organs"|"genetics"|"exam">("organs");
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [parent1,setParent1]=useState("Aa"),[parent2,setParent2]=useState("Aa");
 const [exam,setExam]=useState(0),[selected,setSelected]=useState<number|null>(null),[checked,setChecked]=useState(false);
 const score=organQuestions.filter((q,i)=>answers[i]===q.a).length;
 const cross=useMemo(()=>[parent1[0]+parent2[0],parent1[0]+parent2[1],parent1[1]+parent2[0],parent1[1]+parent2[1]].map(g=>g[0]==="a"&&g[1]==="A"?"Aa":g),[parent1,parent2]);
 const recessive=cross.filter(g=>g==="aa").length;
 const examQs=[
  {q:"A student increases exercise intensity. Which response helps deliver more oxygen to working muscles?",o:["Heart rate increases","Breathing stops","Blood flow to muscles ends"],a:0,why:"Heart rate and ventilation generally increase to help meet the muscles' greater oxygen demand."},
  {q:"A parent has genotype Aa and the other aa. What fraction of offspring are expected to be aa in this simple model?",o:["0%","50%","100%"],a:1,why:"The cross Aa × aa gives two Aa and two aa outcomes in the four equally likely combinations."},
  {q:"Which statement about antibodies is correct?",o:["They are made by some B-cell descendants","They digest food in the stomach","They carry oxygen in red blood cells"],a:0,why:"Activated B cells can differentiate into plasma cells that secrete antibodies."}
 ];
 const q=examQs[exam];
 return <section className="mt-10 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5 md:p-8">
  <div className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-800">V21 · Human biology challenge centre</div>
  <h2 className="mt-3 text-3xl font-black text-slate-900">Test your human biology & genetics knowledge</h2>
  <p className="mt-2 max-w-3xl leading-7 text-slate-600">Practise organ-system knowledge, investigate inherited alleles and take a short exam-style challenge.</p>
  <div className="mt-6 flex flex-wrap gap-2">
   {([["organs","Organ systems"],["genetics","Inheritance puzzle"],["exam","Exam practice"]] as const).map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab===id?"bg-rose-700 text-white":"border bg-white text-slate-700"}`}>{label}</button>)}
  </div>
  {tab==="organs"&&<div className="mt-6 grid gap-4 md:grid-cols-2">
   {organQuestions.map((item,i)=><div key={item.q} className="rounded-2xl border bg-white p-4"><p className="font-bold text-slate-900">{i+1}. {item.q}</p><div className="mt-3 grid grid-cols-2 gap-2">{item.options.map((option,j)=><button key={option} onClick={()=>setAnswers(a=>({...a,[i]:j}))} className={`rounded-lg border p-2 text-sm text-left ${answers[i]===j?(j===item.a?"border-emerald-400 bg-emerald-50":"border-rose-300 bg-rose-50"):"border-slate-200 hover:border-rose-300"}`}>{option}</button>)}</div>{answers[i]!==undefined&&<p className="mt-3 flex gap-2 text-xs text-slate-600">{answers[i]===item.a?<CheckCircle2 size={15} className="text-emerald-600"/>:<XCircle size={15} className="text-rose-600"/>}{item.why}</p>}</div>)}
   <div className="rounded-2xl bg-slate-900 p-5 text-white"><HeartPulse className="text-rose-300"/><h3 className="mt-2 text-xl font-black">Your score: {score}/{organQuestions.length}</h3><p className="mt-1 text-sm text-slate-300">Answer each question to check your understanding of the human body.</p><button onClick={()=>setAnswers({})} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold"><RotateCcw size={14}/> Reset quiz</button></div>
  </div>}
  {tab==="genetics"&&<div className="mt-6 grid gap-5 md:grid-cols-2">
   <div className="rounded-2xl border bg-white p-5"><Dna className="text-rose-700"/><h3 className="mt-2 text-xl font-black">Build a genetic cross</h3><p className="mt-2 text-sm text-slate-600">Choose two parent genotypes for a simplified single-gene model. A is dominant and a is recessive.</p><label className="mt-4 block text-sm font-bold">Parent 1</label><select value={parent1} onChange={e=>setParent1(e.target.value)} className="mt-1 w-full rounded-lg border p-2">{["AA","Aa","aa"].map(x=><option key={x}>{x}</option>)}</select><label className="mt-3 block text-sm font-bold">Parent 2</label><select value={parent2} onChange={e=>setParent2(e.target.value)} className="mt-1 w-full rounded-lg border p-2">{["AA","Aa","aa"].map(x=><option key={x}>{x}</option>)}</select></div>
   <div className="rounded-2xl border bg-white p-5"><h3 className="text-xl font-black">Punnett outcomes</h3><div className="mt-4 grid grid-cols-2 gap-2">{cross.map((g,i)=><div key={i} className="rounded-xl bg-rose-50 p-4 text-center"><span className="text-2xl font-black text-rose-800">{g}</span><p className="text-xs text-slate-500">Outcome {i+1}</p></div>)}</div><p className="mt-4 text-sm text-slate-700">Expected recessive genotype (aa): <strong>{recessive*25}%</strong></p><p className="mt-2 text-xs leading-5 text-slate-500">This is a teaching model for one gene with complete dominance. Many human traits are polygenic or influenced by environment; this model does not predict real personal traits.</p></div>
  </div>}
  {tab==="exam"&&<div className="mt-6 rounded-2xl border bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-bold text-rose-800">Question {exam+1} of {examQs.length}</span><span className="text-xs text-slate-500">Short practice set</span></div><h3 className="mt-4 text-xl font-black">{q.q}</h3><div className="mt-4 grid gap-2">{q.o.map((o,i)=><button key={o} onClick={()=>{setSelected(i);setChecked(false)}} className={`rounded-xl border p-3 text-left text-sm ${selected===i?"border-rose-500 bg-rose-50":"hover:border-rose-300"}`}>{o}</button>)}</div>{checked&&<p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{selected===q.a?"Correct! ":"Not quite. "}{q.why}</p>}<div className="mt-4 flex flex-wrap gap-2"><button disabled={selected===null} onClick={()=>setChecked(true)} className="rounded-lg bg-rose-700 px-4 py-2 font-bold text-white disabled:opacity-40">Check answer</button><button onClick={()=>{setExam((exam+1)%examQs.length);setSelected(null);setChecked(false)}} className="rounded-lg border px-4 py-2 font-bold">Next question</button></div></div>}
 </section>
}
