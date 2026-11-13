"use client";

import { useMemo, useState } from "react";

const quiz = [
  { q: "Solve: 3x + 5 = 20", options: ["x = 3", "x = 5", "x = 8", "x = 15"], answer: 1, why: "Subtract 5 from both sides: 3x = 15. Divide by 3, so x = 5." },
  { q: "What is 3/4 written as a decimal?", options: ["0.25", "0.5", "0.75", "1.25"], answer: 2, why: "3 ÷ 4 = 0.75." },
  { q: "What is the area of a rectangle 8 cm long and 3 cm wide?", options: ["11 cm²", "22 cm²", "24 cm²", "48 cm²"], answer: 2, why: "Area = length × width = 8 × 3 = 24 cm²." },
  { q: "What is the gradient of y = 4x − 2?", options: ["−2", "2", "4", "−4"], answer: 2, why: "In y = mx + c, m is the gradient. Here m = 4." },
  { q: "A triangle has angles 45° and 65°. What is the third angle?", options: ["60°", "70°", "80°", "90°"], answer: 1, why: "Angles in a triangle add to 180°. 180 − 45 − 65 = 70°." }
];

export default function MathematicsDiscoveryCentre() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(5);
  const [c, setC] = useState(20);
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);
  const [operation, setOperation] = useState("+");
  const [shape, setShape] = useState("Rectangle");
  const [length, setLength] = useState(8);
  const [width, setWidth] = useState(3);
  const [radius, setRadius] = useState(4);
  const [height, setHeight] = useState(5);
  const [gradient, setGradient] = useState(2);
  const [intercept, setIntercept] = useState(1);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const solution = a === 0 ? null : (c - b) / a;
  const fractionResult = useMemo(() => {
    const left = d1 === 0 ? null : n1 / d1;
    const right = d2 === 0 ? null : n2 / d2;
    if (left === null || right === null) return null;
    if (operation === "+") return left + right;
    if (operation === "−") return left - right;
    if (operation === "×") return left * right;
    return right === 0 ? null : left / right;
  }, [n1, d1, n2, d2, operation]);

  const geometry = useMemo(() => {
    if (shape === "Rectangle") return { value: length * width, formula: "Area = length × width", unit: "square units" };
    if (shape === "Triangle") return { value: length * height / 2, formula: "Area = ½ × base × height", unit: "square units" };
    return { value: Math.PI * radius * radius, formula: "Area = π × radius²", unit: "square units" };
  }, [shape, length, width, height, radius]);

  const points = useMemo(() => Array.from({ length: 13 }, (_, i) => {
    const x = i - 6;
    const y = gradient * x + intercept;
    return { x: 40 + i * 30, y: 150 - y * 8, label: x };
  }), [gradient, intercept]);
  const linePoints = points.map(p => `${p.x},${Math.max(8, Math.min(292, p.y))}`).join(" ");
  const current = quiz[question];

  function checkAnswer() {
    if (selected === null || checked) return;
    if (selected === current.answer) setScore(s => s + 1);
    setChecked(true);
  }
  function nextQuestion() {
    setQuestion(q => (q + 1) % quiz.length);
    setSelected(null);
    setChecked(false);
  }

  return <div className="space-y-8">
    <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-950 via-orange-950 to-rose-950 p-6 text-white md:p-8">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-amber-200">Mathematics discovery</p>
      <h2 className="mt-3 text-3xl font-black md:text-4xl">Make maths make sense</h2>
      <p className="mt-3 max-w-2xl leading-7 text-amber-50">Explore number skills, solve equations, calculate shapes, investigate straight-line graphs and practise with instant feedback.</p>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">01 · Algebra solver</p>
      <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Solve a linear equation</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Change the numbers in ax + b = c and calculate x.</p>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">a<input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="mt-1 block w-24 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/></label>
        <span className="pb-3 text-xl font-bold text-slate-700 dark:text-slate-200">x +</span>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">b<input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="mt-1 block w-24 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/></label>
        <span className="pb-3 text-xl font-bold text-slate-700 dark:text-slate-200">=</span>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">c<input type="number" value={c} onChange={e => setC(Number(e.target.value))} className="mt-1 block w-24 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/></label>
      </div>
      <div className="mt-5 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/50">
        {solution === null ? <p className="font-semibold text-amber-900 dark:text-amber-100">When a = 0, this equation cannot be solved by dividing by a. It may have no solution or infinitely many solutions.</p> : <><div className="text-sm text-slate-600 dark:text-slate-300">Solution</div><div className="text-3xl font-black text-amber-800 dark:text-amber-200">x = {Number.isInteger(solution) ? solution : solution.toFixed(3)}</div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Rearrange: ax = c − b, then divide both sides by a.</p></>}
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">02 · Fraction workshop</p>
        <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Calculate with fractions</h3>
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="grid grid-cols-2 gap-2"><label className="text-xs text-slate-500">Numerator<input type="number" value={n1} onChange={e => setN1(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-base dark:border-slate-700 dark:bg-slate-950"/></label><label className="text-xs text-slate-500">Denominator<input type="number" value={d1} onChange={e => setD1(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-base dark:border-slate-700 dark:bg-slate-950"/></label></div>
          <select aria-label="Fraction operation" value={operation} onChange={e => setOperation(e.target.value)} className="rounded-lg border border-slate-300 bg-white p-2 text-xl dark:border-slate-700 dark:bg-slate-950"><option>+</option><option>−</option><option>×</option><option>÷</option></select>
          <div className="grid grid-cols-2 gap-2"><label className="text-xs text-slate-500">Numerator<input type="number" value={n2} onChange={e => setN2(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-base dark:border-slate-700 dark:bg-slate-950"/></label><label className="text-xs text-slate-500">Denominator<input type="number" value={d2} onChange={e => setD2(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-base dark:border-slate-700 dark:bg-slate-950"/></label></div>
        </div>
        <div className="mt-5 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/50"><div className="text-sm text-slate-600 dark:text-slate-300">Decimal result</div><div className="text-3xl font-black text-amber-800 dark:text-amber-200">{fractionResult === null ? "Undefined" : Number(fractionResult.toFixed(6))}</div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">A zero denominator, or division by a zero fraction, is undefined.</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">03 · Geometry calculator</p>
        <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Find the area of a shape</h3>
        <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Shape<select value={shape} onChange={e => setShape(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"><option>Rectangle</option><option>Triangle</option><option>Circle</option></select></label>
        {shape !== "Circle" ? <div className="mt-3 grid grid-cols-2 gap-3"><label className="text-sm text-slate-600 dark:text-slate-300">{shape === "Triangle" ? "Base" : "Length"}<input type="number" min="0" value={length} onChange={e => setLength(Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/></label><label className="text-sm text-slate-600 dark:text-slate-300">{shape === "Triangle" ? "Height" : "Width"}<input type="number" min="0" value={shape === "Triangle" ? height : width} onChange={e => shape === "Triangle" ? setHeight(Math.max(0, Number(e.target.value))) : setWidth(Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/></label></div> : <label className="mt-3 block text-sm text-slate-600 dark:text-slate-300">Radius<input type="number" min="0" value={radius} onChange={e => setRadius(Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"/></label>}
        <div className="mt-5 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/50"><div className="text-sm text-slate-600 dark:text-slate-300">{geometry.formula}</div><div className="text-3xl font-black text-amber-800 dark:text-amber-200">{geometry.value.toFixed(2)}</div><div className="text-xs text-slate-500 dark:text-slate-400">{geometry.unit}</div></div>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">04 · Graph explorer</p>
      <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Explore y = mx + c</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Adjust the gradient and vertical intercept to see how the straight-line graph changes.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Gradient (m): {gradient}<input type="range" min="-4" max="4" step="1" value={gradient} onChange={e => setGradient(Number(e.target.value))} className="mt-2 w-full accent-amber-600"/></label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Intercept (c): {intercept}<input type="range" min="-5" max="5" step="1" value={intercept} onChange={e => setIntercept(Number(e.target.value))} className="mt-2 w-full accent-amber-600"/></label>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl bg-slate-50 p-2 dark:bg-slate-950">
        <svg viewBox="0 0 440 300" role="img" aria-label={`Graph of y equals ${gradient} x plus ${intercept}`} className="w-full">
          {Array.from({length:13},(_,i)=><g key={i}><line x1={40+i*30} y1="10" x2={40+i*30} y2="290" stroke="currentColor" opacity=".12"/><line x1="40" y1={10+i*23.33} x2="400" y2={10+i*23.33} stroke="currentColor" opacity=".12"/></g>)}
          <line x1="40" y1="150" x2="405" y2="150" stroke="currentColor" strokeWidth="1.5"/><line x1="220" y1="10" x2="220" y2="290" stroke="currentColor" strokeWidth="1.5"/>
          <polyline points={linePoints} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="410" y="145" fontSize="12" fill="currentColor">x</text><text x="228" y="18" fontSize="12" fill="currentColor">y</text>
        </svg>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Current equation: <strong>y = {gradient}x {intercept < 0 ? "−" : "+"} {Math.abs(intercept)}</strong>. The gradient describes steepness and direction; the intercept is where the line crosses the y-axis.</p>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">05 · Maths practice quiz</p><h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Check your understanding</h3></div><div className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-200">Score: {score}</div></div>
      <div className="mt-4 text-xs font-semibold text-slate-500">Question {question + 1} of {quiz.length}</div>
      <p className="mt-2 font-semibold text-slate-900 dark:text-white">{current.q}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{current.options.map((option,i)=><button key={option} disabled={checked} onClick={()=>setSelected(i)} className={`rounded-xl border p-3 text-left text-sm ${selected===i?"border-amber-600 bg-amber-50 dark:bg-amber-950":"border-slate-200 dark:border-slate-700"} disabled:opacity-80`}>{option}</button>)}</div>
      {checked && <p className={`mt-3 rounded-xl p-3 text-sm ${selected===current.answer?"bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100":"bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{selected===current.answer?"Correct! ":"Not quite. "}{current.why}</p>}
      <div className="mt-4 flex flex-wrap gap-2">{!checked?<button disabled={selected===null} onClick={checkAnswer} className="rounded-xl bg-amber-700 px-4 py-2 font-semibold text-white disabled:opacity-40">Check answer</button>:<button onClick={nextQuestion} className="rounded-xl bg-amber-700 px-4 py-2 font-semibold text-white">Next question</button>}<button onClick={()=>{setQuestion(0);setSelected(null);setChecked(false);setScore(0);}} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Reset quiz</button></div>
    </section>
    <p className="text-xs text-slate-500 dark:text-slate-400">Learning note: calculators use standard school-level formulas. Answers are rounded where shown; always include appropriate units in real problems.</p>
  </div>;
}
