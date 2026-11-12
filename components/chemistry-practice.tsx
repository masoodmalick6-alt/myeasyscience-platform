"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Award, CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";

type Question = { id:number; topic:"elements"|"formulas"|"reactions"; level:"Beginner"|"Intermediate"; question:string; options:string[]; answer:number; explanation:string };
const bank:Question[] = [
{id:1,topic:"elements",level:"Beginner",question:"What is the chemical symbol for oxygen?",options:["Ox","O","Og","Oy"],answer:1,explanation:"O is the symbol for oxygen. Og is oganesson, a different element."},
{id:2,topic:"elements",level:"Beginner",question:"Which element has the symbol Na?",options:["Nitrogen","Neon","Sodium","Nickel"],answer:2,explanation:"Na comes from the Latin name natrium, which is why sodium's symbol is not S."},
{id:3,topic:"elements",level:"Beginner",question:"How many protons are in a carbon atom?",options:["6","12"," carbon has no protons","8"],answer:0,explanation:"Carbon's atomic number is 6, and the atomic number equals the number of protons."},
{id:4,topic:"elements",level:"Beginner",question:"Which family is found in Group 18?",options:["Alkali metals","Halogens","Noble gases","Transition metals"],answer:2,explanation:"Group 18 contains the noble gases, such as helium, neon and argon."},
{id:5,topic:"elements",level:"Intermediate",question:"Which element is a liquid near room temperature?",options:["Bromine","Sodium","Aluminium","Sulfur"],answer:0,explanation:"Bromine is a liquid nonmetal near room temperature. Mercury is the other familiar liquid element."},
{id:6,topic:"elements",level:"Intermediate",question:"Elements in the same group often have similar chemical behaviour because they have the same number of…",options:["Neutrons","Occupied shells","Outer-shell electrons","Protons"],answer:2,explanation:"For main-group elements, the number of valence (outer-shell) electrons is a major reason for similar chemical behaviour."},
{id:7,topic:"formulas",level:"Beginner",question:"What does the small 2 mean in H₂O?",options:["Two water molecules","Two hydrogen atoms","Two oxygen atoms","Two elements in water"],answer:1,explanation:"The subscript 2 applies to H, so each water molecule contains two hydrogen atoms and one oxygen atom."},
{id:8,topic:"formulas",level:"Beginner",question:"Which formula represents carbon dioxide?",options:["CO","CO₂","C₂O","CaO"],answer:1,explanation:"Carbon dioxide contains one carbon atom and two oxygen atoms: CO₂."},
{id:9,topic:"formulas",level:"Beginner",question:"How many oxygen atoms are in Ca(OH)₂?",options:["1","2","3","4"],answer:1,explanation:"The 2 outside the brackets multiplies everything inside them. There are two O atoms and two H atoms."},
{id:10,topic:"formulas",level:"Intermediate",question:"What is the total number of atoms in one formula unit of Al₂(SO₄)₃?",options:["9","12","17","20"],answer:2,explanation:"Al₂ gives 2 Al; (SO₄)₃ gives 3 S and 12 O. Total = 2 + 3 + 12 = 17 atoms."},
{id:11,topic:"formulas",level:"Intermediate",question:"Which pair of elements makes up table salt (sodium chloride)?",options:["Sodium and chlorine","Sulfur and carbon","Sodium and calcium","Chlorine and oxygen"],answer:0,explanation:"Sodium chloride has the formula NaCl: one sodium ion for each chloride ion."},
{id:12,topic:"formulas",level:"Intermediate",question:"What is the correct formula for magnesium chloride?",options:["MgCl","Mg₂Cl","MgCl₂","Mg₂Cl₂"],answer:2,explanation:"Magnesium forms Mg²⁺ and chloride forms Cl⁻, so two chloride ions balance one magnesium ion: MgCl₂."},
{id:13,topic:"reactions",level:"Beginner",question:"What is a reactant?",options:["A substance made by a reaction","A starting substance in a chemical reaction","A type of atom","A reaction's energy"],answer:1,explanation:"Reactants are the starting substances. Products are the substances formed."},
{id:14,topic:"reactions",level:"Beginner",question:"Which statement describes conservation of mass in a closed system?",options:["Atoms disappear","Products always weigh less","Total mass stays the same","Energy is destroyed"],answer:2,explanation:"In a closed system, mass is conserved. Atoms are rearranged, not created or destroyed in ordinary chemical reactions."},
{id:15,topic:"reactions",level:"Beginner",question:"What are the products when hydrogen reacts with oxygen to form water?",options:["Hydrogen and oxygen","Water","Hydrogen peroxide only","Carbon dioxide"],answer:1,explanation:"In 2H₂ + O₂ → 2H₂O, water is the product."},
{id:16,topic:"reactions",level:"Intermediate",question:"What coefficient balances H₂ + O₂ → H₂O?",options:["1, 1, 1","2, 1, 2","1, 2, 2","2, 2, 1"],answer:1,explanation:"2H₂ + O₂ → 2H₂O has four hydrogen atoms and two oxygen atoms on each side."},
{id:17,topic:"reactions",level:"Intermediate",question:"What type of reaction is 2Mg + O₂ → 2MgO?",options:["Decomposition","Combustion / combination","Neutralisation","Displacement"],answer:1,explanation:"Magnesium combines with oxygen and burns to form magnesium oxide. It can be described as a combination reaction and as combustion."},
{id:18,topic:"reactions",level:"Intermediate",question:"A catalyst in a reaction…",options:["Is used up completely","Changes the final products","Increases reaction rate without being consumed overall","Stops all collisions"],answer:2,explanation:"A catalyst provides an alternative pathway with lower activation energy and is regenerated by the end of the reaction."}
];

