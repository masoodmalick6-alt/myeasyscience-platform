import { BiologyExplorer } from "@/components/biology-explorer";
import { BiologyAdvanced } from "@/components/biology-advanced";
import { BiologyExpansion } from "@/components/biology-expansion";
import { GeneticsEvolutionCentre } from "@/components/genetics-evolution-centre";
import { MicrobiologyLab } from "@/components/microbiology-lab";
import { EcologyEcosystemsLab } from "@/components/ecology-ecosystems-lab";
import { EvolutionSurvivalGame } from "@/components/evolution-survival-game";
import { HumanBiologyChallengeCentre } from "@/components/human-biology-challenge";
import { Microscope, Sprout } from "lucide-react";

export default function BiologyLabPage() {
  return <main className="container py-10 md:py-14">
    <div className="max-w-3xl mb-8"><div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-bold"><Sprout size={16}/> Biology discovery zone</div><h1 className="text-4xl md:text-5xl font-black mt-4">Explore biology by doing</h1><p className="text-slate-600 text-lg leading-8 mt-4">Investigate cells, genetics, anatomy, ecosystems, microorganisms and environmental change through interactive models.</p></div>
    <BiologyExplorer />
    <BiologyAdvanced />
    <BiologyExpansion />
    <GeneticsEvolutionCentre />
    <MicrobiologyLab />
    <EcologyEcosystemsLab />
    <EvolutionSurvivalGame />
    <HumanBiologyChallengeCentre />
    <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-600"><strong className="text-slate-800">Learning note:</strong> These are simplified educational models. Real cells and ecosystems are more complex; use the activities as a starting point for further study.</div>
  </main>;
}
