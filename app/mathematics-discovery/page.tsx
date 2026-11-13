import MathematicsDiscoveryCentre from "@/components/mathematics-discovery-centre";
import { Calculator } from "lucide-react";

export default function MathematicsDiscoveryPage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800"><Calculator size={16}/> Mathematics discovery</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Explore numbers, patterns and problem-solving</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Practise algebra, fractions, geometry and graphs with interactive tools, worked ideas and quick knowledge checks.</p>
    </div>
    <MathematicsDiscoveryCentre />
  </main>;
}
