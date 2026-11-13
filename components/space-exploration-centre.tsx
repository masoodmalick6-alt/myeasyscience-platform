"use client";

import { useMemo, useState } from "react";

const planets = [
  { name: "Mercury", order: 1, distance: 0.39, year: 88, gravity: 3.7, moons: 0, fact: "The smallest planet and the closest to the Sun. Its surface experiences extreme temperature changes." },
  { name: "Venus", order: 2, distance: 0.72, year: 225, gravity: 8.87, moons: 0, fact: "A dense atmosphere traps heat, making Venus the hottest planet on average." },
  { name: "Earth", order: 3, distance: 1, year: 365.25, gravity: 9.81, moons: 1, fact: "Liquid water is stable at the surface, and life is known to exist here." },
  { name: "Mars", order: 4, distance: 1.52, year: 687, gravity: 3.71, moons: 2, fact: "Mars has a thin atmosphere, polar ice and evidence of ancient flowing water." },
  { name: "Jupiter", order: 5, distance: 5.2, year: 4333, gravity: 24.79, moons: 95, fact: "The largest planet is a gas giant with powerful storms, including the Great Red Spot." },
  { name: "Saturn", order: 6, distance: 9.58, year: 10759, gravity: 10.44, moons: 146, fact: "Saturn's spectacular rings are made mostly of countless pieces of ice and rock." },
  { name: "Uranus", order: 7, distance: 19.2, year: 30687, gravity: 8.69, moons: 28, fact: "Uranus rotates on its side relative to its orbit, giving it extreme seasons." },
  { name: "Neptune", order: 8, distance: 30.05, year: 60190, gravity: 11.15, moons: 16, fact: "Neptune is a distant ice giant with very fast winds." }
];

const moonPhases = [
  { name: "New Moon", illumination: 0, detail: "The side lit by the Sun mostly faces away from Earth, so the Moon is difficult to see." },
  { name: "Waxing Crescent", illumination: 25, detail: "A growing crescent of the Moon's sunlit half is visible from Earth." },
  { name: "First Quarter", illumination: 50, detail: "About half of the visible lunar disc is illuminated." },
  { name: "Waxing Gibbous", illumination: 75, detail: "More than half is illuminated, and the lit portion is still growing." },
  { name: "Full Moon", illumination: 100, detail: "The near side of the Moon is illuminated by the Sun." },
  { name: "Waning Gibbous", illumination: 75, detail: "The illuminated portion is shrinking after full Moon." },
  { name: "Last Quarter", illumination: 50, detail: "About half of the visible lunar disc is illuminated again, on the opposite side." },
  { name: "Waning Crescent", illumination: 25, detail: "A thin visible crescent remains before the next new Moon." }
];

