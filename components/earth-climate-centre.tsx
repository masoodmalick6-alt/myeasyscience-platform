"use client";

import { useMemo, useState } from "react";

const layers = [
  { name: "Troposphere", height: "0–12 km", detail: "The lowest atmospheric layer. Most clouds, weather and the air we breathe are found here." },
  { name: "Stratosphere", height: "12–50 km", detail: "Contains the ozone layer, which absorbs much of the Sun's harmful ultraviolet radiation." },
  { name: "Mesosphere", height: "50–85 km", detail: "Many meteors burn up as they travel through this cold atmospheric layer." },
  { name: "Thermosphere", height: "85–600 km", detail: "Auroras occur here, and some spacecraft orbit within this very thin atmosphere." },
  { name: "Exosphere", height: "600 km and above", detail: "The extremely thin outer region gradually merges into space." }
];

const rockTypes = [
  { name: "Igneous", example: "Granite and basalt", formation: "Forms when molten rock (magma or lava) cools and solidifies.", clue: "Often has interlocking mineral crystals; cooling rate affects crystal size." },
  { name: "Sedimentary", example: "Sandstone and limestone", formation: "Forms as sediments are deposited, compacted and cemented, or by chemical/biological accumulation.", clue: "May show layers, grains or fossils." },
  { name: "Metamorphic", example: "Marble and slate", formation: "Forms when existing rock changes under heat, pressure or chemically active fluids without fully melting.", clue: "May show bands, aligned minerals or recrystallised textures." }
];

const weatherQuestions = [
  { q: "Which instrument measures air temperature?", opts: ["Barometer", "Thermometer", "Anemometer"], a: 1, why: "A thermometer measures temperature. A barometer measures air pressure and an anemometer measures wind speed." },
  { q: "What mainly causes wind near Earth's surface?", opts: ["Differences in air pressure", "Moonlight", "Ocean salinity"], a: 0, why: "Air moves from higher toward lower pressure, although Earth's rotation and friction also affect wind direction and speed." },
  { q: "Which cloud type is commonly associated with thunderstorms?", opts: ["Cirrus", "Cumulonimbus", "Stratus"], a: 1, why: "Cumulonimbus clouds can grow vertically and produce heavy rain, lightning, hail and strong winds." },
  { q: "What is the long-term average pattern of weather called?", opts: ["Climate", "Forecast", "Humidity"], a: 0, why: "Climate describes patterns and statistics of weather over long periods, commonly assessed over 30-year periods." }
];

