import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Atom, Orbit, Microscope, Calculator } from "lucide-react";
import { LabSimulation } from "@/components/lab-simulation";

const labs: Record<string, { title: string; subtitle: string; icon: typeof Atom; accent: string; intro: string }> = {
  chemistry: { title: "Chemistry Lab", subtitle: "The pH indicator challenge", icon: Atom, accent: "text-blue-700 bg-blue-50", intro: "Explore how different everyday-example solutions sit on the pH scale. Choose a sample and watch the indicator colour change." },
  physics: { title: "Physics Lab", subtitle: "Pendulum motion", icon: Orbit, accent: "text-violet-700 bg-violet-50", intro: "Change the length of a simple pendulum and investigate how its period—the time for one complete swing—changes." },
  biology: { title: "Biology Lab", subtitle: "Inside a plant cell", icon: Microscope, accent: "text-emerald-700 bg-emerald-50", intro: "Explore a simplified plant cell. Select an organelle to discover its role in keeping the cell alive." },
  mathematics: { title: "Mathematics Lab", subtitle: "Shape builder", icon: Calculator, accent: "text-amber-700 bg-amber-50", intro: "Adjust the side lengths of a rectangle and compare its area with its perimeter." }
};

export function generateStaticParams() { return Object.keys(labs).map(subject => ({ subject })); }

export default async function LabPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const lab = labs[subject];
  if (!lab) notFound();
  const Icon = lab.icon;
  return <main className="container py-10 md:py-14">
    <Link href="/labs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/> All virtual labs</Link>
    <div className="flex items-start gap-4 mt-7">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${lab.accent}`}><Icon size={28}/></div>
      <div><p className="text-sm font-bold text-blue-700">{lab.subtitle}</p><h1 className="text-3xl md:text-4xl font-black mt-1">{lab.title}</h1><p className="text-slate-600 leading-7 mt-3 max-w-3xl">{lab.intro}</p></div>
    </div>
    <div className="mt-8"><LabSimulation subject={subject as "chemistry" | "physics" | "biology" | "mathematics"}/></div>
    <p className="text-xs text-slate-500 mt-6">Simulation for learning purposes. Results are simplified models and may not represent every real-world condition.</p>
  </main>;
}