const topicNames={all:"All topics",elements:"Elements & periodic table",formulas:"Chemical formulas",reactions:"Chemical reactions"};
const topicColors={elements:"bg-blue-100 text-blue-800",formulas:"bg-violet-100 text-violet-800",reactions:"bg-emerald-100 text-emerald-800"};

export function ChemistryPractice() {
  const [topic,setTopic]=useState<"all"|"elements"|"formulas"|"reactions">("all");
  const [level,setLevel]=useState<"all"|"Beginner"|"Intermediate">("all");
  const [questions,setQuestions]=useState<Question[]>([]);
  const [index,setIndex]=useState(0);
  const [choice,setChoice]=useState<number|null>(null);
  const [answers,setAnswers]=useState<{id:number;correct:boolean;selected:number}[]>([]);
  const [complete,setComplete]=useState(false);
  const [reviewMode,setReviewMode]=useState(false);
  const [saveStatus,setSaveStatus]=useState<"idle"|"saving"|"saved"|"guest"|"error">("idle");
  const pool=useMemo(()=>bank.filter(q=>(topic==="all"||q.topic===topic)&&(level==="all"||q.level===level)),[topic,level]);
  const current=questions[index];
  const score=answers.filter(a=>a.correct).length;
  function start(retryWrong=false){
    const source=retryWrong?questions.filter(q=>answers.find(a=>a.id===q.id&&!a.correct)):pool;
    setQuestions(source);setIndex(0);setChoice(null);setAnswers([]);setComplete(false);setReviewMode(retryWrong);setSaveStatus("idle");
  }
  async function saveAttempt(finalAnswers:{id:number;correct:boolean;selected:number}[], finalQuestions:Question[]){
    if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){setSaveStatus("guest");return;}
    setSaveStatus("saving");
    try {
      const supabase=createClient();
      const {data:{user},error:authError}=await supabase.auth.getUser();
      if(authError||!user){setSaveStatus("guest");return;}
      const details=finalQuestions.map(q=>{const a=finalAnswers.find(x=>x.id===q.id)!;return {question_id:q.id,question:q.question,topic:q.topic,difficulty:q.level,selected_answer:q.options[a.selected],correct_answer:q.options[q.answer],is_correct:a.correct,explanation:q.explanation};});
      const {error}=await supabase.from("quiz_attempts").insert({user_id:user.id,quiz_title:`Chemistry Practice · ${topicNames[topic]} · ${level==="all"?"All levels":level}`,score:finalAnswers.filter(a=>a.correct).length,total:finalQuestions.length,answer_details:details});
      setSaveStatus(error?"error":"saved");
    } catch { setSaveStatus("error"); }
  }
  function submit(){
    if(choice===null||!current)return;
    const updated=[...answers,{id:current.id,correct:choice===current.answer,selected:choice}];
    setAnswers(updated);
    if(index===questions.length-1){setComplete(true);void saveAttempt(updated,questions);}
    else {setIndex(index+1);setChoice(null);}
  }
  if(!questions.length || (!complete&&!current)) return <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
    <section className="card p-6 md:p-8">
      <div className="flex items-center gap-2 text-blue-700 text-sm font-bold"><Target size={18}/> BUILD YOUR PRACTICE SET</div>
      <h2 className="text-2xl font-black mt-3">Choose what to practise</h2>
      <p className="text-slate-600 mt-2">Choose a topic and difficulty. Your quiz will contain all matching questions in this practice set.</p>
      <div className="mt-6"><label className="block text-sm font-bold mb-2">Topic</label><div className="grid sm:grid-cols-2 gap-2">{Object.entries(topicNames).map(([key,label])=><button key={key} onClick={()=>setTopic(key as typeof topic)} className={`p-3 rounded-xl border text-left text-sm font-bold ${topic===key?"border-blue-600 bg-blue-50 text-blue-800":"border-slate-200 hover:border-blue-300"}`}>{label}</button>)}</div></div>
      <div className="mt-6"><label className="block text-sm font-bold mb-2">Difficulty</label><div className="flex flex-wrap gap-2">{[["all","All levels"],["Beginner","Beginner"],["Intermediate","Intermediate"]].map(([key,label])=><button key={key} onClick={()=>setLevel(key as typeof level)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${level===key?"border-blue-600 bg-blue-50 text-blue-800":"border-slate-200"}`}>{label}</button>)}</div></div>
      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{pool.length} questions available in this selection.</div>
      <button onClick={()=>start()} disabled={!pool.length} className="btn btn-primary mt-5 disabled:opacity-40">Start practice <ArrowRight size={17}/></button>
    </section>
    <aside className="card p-5"><h3 className="font-extrabold">How it works</h3><ol className="list-decimal pl-5 text-sm text-slate-600 leading-6 mt-3 space-y-2"><li>Pick a chemistry topic and level.</li><li>Choose one answer for each question.</li><li>Get instant feedback and explanations.</li><li>Review your score and retry missed questions.</li></ol><div className="mt-5 text-xs text-slate-500">Sign in to save quiz scores and answer-by-answer review to your learning history.</div></aside>
  </div>;

  if(complete){
    const percent=Math.round(score/questions.length*100);
    const missed=questions.filter(q=>answers.some(a=>a.id===q.id&&!a.correct));
    return <div className="card p-6 md:p-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="mx-auto rounded-2xl bg-blue-50 text-blue-700 w-16 h-16 flex items-center justify-center"><Award size={32}/></div>
        <p className="text-blue-700 font-bold text-sm mt-4">PRACTICE COMPLETE</p>
        <h2 className="text-3xl font-black mt-2">{percent>=80?"Excellent work!":percent>=60?"Good progress!":"Keep practising!"}</h2>
        <div className="text-5xl font-black mt-4">{score}<span className="text-2xl text-slate-400">/{questions.length}</span></div>
        <p className="text-slate-600 mt-2">{percent}% correct · {missed.length} to review</p>
        <p className={`text-sm mt-3 ${saveStatus==="error"?"text-rose-700":"text-slate-500"}`}>{saveStatus==="saving"?"Saving your result…":saveStatus==="saved"?"Your result and answer review have been saved to My Progress.":saveStatus==="guest"?"Sign in to save this result. Your score is still shown here.":saveStatus==="error"?"We couldn't save this attempt. Please check your connection and try another quiz.":""}</p>
        <div className="h-3 bg-slate-100 rounded-full mt-5 overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width:`${percent}%`}}/></div>
      </div>
      <div className="mt-8"><h3 className="font-extrabold text-lg">Review your answers</h3><div className="space-y-3 mt-4">{questions.map((q,i)=>{const a=answers.find(x=>x.id===q.id)!;return <div key={q.id} className="border border-slate-200 rounded-xl p-4"><div className="flex items-start gap-2">{a.correct?<CheckCircle2 className="text-emerald-600 mt-0.5" size={18}/>:<XCircle className="text-rose-600 mt-0.5" size={18}/>}<div className="min-w-0"><p className="font-bold text-sm">{i+1}. {q.question}</p><p className="text-xs text-slate-500 mt-1">Your answer: {q.options[a.selected]} · Correct answer: {q.options[q.answer]}</p><p className="text-sm text-slate-600 mt-2 leading-6">{q.explanation}</p></div></div></div>})}</div></div>
      <div className="flex flex-wrap gap-2 mt-6"><button onClick={()=>start()} className="btn btn-primary"><RotateCcw size={16}/> Try again</button>{missed.length>0&&<button onClick={()=>start(true)} className="btn btn-secondary">Practise missed questions</button>}<button onClick={()=>{setQuestions([]);setComplete(false);setAnswers([]);}} className="btn btn-secondary">Change topic</button></div>
    </div>;
  }

  return <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
    <section className="card p-5 md:p-7">
      <div className="flex flex-wrap justify-between gap-2 text-sm font-bold text-slate-500"><span>Question {index+1} of {questions.length}</span><span>{topicNames[current.topic]}</span></div>
      <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{width:`${((index+(choice!==null?1:0))/questions.length)*100}%`}}/></div>
      <div className="flex gap-2 mt-5"><span className={`text-xs font-bold px-3 py-1 rounded-full ${topicColors[current.topic]}`}>{topicNames[current.topic]}</span><span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">{current.level}</span></div>
      <h2 className="text-2xl font-black leading-snug mt-5">{current.question}</h2>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">{current.options.map((option,i)=><button key={i} disabled={choice!==null} onClick={()=>setChoice(i)} className={`text-left rounded-xl border p-4 font-semibold transition ${choice===i?"border-blue-600 bg-blue-50 text-blue-900":choice!==null&&i===current.answer?"border-emerald-500 bg-emerald-50 text-emerald-900":"border-slate-200 hover:border-blue-300"}`}>{String.fromCharCode(65+i)}. {option}</button>)}</div>
      <button onClick={submit} disabled={choice===null} className="btn btn-primary mt-6 disabled:opacity-40">{index===questions.length-1?"Finish practice":"Submit & continue"} <ArrowRight size={16}/></button>
    </section>
    <aside className="card p-5"><h3 className="font-extrabold">Your progress</h3><p className="text-3xl font-black mt-3">{answers.length}<span className="text-base text-slate-400">/{questions.length}</span></p><p className="text-sm text-slate-500">Questions answered</p><div className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">Correct</span><b className="text-emerald-700">{score}</b></div><div className="flex justify-between"><span className="text-slate-500">Incorrect</span><b className="text-rose-700">{answers.length-score}</b></div></div><button onClick={()=>{setQuestions([]);setAnswers([]);setComplete(false);}} className="text-sm font-bold text-slate-500 mt-6 hover:text-blue-700">Exit practice</button></aside>
  </div>;
}
