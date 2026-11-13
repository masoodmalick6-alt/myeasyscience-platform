import CodingDiscoveryCentre from "@/components/coding-discovery-centre";
import { Code2 } from "lucide-react";

export default function CodingDiscoveryPage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-800"><Code2 size={16}/> Computer science discovery</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Explore coding, logic and algorithms</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Learn programming fundamentals, practise computational thinking and discover how computers represent information.</p>
    </div>
    <CodingDiscoveryCentre />
  </main>;
}
