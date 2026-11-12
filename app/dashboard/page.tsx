import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Trophy, UserRound, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { courses } from "@/lib/course-data";
import { Quiz } from "@/components/quiz";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: attempts }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("full_name, membership_tier").eq("id", user.id).maybeSingle(),
    supabase.from("quiz_attempts").select("id, quiz_title, score, total, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("lesson_progress").select("course_id, lesson_index").eq("user_id", user.id)
  ]);
  const name = profile?.full_name || user.user_metadata?.full_name || "Learner";
  return <main className="container py-10">
    <div className="flex flex-wrap justify-between items-end gap-4 mb-8"><div><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Student dashboard</p><h1 className="text-3xl md:text-4xl font-black mt-2">Welcome back, {name.split(" ")[0]}!</h1><p className="text-slate-600 mt-2">Keep your curiosity moving forward.</p></div><span className="rounded-full bg-emerald-50 text-emerald-800 px-4 py-2 text-sm font-bold capitalize">{profile?.membership_tier || "free"} member</span></div>
    <div className="flex justify-end mb-4"><Link href="/progress" className="btn btn-secondary"><TrendingUp size={16}/> View learning progress</Link></div><div className="grid sm:grid-cols-3 gap-4 mb-8"><div className="card p-5"><BookOpen className="text-blue-700"/><div className="text-3xl font-black mt-3">{progress?.length || 0}</div><div className="text-sm muted">Lessons completed</div></div><div className="card p-5"><Trophy className="text-amber-600"/><div className="text-3xl font-black mt-3">{attempts?.length || 0}</div><div className="text-sm muted">Recent quiz attempts</div></div><div className="card p-5"><UserRound className="text-emerald-700"/><div className="text-lg font-black mt-3">{profile?.membership_tier === "premium" ? "Premium" : "Free plan"}</div><div className="text-sm muted">Your membership</div></div></div>
    <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6"><section className="card p-6"><div className="flex justify-between items-center mb-5"><h2 className="font-black text-xl">Continue learning</h2><Link href="/courses" className="text-blue-700 text-sm font-bold">All courses →</Link></div><div className="space-y-3">{courses.map(c=><Link key={c.id} href={`/courses/${c.id}`} className="block border border-slate-100 rounded-xl p-4 hover:border-blue-200"><div className="text-xs text-blue-700 font-bold">{c.subject} · {c.level}</div><div className="font-bold mt-1">{c.title}</div><div className="text-sm text-slate-500 mt-1">{c.description}</div></Link>)}</div></section>
    <section className="card p-6"><h2 className="font-black text-xl mb-2">Quick science quiz</h2><p className="text-sm text-slate-500 mb-5">Test your understanding with three starter questions.</p><Quiz/><div className="border-t border-slate-100 mt-6 pt-5"><h3 className="font-bold">Recent results</h3>{attempts?.length ? <div className="mt-3 space-y-2">{attempts.map(a=><div key={a.id} className="flex justify-between text-sm"><span>{a.quiz_title}</span><b>{a.score}/{a.total}</b></div>)}</div> : <p className="text-sm text-slate-500 mt-2">Your saved quiz results will appear here.</p>}</div></section></div>
  </main>;
}