export default function SpaceExplorationCentre() {
  const [selected, setSelected] = useState("Earth");
  const [mass, setMass] = useState(60);
  const [phase, setPhase] = useState(0);
  const [orbitPosition, setOrbitPosition] = useState(0);
  const [mission, setMission] = useState("Moon");
  const planet = planets.find(p => p.name === selected) ?? planets[2];
  const weight = useMemo(() => mass * planet.gravity, [mass, planet.gravity]);
  const phaseInfo = moonPhases[phase];
  const missionFacts: Record<string, string> = {
    Moon: "The Moon is Earth's natural satellite. Robotic missions and crewed lunar exploration help us study its geology and prepare for longer journeys.",
    Mars: "Mars missions use orbiters, landers and rovers to study rocks, climate and the possibility that microbial life could once have existed.",
    "Jupiter": "Missions to Jupiter investigate its atmosphere, magnetic environment and ocean-bearing icy moons such as Europa.",
    "Asteroids": "Asteroid missions help scientists study early Solar System material and understand how small bodies move through space."
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-6 text-white md:p-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-indigo-200">Astronomy & space exploration</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Your journey beyond Earth</h2>
            <p className="mt-3 max-w-2xl leading-7 text-indigo-100">Explore our planetary neighbours, investigate gravity, understand lunar phases and discover how robotic and human missions explore space.</p>
          </div>
          <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/5 text-7xl shadow-inner" aria-label="Planet illustration">🪐</div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">01 · Solar System explorer</p>
          <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">Meet the eight planets</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Select a planet to compare its orbit, year, gravity and natural satellites.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {planets.map((p, i) => (
            <button key={p.name} onClick={() => setSelected(p.name)} className={`rounded-2xl border p-4 text-left transition ${selected === p.name ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 dark:bg-indigo-950" : "border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900"}`}>
              <div className="mb-2 flex h-12 items-center justify-center text-3xl">{["☿","♀","🌍","🔴","🟠","🪐","🔵","🔷"][i]}</div>
              <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Planet {p.order}</div>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
          <h4 className="text-xl font-black text-slate-900 dark:text-white">{planet.name}</h4>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{planet.fact}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Average distance", `${planet.distance} AU`],["Orbital period", `${planet.year.toLocaleString()} days`],["Surface gravity", `${planet.gravity} m/s²`],["Known moons", String(planet.moons)]].map(([label, value]) => <div key={label} className="rounded-xl bg-white p-3 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">{label}</div><div className="mt-1 font-bold text-slate-900 dark:text-white">{value}</div></div>)}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">02 · Gravity laboratory</p>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">How much would you weigh?</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Change the example mass and planet to compare gravitational force (weight).</p>
          <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Example mass: {mass} kg
            <input className="mt-2 w-full accent-indigo-600" type="range" min="10" max="150" step="5" value={mass} onChange={e => setMass(Number(e.target.value))}/>
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Planet
            <select value={selected} onChange={e => setSelected(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
              {planets.map(p => <option key={p.name}>{p.name}</option>)}
            </select>
          </label>
          <div className="mt-5 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/50">
            <div className="text-sm text-slate-600 dark:text-slate-300">Calculated weight on {planet.name}</div>
            <div className="text-3xl font-black text-indigo-800 dark:text-indigo-200">{weight.toFixed(1)} N</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Weight = mass × gravitational field strength (W = mg).</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">03 · Orbit explorer</p>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Where is Earth in its orbit?</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Move the marker through a simplified circular orbit around the Sun.</p>
          <div className="relative mx-auto mt-5 flex aspect-square max-w-[280px] items-center justify-center rounded-full border border-dashed border-indigo-300 bg-slate-50 dark:bg-slate-950">
            <div className="absolute h-16 w-16 rounded-full bg-amber-400 shadow-[0_0_35px_rgba(251,191,36,.55)]"/>
            <div className="absolute h-[78%] w-[78%] rounded-full border border-indigo-300"/>
            <div className="absolute h-5 w-5 rounded-full bg-blue-600 shadow-lg transition-all" style={{ left: `${50 + 39 * Math.cos(orbitPosition * Math.PI / 180)}%`, top: `${50 + 39 * Math.sin(orbitPosition * Math.PI / 180)}%`, transform: "translate(-50%, -50%)" }}/>
            <span className="absolute bottom-3 text-xs font-semibold text-slate-500">Schematic · not to scale</span>
          </div>
          <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Orbit position: {orbitPosition}°
            <input type="range" min="0" max="359" value={orbitPosition} onChange={e => setOrbitPosition(Number(e.target.value))} className="mt-2 w-full accent-indigo-600"/>
          </label>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Earth's orbit is slightly elliptical. This circular diagram is a simplified teaching model.</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">04 · Moon phases</p>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Why does the Moon change shape?</h3>
          <div className="mt-5 flex items-center gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-300 shadow-inner">
              <div className="absolute inset-0 rounded-full bg-slate-700" />
              <div className="absolute inset-0 rounded-full bg-yellow-100" style={{ clipPath: `ellipse(${Math.max(0, phaseInfo.illumination / 2)}% 50% at 50% 50%)` }} />
            </div>
            <div><div className="text-lg font-bold text-slate-900 dark:text-white">{phaseInfo.name}</div><div className="text-sm text-slate-500 dark:text-slate-400">Approx. {phaseInfo.illumination}% visible illumination</div></div>
          </div>
          <input aria-label="Moon phase" type="range" min="0" max="7" value={phase} onChange={e => setPhase(Number(e.target.value))} className="mt-5 w-full accent-indigo-600"/>
          <div className="mt-2 flex justify-between text-xs text-slate-500"><span>New Moon</span><span>Full Moon</span><span>New Moon</span></div>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{phaseInfo.detail}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">The Moon does not make its own light; we see sunlight reflected from its surface.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">05 · Mission control</p>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Choose a space destination</h3>
          <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Mission target
            <select value={mission} onChange={e => setMission(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
              {Object.keys(missionFacts).map(m => <option key={m}>{m}</option>)}
            </select>
          </label>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="text-2xl">{mission === "Moon" ? "🌕" : mission === "Mars" ? "🔴" : mission === "Jupiter" ? "🟠" : "☄️"}</div>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{missionFacts[mission]}</p>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Mission summaries are introductory educational context, not live mission-status updates.</p>
        </div>
      </section>
    </div>
  );
}
