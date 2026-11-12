import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { ChemistryPractice } from "@/components/chemistry-practice";

export default function ChemistryPracticePage() {
  return <main className="container py-10 md:py-14">
    <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/> Courses</Link>
    <div className="mt-6 mb-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 text-violet-800 px-4 py-2 text-sm font-bold"><BrainCircuit size={16}/> Chemistry practice centre</div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-4">Test your chemistry knowledge</h1>
      <p className="text-slate-600 text-lg leading-8 mt-3 max-w-3xl">Build confidence with short practice questions about elements, chemical formulas and reactions. Get feedback, explanations and a chance to retry the questions you missed.</p>
    </div>
    <ChemistryPractice/>
  </main>;
}
