import { EquationBalancer } from "@/components/equation-balancer";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

export default function EquationBalancerPage() {
  return <main className="container py-10 md:py-14">
    <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/> Courses</Link>
    <div className="mt-6 mb-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 px-4 py-2 text-sm font-bold"><FlaskConical size={16}/> Chemistry learning tool</div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-4">Chemical Equation Balancer</h1>
      <p className="text-slate-600 text-lg leading-8 mt-3 max-w-3xl">Balance chemical reactions with an interactive tool. See the smallest whole-number coefficients, compare atom counts and understand why matter is conserved.</p>
    </div>
    <EquationBalancer/>
    <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600 leading-6"><b className="text-slate-900">Learning reminder:</b> Balancing changes the coefficients in front of formulas, never the subscripts inside a chemical formula. Changing a subscript changes the substance itself.</div>
  </main>;
}
