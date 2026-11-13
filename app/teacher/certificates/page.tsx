import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { issueVerifiedCertificate, revokeVerifiedCertificate } from "../certificate-actions";

export default async function TeacherCertificatesPage({searchParams}:{searchParams:Promise<{error?:string;issued?:string;revoked?:string}>}) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
  if(!["teacher","admin"].includes(profile?.role||"")) redirect("/dashboard");

  const {data:classes}=await supabase.from("classes").select("id,name,subject,teacher_id").order("created_at",{ascending:false});
  const mine=(classes||[]).filter(c=>profile?.role==="admin"||c.teacher_id===user.id);
  const ids=mine.map(c=>c.id);
  const {data:members}=ids.length?await supabase.from("class_members").select("class_id,student_id").in("class_id",ids):{data:[]};
  const studentIds=[...new Set((members||[]).map(m=>m.student_id))];
  const {data:profiles}=studentIds.length?await supabase.from("profiles").select("id,full_name").in("id",studentIds):{data:[]};
  const {data:issued}=await supabase.from("verified_certificates").select("id,title,subject,awarded_at,student_id,class_id,certificate_ref,revoked_at").eq("teacher_id",user.id).order("awarded_at",{ascending:false}).limit(100);
  const notices=await searchParams;
  const profileMap=new Map((profiles||[]).map(p=>[p.id,p.full_name||"Learner"]));
  const classMap=new Map(mine.map(c=>[c.id,c.name]));

  return <main className="container py-10 md:py-14">
    <Link href="/teacher" className="text-sm font-bold text-blue-700">← Teacher workspace</Link>
    <div className="mt-4 flex items-center gap-3"><div className="rounded-xl bg-amber-100 p-3 text-amber-800"><Award size={25}/></div><div><p className="text-sm font-bold uppercase tracking-wider text-amber-700">Teacher verified awards</p><h1 className="text-3xl font-black md:text-4xl">Issue learner certificates</h1></div></div>
    <p className="mt-3 max-w-2xl text-slate-600">Award a certificate to a learner enrolled in one of your classes. Issued records appear in that learner's verified certificate area.</p>
    {notices.error&&<p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{notices.error}</p>}
    {notices.issued&&<p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Verified certificate issued successfully.</p>}{notices.revoked&&<p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Certificate status updated.</p>}
    <section className="mt-7 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="card p-6">
        <h2 className="text-xl font-black">New verified certificate</h2>
        {mine.length&&studentIds.length?<form action={issueVerifiedCertificate} className="mt-5 space-y-4">
          <div><label className="mb-1 block text-sm font-bold" htmlFor="cert-class">Class</label><select className="field" name="class_id" id="cert-class" required>{mine.map(c=><option key={c.id} value={c.id}>{c.name} · {c.subject}</option>)}</select></div>
          <div><label className="mb-1 block text-sm font-bold" htmlFor="cert-student">Learner</label><select className="field" name="student_id" id="cert-student" required>{(members||[]).map(m=><option key={`${m.class_id}-${m.student_id}`} value={m.student_id}>{profileMap.get(m.student_id)||"Learner"} — {classMap.get(m.class_id)||"Class"}</option>)}</select><p className="mt-1 text-xs text-slate-500">If a learner belongs to more than one of your classes, choose the matching class and learner combination.</p></div>
          <div><label className="mb-1 block text-sm font-bold" htmlFor="cert-title">Achievement title</label><input className="field" id="cert-title" name="title" maxLength={120} required placeholder="e.g. Biology Foundations Award"/></div>
          <div><label className="mb-1 block text-sm font-bold" htmlFor="cert-note">Teacher comment (optional)</label><textarea className="field min-h-24" id="cert-note" name="note" maxLength={500} placeholder="A short note about the learner's achievement."/></div>
          <button className="btn btn-primary" type="submit">Issue verified certificate</button>
        </form>:<p className="mt-4 text-sm text-slate-600">You need a class with at least one enrolled learner before issuing a certificate.</p>}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-black">Recently issued</h2>
        {(issued||[]).length?<div className="mt-4 space-y-3">{issued!.map(c=><div key={c.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2 font-bold"><ShieldCheck className="text-emerald-700" size={18}/>{c.title}</div><p className="mt-1 text-sm text-slate-600">{profileMap.get(c.student_id)||"Learner"} · {classMap.get(c.class_id)||"Class"}</p><p className="mt-1 text-xs text-slate-500">{c.subject} · {new Date(c.awarded_at).toLocaleDateString()}</p><p className="mt-2 text-xs font-mono text-slate-600">Ref: {c.certificate_ref||"Apply V32 migration"}</p><p className={`mt-1 text-xs font-bold ${c.revoked_at?"text-red-700":"text-emerald-700"}`}>{c.revoked_at?"Revoked":"Active"}</p>{!c.revoked_at&&<form action={revokeVerifiedCertificate} className="mt-3 flex flex-wrap gap-2"><input type="hidden" name="certificate_id" value={c.id}/><input name="note" maxLength={500} placeholder="Reason (optional)" className="field min-w-0 flex-1 text-sm"/><button className="rounded-lg border border-red-300 px-3 py-2 text-xs font-bold text-red-700" type="submit">Revoke</button></form>}</div>)}</div>:<p className="mt-4 text-sm text-slate-500">No verified certificates issued yet.</p>}
      </div>
    </section>
    <p className="mt-6 text-xs text-slate-500">Teacher verification confirms that the issuing teacher awarded this record to an enrolled class member. It does not make the certificate an accredited external qualification.</p>
  </main>;
}
