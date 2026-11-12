import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpen, Flame, GraduationCap, Star, Target, Trophy, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { courses as starterCourses } from "@/lib/course-data";
import { ScienceChallenge, PrintCertificate } from "@/components/science-challenge";

export default async function RewardsPage() {
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{data:profile},{data:progress},{data:attempts},{data:dbCourses}] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id",user.id).maybeSingle(),
    supabase.from("lesson_progress").select("course_id,lesson_index,completed_at").eq("user_id",user.id),
    supabase.from("quiz_attempts").select("id,score,total,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100),
    supabase.from("courses").select("id,title,subject,level,lessons").eq("published",true)
  ]);
  const courseMap = new Map<string,any>();
  starterCourses.forEach(c=>courseMap.set(c.id,c));
  (dbCourses||[]).forEach(c=>courseMap.set(c.id,c));
  const done = new Map<string,Set<number>>();
  (progress||[]).forEach(p=>{if(!done.has(p.course_id))done.set(p.course_id,new Set());done.get(p.course_id)!.add(p.lesson_index);});
  const completedCourses = Array.from(courseMap.values()).filter(c=>Array.isArray(c.lessons)&&c.lessons.length>0&&(done.get(c.id)?.size||0)>=c.lessons.length);
  const lessonCount = (progress||[]).length;
  const quizCount = (attempts||[]).length;
  const total = (attempts||[]).reduce((s,a)=>s+(a.total||0),0);
  const correct = (attempts||[]).reduce((s,a)=>s+(a.score||0),0);
  const accuracy = total?Math.round(correct/total*100):0;
  const daySet = new Set((progress||[]).map(p=>new Date(p.completed_at).toISOString().slice(0,10)));
  (attempts||[]).forEach(a=>daySet.add(new Date(a.created_at).toISOString().slice(0,10)));
  let cursor=new Date(); cursor.setUTCHours(0,0,0,0);
  if(!daySet.has(cursor.toISOString().slice(0,10)))cursor.setUTCDate(cursor.getUTCDate()-1);
  let streak=0; while(daySet.has(cursor.toISOString().slice(0,10))&&streak<3650){streak++;cursor.setUTCDate(cursor.getUTCDate()-1);}
  const badges=[
    {name:"First Lesson",desc:"Complete your first lesson",earned:lessonCount>=1,icon:BookOpen},
    {name:"Curious Mind",desc:"Complete 5 lessons",earned:lessonCount>=5,icon:Star},
    {name:"Dedicated Learner",desc:"Complete 20 lessons",earned:lessonCount>=20,icon:GraduationCap},
    {name:"Quiz Explorer",desc:"Finish your first saved quiz",earned:quizCount>=1,icon:Target},
    {name:"Quiz Pro",desc:"Reach 80% average quiz accuracy",earned:quizCount>=3&&accuracy>=80,icon:Zap},
    {name:"Three-day Spark",desc:"Learn on 3 consecutive days",earned:streak>=3,icon:Flame},
    {name:"Week Warrior",desc:"Maintain a 7-day activity streak",earned:streak>=7,icon:Trophy},
    {name:"Course Graduate",desc:"Complete a full course",earned:completedCourses.length>=1,icon:Award}
  ];
  const learnerName=profile?.full_name||user.user_metadata?.full_name||"Learner";
  return <main className="container py-10 md:py-14">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-700"><Trophy size={17}/> Rewards and achievements</div><h1 className="text-4xl font-black mt-2">Learn, play and celebrate</h1><p className="text-slate-600 mt-2">Earn learning badges, challenge yourself and print course certificates.</p></div><Link href="/progress" className="btn btn-secondary">View full progress</Link></div>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card p-5"><BookOpen className="text-blue-700"/><div className="text-3xl font-black mt-3">{lessonCount}</div><p className="text-xs text-slate-500">Lessons completed</p></div>
      <div className="card p-5"><Target className="text-violet-700"/><div className="text-3xl font-black mt-3">{quizCount}</div><p className="text-xs text-slate-500">Saved quiz attempts</p></div>
      <div className="card p-5"><Flame className="text-orange-600"/><div className="text-3xl font-black mt-3">{streak}</div><p className="text-xs text-slate-500">Day activity streak</p></div>
      <div className="card p-5"><Award className="text-amber-600"/><div className="text-3xl font-black mt-3">{badges.filter(b=>b.earned).length}/{badges.length}</div><p className="text-xs text-slate-500">Badges unlocked</p></div>
    </section>
    <section className="card p-6 mt-7"><h2 className="text-2xl font-black">Your achievement badges</h2><p className="text-sm text-slate-500 mt-1">Badges unlock automatically from the learning activity saved to your account.</p><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">{badges.map(b=><div key={b.name} className={`rounded-xl border p-4 ${b.earned?"border-amber-200 bg-amber-50":"border-slate-100 bg-slate-50 opacity-65"}`}><div className={`rounded-xl p-3 w-fit ${b.earned?"bg-white text-amber-700":"bg-slate-200 text-slate-500"}`}><b.icon size={22}/></div><div className="font-black mt-3">{b.name}</div><p className="text-xs text-slate-600 mt-1">{b.desc}</p><div className={`text-[10px] font-bold uppercase tracking-wider mt-3 ${b.earned?"text-amber-800":"text-slate-500"}`}>{b.earned?"Unlocked":"Locked"}</div></div>)}</div></section>
    <section className="mt-7"><ScienceChallenge/></section>
    <section className="card p-6 mt-7"><div className="flex items-center gap-2"><Award className="text-amber-600"/><h2 className="text-2xl font-black">Course certificates</h2></div><p className="text-sm text-slate-500 mt-1">Complete every lesson in a course to unlock its printable certificate.</p>
      {completedCourses.length?<div className="grid md:grid-cols-2 gap-4 mt-5">{completedCourses.map(c=><div key={c.id} className="rounded-2xl border-2 border-amber-200 p-5"><div className="text-xs font-bold uppercase tracking-wider text-amber-700">Certificate unlocked</div><h3 className="text-xl font-black mt-2">{c.title}</h3><p className="text-sm text-slate-500 mt-1">{c.subject} · {c.level}</p><div className="mt-4 border-4 border-double border-amber-300 rounded-xl p-5 text-center certificate-print"><div className="text-xs uppercase tracking-[.2em] text-amber-700 font-bold">MyEasyScience</div><div className="text-2xl font-serif font-bold mt-3">Certificate of Completion</div><p className="text-xs text-slate-500 mt-3">This certifies that</p><div className="text-xl font-bold mt-1">{learnerName}</div><p className="text-xs text-slate-500 mt-2">has completed</p><div className="font-bold mt-1">{c.title}</div><div className="text-xs text-slate-500 mt-4">Awarded {new Date().toLocaleDateString()}</div></div><div className="mt-4"><PrintCertificate courseTitle={c.title} learnerName={learnerName}/></div></div>)}</div>:<div className="rounded-xl bg-slate-50 p-5 mt-5"><p className="font-bold">No certificates unlocked yet.</p><p className="text-sm text-slate-500 mt-1">Finish all lessons in any course and your certificate will appear here.</p><Link href="/courses" className="btn btn-primary mt-4">Explore courses</Link></div>}
    </section>
    <p className="text-xs text-slate-400 mt-5">Badge and certificate eligibility is calculated from the lesson and quiz records available to your account. Challenge scores are browser-only and are not saved. Certificates are printable completion acknowledgements, not accredited qualifications.</p>
  </main>;
}
