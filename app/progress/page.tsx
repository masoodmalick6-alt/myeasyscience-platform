import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpen, CalendarDays, Flame, GraduationCap, Target, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { courses as starterCourses } from "@/lib/course-data";

function dayKey(value:string) { return new Date(value).toISOString().slice(0,10); }
function getStreak(days:Set<string>) {
  let cursor=new Date();
  cursor.setUTCHours(0,0,0,0);
  const today=cursor.toISOString().slice(0,10);
  if(!days.has(today)) cursor.setUTCDate(cursor.getUTCDate()-1);
  let count=0;
  while(days.has(cursor.toISOString().slice(0,10)) && count<3650) {
    count++; cursor.setUTCDate(cursor.getUTCDate()-1);
  }
  return count;
}

export default async function ProgressPage() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const [{data:profile},{data:attempts},{data:progress},{data:dbCourses}]=await Promise.all([
    supabase.from("profiles").select("full_name,membership_tier").eq("id",user.id).maybeSingle(),
    supabase.from("quiz_attempts").select("id,quiz_title,score,total,created_at,answer_details").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100),
    supabase.from("lesson_progress").select("course_id,lesson_index,completed_at").eq("user_id",user.id).order("completed_at",{ascending:false}),
    supabase.from("courses").select("id,title,subject,level,description,lessons").eq("published",true)
  ]);
  const courseMap=new Map<string,any>();
  starterCourses.forEach(c=>courseMap.set(c.id,c));
  (dbCourses||[]).forEach(c=>courseMap.set(c.id,c));
  const completedByCourse=new Map<string,Set<number>>();
  (progress||[]).forEach(p=>{
    if(!completedByCourse.has(p.course_id))completedByCourse.set(p.course_id,new Set());
    completedByCourse.get(p.course_id)!.add(p.lesson_index);
  });
  const courseRows=Array.from(courseMap.values()).map(c=>{
    const done=completedByCourse.get(c.id)?.size||0;
    const total=Array.isArray(c.lessons)?c.lessons.length:0;
    return {...c,done,total,percent:total?Math.min(100,Math.round(done/total*100)):0};
  }).filter(c=>c.total>0).sort((a,b)=>b.percent-a.percent);
  const days=new Set<string>();
  (progress||[]).forEach(p=>{if(p.completed_at)days.add(dayKey(p.completed_at));});
  (attempts||[]).forEach(a=>days.add(dayKey(a.created_at)));
  const streak=getStreak(days);
  const today=new Date(); today.setUTCHours(0,0,0,0);
  const week=Array.from({length:7},(_,i)=>{
    const d=new Date(today); d.setUTCDate(today.getUTCDate()-(6-i));
    const key=d.toISOString().slice(0,10);
    return {key,label:d.toLocaleDateString("en-US",{weekday:"short",timeZone:"UTC"}),active:days.has(key)};
  });
  const totalLessons=progress?.length||0;
  const completedCourses=courseRows.filter(c=>c.total>0&&c.done>=c.total).length;
  const totalQuestions=(attempts||[]).reduce((sum,a)=>sum+(a.total||0),0);
  const correctQuestions=(attempts||[]).reduce((sum,a)=>sum+(a.score||0),0);
  const average=totalQuestions?Math.round(correctQuestions/totalQuestions*100):0;
  const achievements=[
    {title:"First steps",desc:"Complete your first lesson",earned:totalLessons>=1,icon:BookOpen},
    {title:"Quiz starter",desc:"Complete your first quiz",earned:(attempts||[]).length>=1,icon:Target},
    {title:"Five lessons",desc:"Complete five lessons",earned:totalLessons>=5,icon:Award},
    {title:"Learning streak",desc:"Be active on three consecutive days",earned:streak>=3,icon:Flame},
    {title:"Course finisher",desc:"Complete an entire course",earned:completedCourses>=1,icon:GraduationCap},
    {title:"Quiz champion",desc:"Reach 80% average across quiz attempts",earned:(attempts||[]).length>=3&&average>=80,icon:Trophy}
  ];
  const name=profile?.full_name||user.user_metadata?.full_name||"Learner";
  return <main className="container py-10 md:py-14">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div><div className="flex items-center gap-2 text-blue-700 text-sm font-bold uppercase tracking-wider"><Trophy size={16}/> Learning progress</div><h1 className="text-3xl md:text-4xl font-black mt-2">{name.split(" ")[0]}'s progress centre</h1><p className="text-slate-600 mt-2">See your learning activity, celebrate milestones and choose what to study next.</p></div>
      <Link href="/dashboard" className="btn btn-secondary">Back to dashboard</Link>
    </div>
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-5"><BookOpen className="text-blue-700"/><div className="text-3xl font-black mt-3">{totalLessons}</div><p className="text-sm text-slate-500">Lessons completed</p></div>
      <div className="card p-5"><Target className="text-violet-700"/><div className="text-3xl font-black mt-3">{(attempts||[]).length}</div><p className="text-sm text-slate-500">Recent quiz attempts</p></div>
      <div className="card p-5"><Flame className="text-orange-600"/><div className="text-3xl font-black mt-3">{streak} <span className="text-base font-semibold text-slate-500">days</span></div><p className="text-sm text-slate-500">Current activity streak</p></div>
      <div className="card p-5"><Award className="text-amber-600"/><div className="text-3xl font-black mt-3">{completedCourses}</div><p className="text-sm text-slate-500">Courses completed</p></div>
    </section>
    <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 mt-6">
      <section className="card p-6">
        <div className="flex items-center gap-2"><CalendarDays className="text-blue-700"/><h2 className="font-black text-xl">Your last seven days</h2></div>
        <p className="text-sm text-slate-500 mt-1">A day is active when you complete a lesson or submit a saved quiz.</p>
        <div className="grid grid-cols-7 gap-2 mt-6">{week.map(d=><div key={d.key} className="text-center"><div className={`mx-auto h-12 w-full max-w-12 rounded-xl flex items-center justify-center ${d.active?"bg-emerald-100 text-emerald-800":"bg-slate-100 text-slate-400"}`}>{d.active?<span className="font-black">✓</span>:<span className="text-xs">—</span>}</div><div className="text-xs text-slate-500 mt-2">{d.label}</div></div>)}</div>
      </section>
      <section className="card p-6">
        <h2 className="font-black text-xl">Quiz performance</h2>
        {totalQuestions>0?<><div className="text-4xl font-black mt-4">{average}%</div><p className="text-sm text-slate-500">Overall average across {totalQuestions} answered questions</p><div className="h-3 bg-slate-100 rounded-full overflow-hidden mt-4"><div className="h-full bg-blue-600 rounded-full" style={{width:`${average}%`}}/></div><div className="flex justify-between text-xs text-slate-500 mt-2"><span>{correctQuestions} correct</span><span>{totalQuestions-correctQuestions} to improve</span></div></>:<div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Complete a saved quiz to start seeing your performance here.</div>}
        <Link href="/chemistry-practice" className="inline-flex mt-5 text-sm font-bold text-blue-700">Practise chemistry →</Link>
      </section>
    </div>
    <section className="card p-6 mt-6">
      <div className="flex flex-wrap justify-between items-center gap-3"><div><h2 className="font-black text-xl">Course progress</h2><p className="text-sm text-slate-500 mt-1">Lessons marked complete are counted automatically.</p></div><Link href="/courses" className="text-sm font-bold text-blue-700">Browse courses →</Link></div>
      {courseRows.length?<div className="grid md:grid-cols-2 gap-4 mt-5">{courseRows.map(c=><div key={c.id} className="border border-slate-100 rounded-xl p-4"><div className="flex justify-between gap-3"><div className="min-w-0"><div className="text-xs font-bold text-blue-700">{c.subject} · {c.level}</div><h3 className="font-bold mt-1">{c.title}</h3></div><b className="text-sm">{c.percent}%</b></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-4"><div className="h-full bg-blue-600 rounded-full" style={{width:`${c.percent}%`}}/></div><div className="flex justify-between items-center mt-2 text-xs text-slate-500"><span>{c.done} of {c.total} lessons</span><Link href={`/courses/${c.id}`} className="font-bold text-blue-700">Continue →</Link></div></div>)}</div>:<p className="text-sm text-slate-500 mt-4">No courses available yet.</p>}
    </section>
    <section className="card p-6 mt-6">
      <h2 className="font-black text-xl">Achievements</h2><p className="text-sm text-slate-500 mt-1">Milestones unlock as you learn.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">{achievements.map(a=><div key={a.title} className={`rounded-xl border p-4 flex gap-3 ${a.earned?"border-amber-200 bg-amber-50":"border-slate-100 bg-slate-50 opacity-70"}`}><div className={`rounded-xl p-2 h-fit ${a.earned?"bg-white text-amber-700":"bg-slate-200 text-slate-500"}`}><a.icon size={20}/></div><div><div className="font-bold text-sm">{a.title}</div><div className="text-xs text-slate-600 mt-1">{a.desc}</div><div className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${a.earned?"text-amber-800":"text-slate-500"}`}>{a.earned?"Unlocked":"Not yet unlocked"}</div></div></div>)}</div>
    </section>
    <section className="card p-6 mt-6"><h2 className="font-black text-xl">Recent learning activity</h2><div className="grid md:grid-cols-2 gap-5 mt-4"><div><h3 className="text-sm font-bold text-slate-600">Quiz attempts</h3>{attempts?.length?<div className="space-y-2 mt-3">{attempts.slice(0,8).map(a=><div key={a.id} className="flex justify-between gap-3 border-b border-slate-100 pb-2 text-sm"><div><div className="font-semibold">{a.quiz_title}</div><div className="text-xs text-slate-500">{new Date(a.created_at).toLocaleDateString()}</div>{Array.isArray(a.answer_details)&&a.answer_details.length>0&&<details className="mt-2 text-xs"><summary className="cursor-pointer font-bold text-blue-700">Review {a.answer_details.length} answers</summary><div className="space-y-2 mt-2">{a.answer_details.map((d:any,i:number)=><div key={i} className="rounded-lg bg-slate-50 p-2"><div className="font-semibold">{i+1}. {d.question}</div><div className={d.is_correct?"text-emerald-700":"text-rose-700"}>Your answer: {d.selected_answer}</div>{!d.is_correct&&<div className="text-emerald-700">Correct answer: {d.correct_answer}</div>}<div className="text-slate-500 mt-1">{d.explanation}</div></div>)}</div></details>}</div><b>{a.score}/{a.total}</b></div>)}</div>:<p className="text-sm text-slate-500 mt-2">No saved quiz attempts yet.</p>}</div><div><h3 className="text-sm font-bold text-slate-600">Recently completed lessons</h3>{progress?.length?<div className="space-y-2 mt-3">{progress.slice(0,8).map((p,i)=><div key={`${p.course_id}-${p.lesson_index}`} className="border-b border-slate-100 pb-2 text-sm"><div className="font-semibold">{courseMap.get(p.course_id)?.title||p.course_id}</div><div className="text-xs text-slate-500">Lesson {p.lesson_index+1} · {new Date(p.completed_at).toLocaleDateString()}</div></div>)}</div>:<p className="text-sm text-slate-500 mt-2">No completed lessons yet.</p>}</div></div></section>
    <p className="text-xs text-slate-400 mt-5">Streaks and activity dates use UTC calendar days. Quiz performance is calculated from the most recent 100 saved attempts. Learning activity is based on lessons and quiz attempts recorded in your account.</p>
  </main>;
}
