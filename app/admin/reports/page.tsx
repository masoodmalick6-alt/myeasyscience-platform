import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, ClipboardList, Target, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminReportsPage() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
  if(profile?.role!=="admin") redirect("/dashboard");
  const [{data:learners},{data:progress},{data:attempts},{data:courses}]=await Promise.all([
    supabase.from("profiles").select("id,full_name,membership_tier,created_at").order("created_at",{ascending:false}).limit(100),
    supabase.from("lesson_progress").select("user_id,course_id,lesson_index,completed_at").order("completed_at",{ascending:false}).limit(5000),
    supabase.from("quiz_attempts").select("id,user_id,quiz_title,score,total,created_at").order("created_at",{ascending:false}).limit(500),
    supabase.from("courses").select("id,title,subject,lessons").eq("published",true)
  ]);
  const learnerRows=learners||[], progressRows=progress||[], attemptRows=attempts||[];
  const names=new Map(learnerRows.map(l=>[l.id,l.full_name||"Learner"]));
  const lessonsByUser=new Map<string,number>(), attemptsByUser=new Map<string,number>(), quizStats=new Map<string,{score:number,total:number,count:number}>();
  progressRows.forEach(p=>lessonsByUser.set(p.user_id,(lessonsByUser.get(p.user_id)||0)+1));
  attemptRows.forEach(a=>{
    attemptsByUser.set(a.user_id,(attemptsByUser.get(a.user_id)||0)+1);
    const stat=quizStats.get(a.quiz_title)||{score:0,total:0,count:0};
    stat.score+=a.score;stat.total+=a.total;stat.count++;quizStats.set(a.quiz_title,stat);
  });
  const activeIds=new Set([...progressRows.map(p=>p.user_id),...attemptRows.map(a=>a.user_id)]);
  const correct=attemptRows.reduce((n,a)=>n+a.score,0), total=attemptRows.reduce((n,a)=>n+a.total,0);
  const courseStats=(courses||[]).map(c=>{
    const done=progressRows.filter(p=>p.course_id===c.id).length;
    const expected=Array.isArray(c.lessons)?c.lessons.length:0;
    return {...c,done,expected,learners:new Set(progressRows.filter(p=>p.course_id===c.id).map(p=>p.user_id)).size};
  }).sort((a,b)=>b.learners-a.learners);
  return <main className="container py-10 md:py-14">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/> Admin workspace</Link>
    <div className="mt-6 flex flex-wrap justify-between items-end gap-4"><div><div className="text-sm font-bold uppercase tracking-wider text-blue-700">Administrator reporting</div><h1 className="text-3xl md:text-4xl font-black mt-2">Learner reports</h1><p className="text-slate-600 mt-2">A snapshot of recorded learning activity across MyEasyScience.</p></div><span className="text-xs text-slate-500">Latest 100 learner accounts · latest 500 quiz attempts · latest 5,000 lesson completions</span></div>
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <div className="card p-5"><Users className="text-blue-700"/><div className="text-3xl font-black mt-3">{learnerRows.length}</div><div className="text-sm text-slate-500">Learner accounts in report</div></div>
      <div className="card p-5"><BookOpen className="text-emerald-700"/><div className="text-3xl font-black mt-3">{progressRows.length}</div><div className="text-sm text-slate-500">Recorded lesson completions</div></div>
      <div className="card p-5"><ClipboardList className="text-violet-700"/><div className="text-3xl font-black mt-3">{attemptRows.length}</div><div className="text-sm text-slate-500">Recorded quiz attempts</div></div>
      <div className="card p-5"><Target className="text-amber-600"/><div className="text-3xl font-black mt-3">{total?Math.round(correct/total*100):0}%</div><div className="text-sm text-slate-500">Average quiz accuracy</div></div>
    </section>
    <section className="card p-6 mt-6">
      <h2 className="font-black text-xl">Learner activity</h2><p className="text-sm text-slate-500 mt-1">Accounts are listed by registration date. Activity totals reflect the records currently included in this report.</p>
      <div className="overflow-x-auto mt-5"><table className="w-full text-sm text-left"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3 pr-4">Learner</th><th className="py-3 pr-4">Joined</th><th className="py-3 pr-4">Membership</th><th className="py-3 pr-4 text-right">Lessons</th><th className="py-3 text-right">Quizzes</th></tr></thead><tbody>{learnerRows.map(l=><tr key={l.id} className="border-b border-slate-100"><td className="py-3 pr-4 font-semibold">{l.full_name||"Learner"}</td><td className="py-3 pr-4 text-slate-500">{new Date(l.created_at).toLocaleDateString()}</td><td className="py-3 pr-4 capitalize">{l.membership_tier}</td><td className="py-3 pr-4 text-right tabular-nums">{lessonsByUser.get(l.id)||0}</td><td className="py-3 text-right tabular-nums">{attemptsByUser.get(l.id)||0}</td></tr>)}</tbody></table></div>
      {!learnerRows.length&&<p className="text-sm text-slate-500 mt-4">No learner accounts found.</p>}
    </section>
    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      <section className="card p-6"><h2 className="font-black text-xl">Course engagement</h2><div className="space-y-4 mt-5">{courseStats.map(c=><div key={c.id}><div className="flex justify-between gap-3 text-sm"><div className="font-semibold">{c.title}</div><div className="text-slate-500 whitespace-nowrap">{c.learners} learners</div></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-2"><div className="h-full rounded-full bg-blue-600" style={{width:`${learnerRows.length?Math.min(100,c.learners/learnerRows.length*100):0}%`}}/></div><div className="text-xs text-slate-500 mt-1">{c.done} recorded lesson completions · {c.subject}</div></div>)}</div>{!courseStats.length&&<p className="text-sm text-slate-500 mt-3">No published courses.</p>}</section>
      <section className="card p-6"><h2 className="font-black text-xl">Quiz performance by quiz</h2><div className="space-y-4 mt-5">{Array.from(quizStats.entries()).sort((a,b)=>b[1].count-a[1].count).map(([title,stat])=><div key={title}><div className="flex justify-between gap-3 text-sm"><div className="font-semibold">{title}</div><div className="font-bold">{stat.total?Math.round(stat.score/stat.total*100):0}%</div></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-2"><div className="h-full rounded-full bg-violet-600" style={{width:`${stat.total?stat.score/stat.total*100:0}%`}}/></div><div className="text-xs text-slate-500 mt-1">{stat.count} attempts · {stat.score}/{stat.total} correct answers</div></div>)}</div>{!quizStats.size&&<p className="text-sm text-slate-500 mt-3">No quiz attempts recorded yet.</p>}</section>
    </div>
    <section className="card p-6 mt-6"><h2 className="font-black text-xl">Latest quiz submissions</h2>{attemptRows.length?<div className="overflow-x-auto mt-4"><table className="w-full text-sm text-left"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3 pr-4">Learner</th><th className="py-3 pr-4">Quiz</th><th className="py-3 pr-4">Score</th><th className="py-3">Submitted</th></tr></thead><tbody>{attemptRows.slice(0,20).map(a=><tr key={a.id} className="border-b border-slate-100"><td className="py-3 pr-4 font-semibold">{names.get(a.user_id)||"Learner"}</td><td className="py-3 pr-4">{a.quiz_title}</td><td className="py-3 pr-4 tabular-nums">{a.score}/{a.total}</td><td className="py-3 text-slate-500">{new Date(a.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>:<p className="text-sm text-slate-500 mt-3">No saved quiz attempts yet.</p>}</section>
    <p className="text-xs text-slate-400 mt-5">Privacy note: this report is restricted to administrator accounts. Data is limited to the query windows shown above; older records may not be included. Do not use this report as the sole basis for high-stakes educational decisions.</p>
  </main>;
}
