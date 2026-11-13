import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAssignment, createClass } from "./actions";

export default async function TeacherPage({ searchParams }: { searchParams: Promise<{error?:string;created?:string;assigned?:string}> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", user.id).maybeSingle();
  if (!["teacher","admin"].includes(profile?.role || "")) redirect("/dashboard");
  const [{data:classes},{data:assignments},{data:members}] = await Promise.all([
    supabase.from("classes").select("id,name,subject,grade_level,invite_code,created_at").eq("teacher_id",user.id).order("created_at",{ascending:false}),
    supabase.from("assignments").select("id,class_id,title,description,due_at,created_at").order("created_at",{ascending:false}).limit(100),
    supabase.from("class_members").select("id,class_id,student_id,joined_at").order("joined_at",{ascending:false}).limit(500)
  ]);
  const notices = await searchParams;
  const myClasses = classes || [];
  const classIds = new Set(myClasses.map(c=>c.id));
  const myAssignments = (assignments||[]).filter(a=>classIds.has(a.class_id));
  const myMembers = (members||[]).filter(m=>classIds.has(m.class_id));
  return <main className="container py-10 md:py-14">
    <div className="flex flex-wrap justify-between items-end gap-4">
      <div><div className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2"><GraduationCap size={17}/> Teacher workspace</div><h1 className="text-4xl font-black mt-2">Your classrooms</h1><p className="text-slate-600 mt-2">Create classes, invite learners and set learning assignments.</p></div>
      <div className="flex flex-wrap gap-2"><Link href="/teacher/certificates" className="btn btn-primary">Issue certificates</Link><Link href="/classroom" className="btn btn-secondary">Student classroom view</Link></div>
    </div>
    {notices.error && <p className="mt-5 rounded-xl bg-red-50 text-red-800 p-4 text-sm">{notices.error}</p>}
    {notices.created && <p className="mt-5 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">Class created. Share its invite code with your students.</p>}
    {notices.assigned && <p className="mt-5 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">Assignment created.</p>}
    <section className="grid sm:grid-cols-3 gap-4 mt-8">
      <div className="card p-5"><BookOpen className="text-blue-700"/><div className="text-3xl font-black mt-3">{myClasses.length}</div><p className="text-sm text-slate-500">Your classes</p></div>
      <div className="card p-5"><Users className="text-emerald-700"/><div className="text-3xl font-black mt-3">{myMembers.length}</div><p className="text-sm text-slate-500">Class memberships loaded (up to 500)</p></div>
      <div className="card p-5"><ClipboardList className="text-violet-700"/><div className="text-3xl font-black mt-3">{myAssignments.length}</div><p className="text-sm text-slate-500">Assignments (up to 100)</p></div>
    </section>
    <div className="grid lg:grid-cols-2 gap-6 mt-7">
      <section className="card p-6">
        <h2 className="text-xl font-black mb-4">Create a classroom</h2>
        <form action={createClass} className="space-y-3">
          <div><label className="block text-sm font-bold mb-1" htmlFor="class-name">Class name</label><input className="field" id="class-name" name="name" required maxLength={90} placeholder="e.g. Year 8 Science"/></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-bold mb-1" htmlFor="class-subject">Subject</label><select className="field" id="class-subject" name="subject"><option>General Science</option><option>Biology</option><option>Chemistry</option><option>Physics</option><option>Mathematics</option><option>Earth Science</option></select></div>
            <div><label className="block text-sm font-bold mb-1" htmlFor="grade-level">Grade / level</label><input className="field" id="grade-level" name="grade_level" maxLength={40} placeholder="e.g. Grade 8"/></div>
          </div>
          <button className="btn btn-primary" type="submit">Create class</button>
        </form>
        <div className="border-t border-slate-100 mt-6 pt-5"><h3 className="font-black mb-3">Your classes and invite codes</h3>
          {myClasses.length ? <div className="space-y-3">{myClasses.map(c=><div key={c.id} className="rounded-xl border border-slate-200 p-4"><div className="font-bold">{c.name}</div><div className="text-sm text-slate-500">{c.subject}{c.grade_level?` · ${c.grade_level}`:""}</div><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-slate-500">Student invite code</span><span className="font-mono font-black tracking-widest bg-blue-50 text-blue-800 rounded-lg px-3 py-2">{c.invite_code}</span></div><p className="text-xs text-slate-500 mt-2">{myMembers.filter(m=>m.class_id===c.id).length} enrolled learner(s) in loaded roster</p></div>)}</div> : <p className="text-sm text-slate-500">Create your first class to generate an invite code.</p>}
        </div>
      </section>
      <section className="card p-6">
        <h2 className="text-xl font-black mb-4">Create an assignment</h2>
        {myClasses.length ? <form action={createAssignment} className="space-y-3">
          <div><label className="block text-sm font-bold mb-1" htmlFor="assignment-class">Class</label><select className="field" id="assignment-class" name="class_id" required>{myClasses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="block text-sm font-bold mb-1" htmlFor="assignment-title">Assignment title</label><input className="field" id="assignment-title" name="title" required maxLength={120} placeholder="e.g. Revise states of matter"/></div>
          <div><label className="block text-sm font-bold mb-1" htmlFor="assignment-description">Instructions</label><textarea className="field min-h-28" id="assignment-description" name="description" maxLength={1500} placeholder="Explain what students should read, practise or submit."/></div>
          <div><label className="block text-sm font-bold mb-1" htmlFor="assignment-due">Due date (optional)</label><input className="field" type="date" id="assignment-due" name="due_at"/></div>
          <button className="btn btn-primary" type="submit">Publish assignment</button>
        </form> : <p className="text-sm text-slate-500">Create a classroom first, then you can publish assignments for it.</p>}
        <div className="border-t border-slate-100 mt-6 pt-5"><h3 className="font-black mb-3">Recent assignments</h3>
          {myAssignments.length ? <div className="space-y-3">{myAssignments.map(a=><div key={a.id} className="border-b border-slate-100 pb-3"><div className="font-bold">{a.title}</div><p className="text-xs text-slate-500 mt-1">{myClasses.find(c=>c.id===a.class_id)?.name || "Class"}{a.due_at?` · Due ${new Date(a.due_at).toLocaleDateString()}`:" · No due date"}</p>{a.description&&<p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{a.description}</p>}</div>)}</div> : <p className="text-sm text-slate-500">No assignments published yet.</p>}
        </div>
      </section>
    </div>
    <p className="text-xs text-slate-500 mt-6">Roster counts are based on the latest 500 memberships returned. This is a starter classroom tool; it does not yet support file uploads, grading rubrics or parent accounts.</p>
  </main>;
}
