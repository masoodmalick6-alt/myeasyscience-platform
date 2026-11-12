"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function joinClass(formData: FormData) {
  const { supabase } = await requireUser();
  const code = String(formData.get("invite_code") || "").trim().toUpperCase();
  if (!/^[A-F0-9]{8}$/.test(code)) redirect("/classroom?error=Enter+the+8-character+class+code");
  const { data, error } = await supabase.rpc("join_class_by_code", { p_invite_code: code });
  if (error || !data) redirect("/classroom?error=That+class+code+was+not+found+or+could+not+be+joined");
  redirect("/classroom?joined=1");
}

export async function completeAssignment(formData: FormData) {
  const { supabase, user } = await requireUser();
  const assignmentId = String(formData.get("assignment_id") || "");
  if (!assignmentId) redirect("/classroom?error=Assignment+not+found");
  const { error } = await supabase.from("assignment_submissions").upsert({
    assignment_id: assignmentId, student_id: user.id, status: "completed", submitted_at: new Date().toISOString()
  }, { onConflict: "assignment_id,student_id" });
  if (error) redirect("/classroom?error=Could+not+mark+this+assignment+complete");
  redirect("/classroom?completed=1");
}
