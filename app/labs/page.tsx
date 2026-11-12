import Link from "next/link";
import { Atom, Microscope, Orbit, Calculator, ArrowRight, FlaskConical } from "lucide-react";

const labs = [
  { slug: "chemistry", title: "Chemistry Lab", tag: "Mix & observe", desc: "Explore the pH scale with a safe virtual indicator experiment.", icon: Atom, tint: "bg-blue-50 text-blue-700", level: "Beginner" },
  { slug: "physics", title: "Physics Lab", tag: "Move & measure", desc: "Change a pendulum's length and see how its motion changes.", icon: Orbit, tint: "bg-violet-50 text-violet-700", level: "Beginner" },
  { slug: "biology", title: "Biology Lab", tag: "Zoom & discover", desc: "Explore a plant cell and reveal the jobs of its organelles.", icon: Microscope, tint: "bg-emerald-50 text-emerald-700", level: "Beginner" },
  { slug: "mathematics", title: "Mathematics Lab", tag: "Build & calculate", desc: "Change a rectangle's dimensions and investigate area and perimeter.", icon: Calculator, tint: "bg-amber-50 text-amber-700", level: "Beginner" }
];

export default function LabsPage() {
  return <main className="container py-12 md:py-16">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-bold"><FlaskConical size={16}/> Virtual Science Labs</div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5">Learn by experimenting.</h1>
      <p className="text-slate-600 text-lg leading-8 mt-4">Explore interactive, browser-based experiments. Change variables, observe what happens and build your understanding—one experiment at a time.</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-5 mt-10">
      {labs.map(lab => <Link href={`/labs/${lab.slug}`} key={lab.slug} className="card p-6 md:p-7 group hover:-translate-y-1 transition-transform">
        <div className="flex items-start justify-between gap-4"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${lab.tint}`}><lab.icon size={28}/></div><span className="text-xs font-bold rounded-full bg-slate-100 text-slate-600 px-3 py-1">{lab.level}</span></div>
        <p className="text-xs uppercase tracking-wider font-bold text-blue-700 mt-6">{lab.tag}</p>
        <h2 className="text-2xl font-black mt-2">{lab.title}</h2>
        <p className="text-slate-600 leading-7 mt-2 min-h-14">{lab.desc}</p>
        <div className="text-blue-700 font-bold text-sm mt-5 inline-flex items-center gap-2">Open lab <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></div>
      </Link>)}
    </div>
    <div className="rounded-2xl bg-slate-100 p-5 md:p-6 mt-8 text-sm text-slate-600 leading-6"><strong className="text-slate-800">Learning safely:</strong> These are educational simulations, not instructions for real-world experiments. No physical chemicals, equipment or specimens are used.</div>
  </main>;
}
