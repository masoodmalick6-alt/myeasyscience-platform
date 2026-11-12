import { PeriodicTable } from "@/components/periodic-table";
import Link from "next/link";
import { ArrowLeft, Atom } from "lucide-react";

export default function PeriodicTablePage() {
  return <main className="container py-10 md:py-14">
    <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/> Courses</Link>
    <div className="mt-6 mb-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-bold"><Atom size={16}/> Chemistry learning tool</div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-4">Interactive Periodic Table</h1>
      <p className="text-slate-600 text-lg leading-8 mt-3 max-w-3xl">Explore all 118 known elements. Search by name, symbol or atomic number, filter by element family, and select an element to discover its key properties.</p>
    </div>
    <PeriodicTable/>
    <p className="text-xs text-slate-500 mt-6 leading-5">Educational reference: atomic masses are standard abridged values where available; bracketed values indicate the mass number of a commonly cited isotope for elements without a standard atomic weight. Element classifications and some superheavy-element properties may vary between references.</p>
  </main>;
}
