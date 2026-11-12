import Link from "next/link";
import { Atom, BookOpen, FlaskConical, GraduationCap, Microscope, Orbit, Sparkles } from "lucide-react";

const subjects = [
  { name: "Chemistry", desc: "Atoms, reactions, the periodic table and more.", icon: Atom, color: "bg-blue-50 text-blue-700" },
  { name: "Biology", desc: "Discover cells, ecosystems and the human body.", icon: Microscope, color: "bg-emerald-50 text-emerald-700" },
  { name: "Physics", desc: "Explore forces, energy, light and the universe.", icon: Orbit, color: "bg-violet-50 text-violet-700" },
  { name: "Mathematics", desc: "Build confidence with numbers and problem solving.", icon: BookOpen, color: "bg-amber-50 text-amber-700" }
];

export default function Home() {
  return <main>
    <section className="container grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center py-16 md:py-24">
      <div><div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 px-4 py-2 text-sm font-bold mb-6"><Sparkles size={16}/> Science learning made approachable</div>
        <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">Curiosity is the start of <span className="text-blue-700">discovery.</span></h1>
        <p className="text-lg text-slate-600 mt-6 max-w-xl leading-8">Learn science at your own pace with clear lessons, interactive quizzes and a learning path that grows with you.</p>
        <div className="flex flex-wrap gap-3 mt-8"><Link className="btn btn-primary" href="/signup">Start learning free <GraduationCap size={18}/></Link><Link className="btn btn-secondary" href="/courses">Explore courses</Link><Link className="btn btn-secondary" href="/labs">Try virtual labs</Link></div>
        <p className="text-sm muted mt-5">Free learning to get started · Optional premium membership</p>
      </div>
      <div className="card bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-8 md:p-10 min-h-[330px] flex flex-col justify-between overflow-hidden relative">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full border-[30px] border-white/10"/><div className="absolute right-10 bottom-8"><Atom size={150} strokeWidth={.8} className="text-white/25"/></div>
        <div className="relative"><div className="text-sm uppercase tracking-[.2em] text-blue-100 font-bold">Your science journey</div><h2 className="text-3xl font-black mt-4 max-w-sm">Understand the world, one idea at a time.</h2></div>
        <div className="relative flex gap-3 items-center"><div className="rounded-xl bg-white/15 p-3"><FlaskConical size={28}/></div><div><div className="font-bold">Learn · Practise · Grow</div><div className="text-blue-100 text-sm">A little progress adds up.</div></div></div>
      </div>
    </section>
    <section id="subjects" className="bg-white py-16"><div className="container"><div className="flex flex-wrap justify-between items-end gap-4 mb-8"><div><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Explore subjects</p><h2 className="text-3xl font-black mt-2">What would you like to learn?</h2></div><Link href="/courses" className="font-bold text-blue-700">View all courses →</Link></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{subjects.map(s => <div className="card p-6" key={s.name}><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}><s.icon size={25}/></div><h3 className="font-extrabold text-xl mt-5">{s.name}</h3><p className="text-slate-600 text-sm leading-6 mt-2">{s.desc}</p><Link className="inline-block text-blue-700 font-bold text-sm mt-5" href={s.name === "Biology" ? "/biology-lab" : s.name === "Physics" ? "/physics-lab" : "/courses"}>Explore {s.name} →</Link></div>)}</div>
    </div></section>
    <section className="container py-16 grid md:grid-cols-3 gap-5"><div className="md:col-span-3 mb-2"><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">How it works</p><h2 className="text-3xl font-black mt-2">A learning space built around you</h2></div>
      {[["01","Learn in clear steps","Short, focused lessons help make complex topics easier to understand."],["02","Check your understanding","Try quizzes and get instant feedback as you practise."],["03","See your progress","Your dashboard keeps track of completed learning and quiz results."]].map(x=><div className="card p-6" key={x[0]}><div className="text-blue-700 font-black text-3xl">{x[0]}</div><h3 className="font-extrabold text-lg mt-4">{x[1]}</h3><p className="text-slate-600 text-sm leading-6 mt-2">{x[2]}</p></div>)}
    </section>
    <section className="container py-12">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Chemistry explorer</p><h2 className="text-2xl md:text-3xl font-black mt-2">Discover all 118 elements</h2><p className="text-slate-600 mt-2 max-w-2xl">Explore the interactive periodic table, search element facts and learn how the families are organised.</p></div>
        <Link href="/periodic-table" className="btn btn-primary shrink-0">Explore periodic table →</Link>
      </div>
    </section>
    <section className="container py-8">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Physics discovery lab</p><h2 className="text-2xl md:text-3xl font-black mt-2">Experiment with motion, forces, energy and circuits</h2><p className="text-slate-600 mt-2 max-w-2xl">Change variables in interactive physics models and explore how the equations work.</p></div>
        <Link href="/physics-lab" className="btn btn-primary shrink-0">Explore physics lab →</Link>
      </div>
    </section>
    <section className="container py-14">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-7"><div><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Hands-on discovery</p><h2 className="text-3xl font-black mt-2">Step inside the virtual labs</h2><p className="text-slate-600 mt-2">Experiment, explore and learn through interactive simulations.</p></div><Link href="/labs" className="font-bold text-blue-700">Explore all labs →</Link></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[["Chemistry","Mix virtual samples and explore pH.","/labs/chemistry"],["Physics","Investigate pendulum motion.","/labs/physics"],["Biology","Discover the parts of a plant cell.","/labs/biology"],["Mathematics","Build shapes and calculate measurements.","/labs/mathematics"]].map(([name,desc,href])=><Link href={href} key={name} className="card p-5 hover:-translate-y-1 transition-transform"><div className="font-extrabold">{name} Lab</div><p className="text-sm text-slate-600 mt-2 leading-6">{desc}</p><span className="inline-block text-sm font-bold text-blue-700 mt-4">Start experiment →</span></Link>)}
      </div>
    </section>
    <section id="membership" className="bg-blue-50 py-16"><div className="container grid md:grid-cols-[1fr_auto] gap-8 items-center"><div><p className="text-blue-700 font-bold text-sm uppercase tracking-wider">Learning for everyone</p><h2 className="text-3xl font-black mt-2">Start free. Go further when you're ready.</h2><p className="text-slate-600 mt-3 max-w-2xl leading-7">Core learning can be available to everyone. Premium membership can unlock extended course collections, deeper practice and additional learning resources.</p></div><Link href="/signup" className="btn btn-primary">Create your free account</Link></div></section>
    <footer className="container py-8 text-sm text-slate-500 flex flex-wrap justify-between gap-3"><span>© {new Date().getFullYear()} MyEasyScience</span><span>Learn with curiosity. Grow with confidence.</span></footer>
    <section className="container pb-10">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div><p className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Chemistry practice tool</p><h2 className="text-2xl md:text-3xl font-black mt-2">Balance chemical equations</h2><p className="text-slate-600 mt-2 max-w-2xl">Try reactions, calculate whole-number coefficients and check that every atom is conserved.</p></div>
        <Link href="/equation-balancer" className="btn btn-primary shrink-0">Try equation balancer →</Link>
      </div>
    </section>
    <section className="container pb-10">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div><p className="text-amber-700 font-bold text-sm uppercase tracking-wider">New · Science Arcade</p><h2 className="text-2xl md:text-3xl font-black mt-2">Learn through games and challenges</h2><p className="text-slate-600 mt-2 max-w-2xl">Play element detective, solve chemistry equations, match cell structures, tackle physics puzzles and race the 60-second mixed-subject challenge.</p></div>
        <Link href="/arcade" className="btn btn-primary shrink-0">Play science games →</Link>
      </div>
    </section>
    <section className="container pb-10">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div><p className="text-violet-700 font-bold text-sm uppercase tracking-wider">Chemistry practice centre</p><h2 className="text-2xl md:text-3xl font-black mt-2">Check what you know</h2><p className="text-slate-600 mt-2 max-w-2xl">Practise elements, formulas and chemical reactions with instant feedback and answer explanations.</p></div>
        <Link href="/chemistry-practice" className="btn btn-primary shrink-0">Start chemistry practice →</Link>
      </div>
    </section>
  
    <section className="container py-10">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-emerald-200">
        <div><p className="text-emerald-700 font-bold text-sm uppercase tracking-wider">New biology discovery zone</p><h2 className="text-2xl md:text-3xl font-black mt-2">Explore cells, DNA and the human body</h2><p className="text-slate-600 mt-2 max-w-2xl">Try interactive biology activities: inspect a plant cell, pair DNA bases, build a food chain and match organs to body systems.</p></div>
        <Link className="btn btn-primary shrink-0" href="/biology-lab">Open Biology Lab →</Link>
      </div>
    </section>
</main>;
}
