import SpaceExplorationCentre from "@/components/space-exploration-centre";
import { Orbit } from "lucide-react";

export default function SpaceExplorationPage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-800"><Orbit size={16}/> Astronomy discovery</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Explore the Solar System and beyond</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Discover the planets, compare gravity, explore Earth's orbit, investigate Moon phases and learn about space exploration missions.</p>
    </div>
    <SpaceExplorationCentre />
    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"><strong className="text-slate-800">Learning note:</strong> Diagrams and models are simplified and not to scale. Planetary values are rounded educational reference values; moon counts can change as new objects are confirmed.</div>
  </main>;
}
