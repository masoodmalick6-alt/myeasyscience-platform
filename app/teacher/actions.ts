"use server";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireTeacher() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!["teacher", "admin"].includes(profile?.role || "")) redirect("/dashboard");
  return { supabase, user };
}

export async function createClass(formData: FormData) {
  const { supabase, user } = await requireTeacher();
  const name = String(formData.get("name") || "").trim().slice(0, 90);
  const subject = String(formData.get("subject") || "General Science").trim().slice(0, 60);
  const grade = String(formData.get("grade_level") || "").trim().slice(0, 40);
  if (!name) redirect("/teacher?error=Enter+a+class+name");
  const inviteCode = randomBytes(4).toString("hex").toUpperCase();
  const { error } = await supabase.from("classes").insert({
    teacher_id: user.id, name, subject, grade_level: grade || null, invite_code: inviteCode
  });
  if (error) redirect("/teacher?error=Could+not+create+class.+Apply+the+latest+database+schema+and+try+again");
  redirect("/teacher?created=1");
}

export async function createAssignment(formData: FormData) {
  const { supabase } = await requireTeacher();
  const classId = String(formData.get("class_id") || "");
  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const description = String(formData.get("description") || "").trim().slice(0, 1500);
  const due = String(formData.get("due_at") || "").trim();
  if (!classId || !title) redirect("/teacher?error=Choose+a+class+and+enter+an+assignment+title");
  const { error } = await supabase.from("assignments").insert({
    class_id: classId, title, description, due_at: due ? new Date(due).toISOString() : null
  });
  if (error) redirect("/teacher?error=Could+not+create+assignment.+Check+your+class+and+database+setup");
  redirect("/teacher?assigned=1");
}