export default function EarthClimateCentre() {
  const [temperature, setTemperature] = useState(18);
  const [co2, setCo2] = useState(420);
  const [albedo, setAlbedo] = useState(30);
  const [waterStep, setWaterStep] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [rock, setRock] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [marked, setMarked] = useState(false);
  const [score, setScore] = useState(0);

  const climateIndex = useMemo(() => {
    // Deliberately illustrative index: not a physical climate model.
    return Math.round((co2 - 280) / 8 + (temperature - 15) * 1.5 - (albedo - 30) * 0.7);
  }, [co2, temperature, albedo]);

  const cycle = [
    ["Evaporation", "Sunlight provides energy, causing liquid water at the surface to become water vapour."],
    ["Condensation", "Rising moist air cools. Water vapour condenses into tiny droplets or ice crystals, forming clouds."],
    ["Precipitation", "Cloud droplets or ice particles grow and fall as rain, snow, sleet or hail when conditions allow."],
    ["Collection & runoff", "Water collects in rivers, lakes and oceans. Some infiltrates soil and groundwater before returning to the sea."]
  ];
  const currentQuestion = weatherQuestions[qIndex];

  function nextQuestion() {
    if (answer === null || marked) return;
    const correct = answer === currentQuestion.a;
    if (correct) setScore(s => s + 1);
    setMarked(true);
  }
  function advanceQuestion() {
    setQIndex(i => (i + 1) % weatherQuestions.length);
    setAnswer(null);
    setMarked(false);
  }

  return <div className="space-y-8">
    <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-950 via-teal-950 to-sky-950 p-6 text-white md:p-8">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-200">Earth & climate science</p>
      <h2 className="mt-3 text-3xl font-black md:text-4xl">Understand our changing planet</h2>
      <p className="mt-3 max-w-2xl leading-7 text-emerald-50">Explore the atmosphere, weather, climate systems, the water cycle and the rocks beneath our feet through interactive learning models.</p>
    </section>

    <section className="space-y-4">
      <div><p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">01 · Atmosphere explorer</p><h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">Layers of the atmosphere</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Choose a layer to discover what happens at different heights above Earth.</p></div>
      <div className="grid gap-3 sm:grid-cols-5">
        {layers.map((l, i) => <button key={l.name} onClick={() => setSelectedLayer(i)} className={`rounded-xl border p-3 text-left ${selectedLayer === i ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200 dark:bg-emerald-950" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}><div className="text-xs text-slate-500 dark:text-slate-400">{l.height}</div><div className="mt-1 font-bold text-slate-900 dark:text-white">{l.name}</div></button>)}
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40"><h4 className="text-xl font-black text-slate-900 dark:text-white">{layers[selectedLayer].name}</h4><p className="mt-2 text-slate-700 dark:text-slate-300">{layers[selectedLayer].detail}</p></div>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">02 · Climate variables lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Explore factors in Earth's energy balance</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Adjust the values and observe how a teaching index responds.</p>
        <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Illustrative CO₂ level: {co2} ppm<input type="range" min="280" max="600" step="5" value={co2} onChange={e => setCo2(Number(e.target.value))} className="mt-2 w-full accent-emerald-600"/></label>
        <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Starting temperature setting: {temperature}°C<input type="range" min="-5" max="35" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="mt-2 w-full accent-emerald-600"/></label>
        <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Surface reflectivity (albedo): {albedo}%<input type="range" min="5" max="80" value={albedo} onChange={e => setAlbedo(Number(e.target.value))} className="mt-2 w-full accent-emerald-600"/></label>
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/50"><div className="text-sm text-slate-600 dark:text-slate-300">Illustrative response index</div><div className="text-3xl font-black text-emerald-800 dark:text-emerald-200">{climateIndex}</div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">A made-up classroom index to demonstrate changing inputs, not a temperature prediction or validated climate model.</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">03 · Water cycle journey</p>
        <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Follow water around the planet</h3>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {cycle.map((c, i) => <button key={c[0]} onClick={() => setWaterStep(i)} className={`rounded-xl border p-2 text-xs font-bold ${waterStep === i ? "border-sky-600 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>{i + 1}. {c[0]}</button>)}
        </div>
        <div className="mt-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-100 to-blue-200 text-6xl dark:from-sky-950 dark:to-blue-900">{["☀️","☁️","🌧️","🌊"][waterStep]}</div>
        <h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{cycle[waterStep][0]}</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{cycle[waterStep][1]}</p>
        <div className="mt-4 flex gap-2"><button onClick={() => setWaterStep(s => (s + 3) % 4)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Previous</button><button onClick={() => setWaterStep(s => (s + 1) % 4)} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Next stage</button></div>
      </div>
    </section>

    <section className="space-y-4">
      <div><p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">04 · Rocks and geology</p><h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">The three main rock groups</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Select a rock type to explore how it forms and the clues geologists look for.</p></div>
      <div className="grid gap-3 sm:grid-cols-3">{rockTypes.map((r, i) => <button key={r.name} onClick={() => setRock(i)} className={`rounded-2xl border p-4 text-left ${rock === i ? "border-amber-600 bg-amber-50 ring-2 ring-amber-200 dark:bg-amber-950" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}><div className="text-3xl">{["🌋","🪨","⛰️"][i]}</div><div className="mt-2 font-black text-slate-900 dark:text-white">{r.name}</div><div className="text-sm text-slate-500 dark:text-slate-400">{r.example}</div></button>)}</div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40"><h4 className="text-xl font-black text-slate-900 dark:text-white">{rockTypes[rock].name} rocks</h4><p className="mt-2 text-slate-700 dark:text-slate-300">{rockTypes[rock].formation}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Typical clue:</strong> {rockTypes[rock].clue}</p></div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">05 · Weather knowledge check</p><h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Test your understanding</h3></div><div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Score: {score}</div></div>
      <p className="mt-4 font-semibold text-slate-900 dark:text-white">{currentQuestion.q}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">{currentQuestion.opts.map((opt, i) => <button key={opt} disabled={marked} onClick={() => setAnswer(i)} className={`rounded-xl border p-3 text-left text-sm ${answer === i ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950" : "border-slate-200 dark:border-slate-700"} disabled:opacity-80`}>{opt}</button>)}</div>
      {marked && <p className={`mt-3 rounded-xl p-3 text-sm ${answer === currentQuestion.a ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{answer === currentQuestion.a ? "Correct! " : "Not quite. "}{currentQuestion.why}</p>}
      <div className="mt-4 flex flex-wrap gap-2">{!marked ? <button onClick={nextQuestion} disabled={answer === null} className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-40">Check answer</button> : <button onClick={advanceQuestion} className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white">Next question</button>}<button onClick={() => {setQIndex(0);setAnswer(null);setMarked(false);setScore(0);}} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Reset quiz</button></div>
    </section>
    <p className="text-xs text-slate-500 dark:text-slate-400">Learning note: Earth systems are complex and interconnected. The climate slider is deliberately illustrative, not a forecast. Weather and climate patterns are assessed using observations and scientific models, not this activity.</p>
  </div>;
}
