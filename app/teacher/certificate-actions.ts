"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function issueVerifiedCertificate(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!["teacher", "admin"].includes(profile?.role || "")) redirect("/dashboard");

  const classId = String(formData.get("class_id") || "");
  const studentId = String(formData.get("student_id") || "");
  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const note = String(formData.get("note") || "").trim().slice(0, 500);

  if (!classId || !studentId || !title) redirect("/teacher/certificates?error=Complete+all+required+fields");

  const { data: classroom } = await supabase.from("classes").select("id,name,subject,teacher_id").eq("id", classId).maybeSingle();
  if (!classroom || !profile || (profile.role !== "admin" && classroom.teacher_id !== user.id)) {
    redirect("/teacher/certificates?error=You+can+only+award+certificates+to+learners+in+your+own+classes");
  }
  const { data: member } = await supabase.from("class_members").select("id").eq("class_id", classId).eq("student_id", studentId).maybeSingle();
  if (!member) redirect("/teacher/certificates?error=That+learner+is+not+a+member+of+the+selected+class");

  const { error } = await supabase.from("verified_certificates").insert({
    student_id: studentId,
    class_id: classId,
    teacher_id: user.id,
    title,
    subject: classroom.subject,
    teacher_note: note || null
  });
  if (error) redirect("/teacher/certificates?error=Could+not+issue+certificate.+Apply+the+V31+database+migration+and+try+again");
  redirect("/teacher/certificates?issued=1");
}


export async function revokeVerifiedCertificate(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!["teacher", "admin"].includes(profile?.role || "")) redirect("/dashboard");
  const certificateId = String(formData.get("certificate_id") || "");
  const note = String(formData.get("note") || "").trim().slice(0, 500);
  if (!certificateId) redirect("/teacher/certificates?error=Missing+certificate+reference");
  const { data: certificate } = await supabase.from("verified_certificates").select("id,teacher_id,revoked_at").eq("id", certificateId).maybeSingle();
  if (!certificate || (profile?.role !== "admin" && certificate.teacher_id !== user.id)) redirect("/teacher/certificates?error=You+cannot+revoke+this+certificate");
  if (certificate.revoked_at) redirect("/teacher/certificates?revoked=already");
  const { error } = await supabase.from("verified_certificates").update({ revoked_at: new Date().toISOString(), revocation_note: note || "Revoked by issuing teacher." }).eq("id", certificateId);
  if (error) redirect("/teacher/certificates?error=Could+not+revoke+certificate.+Apply+the+V32+migration");
  redirect("/teacher/certificates?revoked=1");
}
