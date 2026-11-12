import Link from "next/link";
import { courses as starterCourses } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/server";

export default async function Courses() {
  let authored: any[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.from("courses").select("id,title,subject,level,description,lessons").eq("published",true);
    authored = data || [];
  }
  const courses = [...starterCourses, ...authored];
  return <main className="container py-12"><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Course library</p><h1 className="text-4xl font-black mt-2">Explore science and maths</h1><p className="text-slate-600 mt-3 max-w-2xl">Start with the foundations, build understanding and learn at your own pace.</p><div className="grid md:grid-cols-2 gap-5 mt-9">{courses.map(c=><article key={c.id} className="card p-6"><div className="flex justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-blue-700">{c.subject}</span><span className="text-xs rounded-full bg-slate-100 px-3 py-1">{c.level}</span></div><h2 className="text-xl font-black mt-4">{c.title}</h2><p className="text-sm text-slate-600 mt-2 leading-6">{c.description}</p><div className="text-sm text-slate-500 mt-4">{c.lessons.length} lessons</div><Link href={`/courses/${c.id}`} className="btn btn-secondary mt-5">Open course →</Link></article>)}</div></main>;
}
