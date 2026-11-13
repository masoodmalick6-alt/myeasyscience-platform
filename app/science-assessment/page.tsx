import ScienceAssessmentCentre from "@/components/science-assessment-centre";
import { ClipboardCheck } from "lucide-react";

export default function ScienceAssessmentPage() {
  return <main className="container py-10 md:py-14">
    <div className="mb-8 max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800"><ClipboardCheck size={16}/> Science assessment</div>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">One place to test everything you've learned</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Create mixed-subject or focused practice papers, choose your difficulty, work against the clock and review your results.</p>
    </div>
    <ScienceAssessmentCentre />
  </main>;
}
