import EarthClimateCentre from "@/components/earth-climate-centre";
import { CloudSun } from "lucide-react";

export default function EarthClimatePage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800"><CloudSun size={16}/> Earth science discovery</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Explore Earth, weather and climate</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Discover the atmosphere, understand weather systems, follow the water cycle and investigate the rocks that shape our planet.</p>
    </div>
    <EarthClimateCentre />
    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"><strong className="text-slate-800">Learning note:</strong> The interactive climate index is a simplified classroom illustration, not a scientific climate projection. Geological and atmospheric processes are more complex than these activities can represent.</div>
  </main>;
}
