import { PhysicsDiscoveryLab } from "@/components/physics-discovery-lab";
import { PhysicsFrontiersLab } from "@/components/physics-frontiers-lab";
import { Orbit } from "lucide-react";
import PhysicsChallengeCentre from "@/components/physics-challenge-centre";

export default function PhysicsLabPage() {
  return <main className="container py-10 md:py-14">
    <div className="max-w-3xl mb-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-bold"><Orbit size={16}/> Physics discovery</div>
      <h1 className="text-4xl md:text-5xl font-black mt-4">Explore the rules of the physical world</h1>
      <p className="text-slate-600 text-lg leading-8 mt-4">Experiment with motion, forces, energy, waves, magnetism, heat, light and space. Change variables and see how the physics equations respond.</p>
    </div>
    <PhysicsDiscoveryLab />
    <PhysicsFrontiersLab />
    <div className="mt-12"><PhysicsChallengeCentre /></div>
    <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-600"><strong className="text-slate-800">Learning note:</strong> These are simplified teaching models. Real-world systems may include friction, measurement uncertainty, energy losses and more complex behaviour.</div>
  </main>;
}
