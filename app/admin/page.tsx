import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Users, GraduationCap, PlusCircle, ShieldCheck, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createCourse, deleteCourse } from "./actions";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{error?:string;created?:string;deleted?:string}> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id",user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");
  const [{data:students},{data:courses},{count:studentCount},{count:courseCount}] = await Promise.all([
    supabase.from("profiles").select("id,full_name,membership_tier,created_at").order("created_at",{ascending:false}).limit(10),
    supabase.from("courses").select("id,title,subject,level,published,created_at").order("created_at",{ascending:false}),
    supabase.from("profiles").select("*",{count:"exact",head:true}),
    supabase.from("courses").select("*",{count:"exact",head:true})
  ]);
  const notices = await searchParams;
  return <main className="container py-10 md:py-14">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-blue-700 text-sm font-bold uppercase tracking-wider"><ShieldCheck size={16}/> Admin workspace</div><h1 className="text-4xl font-black mt-2">Manage MyEasyScience</h1><p className="text-slate-600 mt-2">Welcome, {profile.full_name || "Administrator"}. Manage courses and view learner accounts.</p></div><div className="flex gap-2"><Link href="/admin/reports" className="btn btn-primary">Learner reports</Link><Link href="/dashboard" className="btn btn-secondary">Student view</Link></div></div>
    {notices.error && <p className="mt-6 rounded-xl bg-red-50 text-red-800 p-4 text-sm">{notices.error}</p>}
    {notices.created && <p className="mt-6 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">Course created successfully.</p>}
    {notices.deleted && <p className="mt-6 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">Course deleted.</p>}
    <div className="grid sm:grid-cols-3 gap-4 mt-8">
      <div className="card p-5"><Users className="text-blue-700"/><div className="text-3xl font-black mt-3">{studentCount ?? "—"}</div><div className="text-sm text-slate-500">Registered accounts</div></div>
      <div className="card p-5"><BookOpen className="text-emerald-700"/><div className="text-3xl font-black mt-3">{courseCount ?? "—"}</div><div className="text-sm text-slate-500">Admin-created courses</div></div>
      <div className="card p-5"><GraduationCap className="text-violet-700"/><div className="text-3xl font-black mt-3">{students?.filter(s=>s.membership_tier==="premium").length ?? "—"}</div><div className="text-sm text-slate-500">Premium users in latest 10</div></div>
    </div>
    <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 mt-8">
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-5"><PlusCircle className="text-blue-700"/><h2 className="text-xl font-black">Create a course</h2></div>
        <form action={createCourse} className="space-y-4">
          <div><label className="block text-sm font-bold mb-1" htmlFor="title">Course title</label><input className="field" id="title" name="title" required maxLength={90} placeholder="e.g. Introduction to ecosystems"/></div>
          <div className="grid sm:grid-cols-2 gap-3"><div><label className="block text-sm font-bold mb-1" htmlFor="subject">Subject</label><select className="field" id="subject" name="subject"><option>Biology</option><option>Chemistry</option><option>Physics</option><option>Mathematics</option><option>Earth Science</option></select></div><div><label className="block text-sm font-bold mb-1" htmlFor="level">Level</label><select className="field" id="level" name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div></div>
          <div><label className="block text-sm font-bold mb-1" htmlFor="description">Short description</label><textarea className="field min-h-20" id="description" name="description" required maxLength={300}/></div>
          <div><label className="block text-sm font-bold mb-1" htmlFor="lessonTitles">Lesson titles (one per line)</label><textarea className="field min-h-24" id="lessonTitles" name="lessonTitles" required placeholder={"What is an ecosystem?\nFood chains and webs"}/></div>
          <div><label className="block text-sm font-bold mb-1" htmlFor="lessonBodies">Lesson content (separate each lesson with a line containing ---)</label><textarea className="field min-h-40" id="lessonBodies" name="lessonBodies" required placeholder={"An ecosystem includes living organisms and their environment.\n---\nA food chain shows how energy moves between organisms."}/></div>
          <p className="text-xs text-slate-500">The number of lesson titles must match the number of lesson content sections. New courses are published immediately.</p>
          <button className="btn btn-primary" type="submit">Create course</button>
        </form>
      </section>
      <div className="space-y-6">
        <section className="card p-6"><h2 className="text-xl font-black mb-4">Course library</h2>{courses?.length ? <div className="space-y-3">{courses.map(c=><div key={c.id} className="border border-slate-100 rounded-xl p-3"><div className="flex justify-between gap-3"><div><div className="font-bold">{c.title}</div><div className="text-xs text-slate-500 mt-1">{c.subject} · {c.level} · {c.published?"Published":"Draft"}</div><Link className="text-xs text-blue-700 font-bold inline-block mt-2" href={`/courses/${c.id}`}>Preview course →</Link></div><form action={deleteCourse}><input type="hidden" name="id" value={c.id}/><button aria-label={`Delete ${c.title}`} className="text-red-600 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={17}/></button></form></div></div>)}</div> : <p className="text-sm text-slate-500">No admin-created courses yet.</p>}</section>
        <section className="card p-6"><h2 className="text-xl font-black mb-4">Recent learner accounts</h2>{students?.length ? <div className="space-y-3">{students.map(s=><div key={s.id} className="flex items-center justify-between gap-3 text-sm border-b border-slate-100 pb-3"><div className="min-w-0"><div className="font-bold truncate">{s.full_name || "Learner"}</div><div className="text-xs text-slate-500">{new Date(s.created_at).toLocaleDateString()}</div></div><span className="text-xs rounded-full bg-slate-100 px-2 py-1 capitalize">{s.membership_tier}</span></div>)}</div> : <p className="text-sm text-slate-500">No learner profiles found.</p>}</section>
      </div>
    </div>
    <p className="text-xs text-slate-500 mt-6">Admin access is checked on the server. Assign administrator roles manually through the Supabase SQL editor; never expose service-role keys in the browser.</p>
  </main>;
}
