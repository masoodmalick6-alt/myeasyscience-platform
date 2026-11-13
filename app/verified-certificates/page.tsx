import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function VerifiedCertificatesPage() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:certificates,error}=await supabase.from("verified_certificates").select("id,title,subject,teacher_note,awarded_at,teacher_id,class_id,certificate_ref,revoked_at").eq("student_id",user.id).order("awarded_at",{ascending:false});
  const teacherIds=[...new Set((certificates||[]).map(c=>c.teacher_id))];
  const {data:teachers}=teacherIds.length?await supabase.from("profiles").select("id,full_name").in("id",teacherIds):{data:[]};
  const names=new Map((teachers||[]).map(t=>[t.id,t.full_name||"Teacher"]));
  return <main className="container py-10 md:py-14">
    <Link href="/certificates" className="text-sm font-bold text-blue-700">← Personal certificates</Link>
    <div className="mt-4 flex items-center gap-3"><div className="rounded-xl bg-emerald-100 p-3 text-emerald-800"><ShieldCheck size={25}/></div><div><p className="text-sm font-bold uppercase tracking-wider text-emerald-700">Teacher verified</p><h1 className="text-3xl font-black md:text-4xl">My verified certificates</h1></div></div>
    <p className="mt-3 max-w-2xl text-slate-600">Certificates issued by your classroom teacher are listed here.</p>
    {error?<p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Verified certificate records are not available yet. Ask your site administrator to apply the V31 database migration.</p>:
      (certificates||[]).length?<div className="mt-7 grid gap-4 md:grid-cols-2">{certificates!.map(c=><article key={c.id} className="rounded-2xl border-2 border-emerald-200 bg-white p-6 dark:border-emerald-900 dark:bg-slate-900"><div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><Award size={22}/><span className="text-xs font-black uppercase tracking-wider">Teacher verified award</span></div><h2 className="mt-4 text-2xl font-black">{c.title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{c.subject}</p>{c.teacher_note&&<p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800">{c.teacher_note}</p>}<div className="mt-5 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-700">Awarded by {names.get(c.teacher_id)||"Teacher"} · {new Date(c.awarded_at).toLocaleDateString()}</div><p className="mt-2 font-mono text-xs text-slate-600 dark:text-slate-300">Reference: {c.certificate_ref||"Pending migration"}</p>{c.certificate_ref&&<Link className="mt-3 inline-block text-sm font-bold text-blue-700" href={`/verify-certificate?reference=${c.certificate_ref}`}>Open verification portal →</Link>}{c.revoked_at&&<p className="mt-2 text-xs font-bold text-red-700">This certificate has been revoked.</p>}</article>)}</div>:
      <div className="mt-7 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><Award className="mx-auto text-slate-400" size={36}/><p className="mt-3 font-bold">No teacher-verified certificates yet</p><p className="mt-1 text-sm text-slate-500">When your teacher issues an award, it will appear here.</p></div>}
  </main>;
}
