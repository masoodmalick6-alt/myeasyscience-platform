"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Lesson = { title: string; body: string };
export function LessonViewer({ courseId, lessons }: { courseId: string; lessons: Lesson[] }) {
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  async function complete() {
    setSaving(true); setNotice("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setNotice("Log in to save your lesson progress."); setSaving(false); return; }
    const { error } = await supabase.from("lesson_progress").upsert({ user_id: user.id, course_id: courseId, lesson_index: index, completed_at: new Date().toISOString() }, { onConflict: "user_id,course_id,lesson_index" });
    setNotice(error ? "We couldn't save your progress. Please try again." : "Lesson marked as complete — progress saved!");
    setSaving(false);
  }
  const lesson = lessons[index];
  return <div><div className="flex flex-wrap justify-between gap-3 text-sm font-bold text-slate-500"><span>Lesson {index + 1} of {lessons.length}</span><span>{Math.round((index + 1) / lessons.length * 100)}% through course</span></div><div className="h-2 bg-slate-100 rounded-full mt-3 mb-8"><div className="h-2 bg-blue-600 rounded-full" style={{width: `${((index + 1) / lessons.length) * 100}%`}}/></div><h2 className="text-2xl font-black">{lesson.title}</h2><p className="text-slate-700 leading-8 mt-5 text-lg">{lesson.body}</p><div className="flex flex-wrap gap-3 mt-8"><button onClick={complete} disabled={saving} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Mark lesson complete"}</button><button disabled={index === 0} onClick={() => {setIndex(index - 1); setNotice("");}} className="btn btn-secondary disabled:opacity-40">Previous</button><button disabled={index === lessons.length - 1} onClick={() => {setIndex(index + 1); setNotice("");}} className="btn btn-secondary disabled:opacity-40">Next lesson</button></div>{notice && <p className="text-sm text-emerald-700 mt-4">{notice}</p>}</div>;
}
