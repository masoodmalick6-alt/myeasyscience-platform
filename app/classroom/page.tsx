import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ClipboardCheck, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { completeAssignment, joinClass } from "./actions";

export default async function ClassroomPage({ searchParams }: { searchParams: Promise<{error?:string;joined?:string;completed?:string}> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{data:memberships},{data:profile}] = await Promise.all([
    supabase.from("class_members").select("class_id,joined_at").eq("student_id",user.id),
    supabase.from("profiles").select("role,full_name").eq("id",user.id).maybeSingle()
  ]);
  const ids = (memberships||[]).map(m=>m.class_id);
  const [{data:classes},{data:submissions}] = ids.length ? await Promise.all([
    supabase.from("classes").select("id,name,subject,grade_level,teacher_id").in("id",ids),
    supabase.from("assignment_submissions").select("assignment_id,status,submitted_at").eq("student_id",user.id)
  ]) : [{data:[]},{data:[]}];
  const {data:assignments} = ids.length ? await supabase.from("assignments").select("id,class_id,title,description,due_at,created_at").in("class_id",ids).order("created_at",{ascending:false}) : {data:[]};
  const notices = await searchParams;
  const done = new Set((submissions||[]).filter(s=>s.status==="completed").map(s=>s.assignment_id));
  return <main className="container py-10 md:py-14">
    <div className="flex flex-wrap justify-between items-end gap-4"><div><div className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2"><Users size={17}/> Student classroom</div><h1 className="text-4xl font-black mt-2">My classrooms</h1><p className="text-slate-600 mt-2">Join a class with your teacher's code and keep track of assigned work.</p></div><Link href="/dashboard" className="btn btn-secondary">My dashboard</Link></div>
    {notices.error && <p className="mt-5 rounded-xl bg-red-50 text-red-800 p-4 text-sm">{notices.error}</p>}
    {notices.joined && <p className="mt-5 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">You joined the class successfully.</p>}
    {notices.completed && <p className="mt-5 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">Assignment marked complete.</p>}
    <section className="card p-6 mt-8"><h2 className="text-xl font-black mb-2">Join a classroom</h2><p className="text-sm text-slate-500 mb-4">Ask your teacher for the 8-character invite code.</p><form action={joinClass} className="flex flex-col sm:flex-row gap-3 max-w-xl"><input className="field font-mono uppercase tracking-widest" name="invite_code" required minLength={8} maxLength={8} placeholder="e.g. A1B2C3D4" aria-label="Class invite code"/><button className="btn btn-primary shrink-0" type="submit">Join class</button></form></section>
    <div className="mt-8"><h2 className="text-2xl font-black mb-4">Your classes</h2>{classes?.length ? <div className="grid md:grid-cols-2 gap-4">{classes.map(c=><section className="card p-6" key={c.id}><div className="text-blue-700"><BookOpen/></div><h3 className="text-xl font-black mt-3">{c.name}</h3><p className="text-sm text-slate-500">{c.subject}{c.grade_level?` · ${c.grade_level}`:""}</p><div className="mt-5 space-y-3">{(assignments||[]).filter(a=>a.class_id===c.id).map(a=><div className="rounded-xl border border-slate-100 p-4" key={a.id}><div className="flex justify-between gap-3"><div className="font-bold">{a.title}</div>{done.has(a.id)?<span className="text-xs text-emerald-700 font-bold">Complete</span>:<span className="text-xs text-amber-700 font-bold">To do</span>}</div>{a.description&&<p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{a.description}</p>}<p className="text-xs text-slate-500 mt-2">{a.due_at?`Due ${new Date(a.due_at).toLocaleDateString()}`:"No due date"}</p>{!done.has(a.id)&&<form action={completeAssignment} className="mt-3"><input type="hidden" name="assignment_id" value={a.id}/><button className="btn btn-secondary text-sm" type="submit"><ClipboardCheck size={16}/> Mark complete</button></form>}</div>)}</div>{!(assignments||[]).some(a=>a.class_id===c.id)&&<p className="text-sm text-slate-500 mt-4">No assignments yet. Check back later.</p>}</section>)}</div> : <div className="card p-8 text-center"><BookOpen className="mx-auto text-slate-400" size={32}/><p className="font-bold mt-3">You haven't joined a class yet.</p><p className="text-sm text-slate-500 mt-1">Enter an invite code above to get started.</p></div>}</div>
  </main>;
}
