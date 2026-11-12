import Link from "next/link";
import { Atom, Dna, FlaskConical, Gauge, Trophy, Zap } from "lucide-react";
import { ScienceArcade } from "@/components/science-arcade";

export const metadata = {
  title: "Science Arcade | MyEasyScience",
  description: "Play interactive science and maths games, practise chemistry, biology and physics, and beat the clock."
};

export default function ArcadePage() {
  return <main className="container py-10 md:py-14">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-700"><Trophy size={17}/> MyEasyScience Arcade</div>
        <h1 className="text-4xl md:text-5xl font-black mt-2">Play your way to science success</h1>
        <p className="text-slate-600 mt-3 max-w-2xl">Explore quick games in Chemistry, Biology, Physics and Mathematics. Practise at your own pace or take on the one-minute mixed-subject challenge.</p>
      </div>
      <Link href="/rewards" className="btn btn-secondary">My badges and rewards</Link>
    </div>
    <div className="grid sm:grid-cols-3 gap-3 mb-7">
      <div className="rounded-2xl bg-blue-50 p-4 flex items-center gap-3"><Atom className="text-blue-700" size={25}/><div><div className="font-bold">Chemistry</div><div className="text-xs text-slate-500">Elements and equations</div></div></div>
      <div className="rounded-2xl bg-emerald-50 p-4 flex items-center gap-3"><Dna className="text-emerald-700" size={25}/><div><div className="font-bold">Biology</div><div className="text-xs text-slate-500">Cells and structures</div></div></div>
      <div className="rounded-2xl bg-amber-50 p-4 flex items-center gap-3"><Gauge className="text-amber-700" size={25}/><div><div className="font-bold">Physics and maths</div><div className="text-xs text-slate-500">Calculations and puzzles</div></div></div>
    </div>
    <ScienceArcade/>
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      <Link href="/periodic-table" className="card p-5 hover:border-blue-300"><Atom className="text-blue-700"/><div className="font-black mt-3">Explore the Periodic Table</div><p className="text-sm text-slate-500 mt-1">Look up all 118 elements and their properties.</p></Link>
      <Link href="/equation-balancer" className="card p-5 hover:border-blue-300"><FlaskConical className="text-violet-700"/><div className="font-black mt-3">Balance equations</div><p className="text-sm text-slate-500 mt-1">Practise balancing chemical reactions step by step.</p></Link>
      <Link href="/chemistry-practice" className="card p-5 hover:border-blue-300"><Zap className="text-amber-600"/><div className="font-black mt-3">Chemistry Practice Centre</div><p className="text-sm text-slate-500 mt-1">Try topic-based quizzes and review your answers.</p></Link>
    </div>
  </main>;
}
