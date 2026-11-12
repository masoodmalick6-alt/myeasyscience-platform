"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");
  return supabase;
}

export async function createCourse(formData: FormData) {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const level = String(formData.get("level") || "Beginner").trim();
  const description = String(formData.get("description") || "").trim();
  const lessonTitles = String(formData.get("lessonTitles") || "").split("\n").map(x=>x.trim()).filter(Boolean);
  const lessonBodies = String(formData.get("lessonBodies") || "").split("\n---\n").map(x=>x.trim()).filter(Boolean);
  if (!title || !subject || !description || !lessonTitles.length || lessonTitles.length !== lessonBodies.length) {
    redirect("/admin?error=Please%20complete%20all%20course%20fields%20and%20match%20lesson%20titles%20to%20lesson%20bodies");
  }
  const id = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const lessons = lessonTitles.map((lessonTitle, i)=>({title:lessonTitle,body:lessonBodies[i]}));
  const { error } = await supabase.from("courses").insert({id,title,subject,level,description,lessons,published:true});
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/courses"); revalidatePath(`/courses/${id}`);
  redirect("/admin?created=1");
}

export async function deleteCourse(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!/^[a-z0-9-]+$/.test(id)) redirect("/admin?error=Invalid%20course%20identifier");
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/courses");
  redirect("/admin?deleted=1");
}
