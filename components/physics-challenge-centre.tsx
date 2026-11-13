"use client";

import { useMemo, useState } from "react";

type Question = {
  topic: string;
  level: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    topic: "Motion",
    level: "Starter",
    prompt: "A cyclist travels 120 metres in 20 seconds. What is the average speed?",
    options: ["2 m/s", "6 m/s", "20 m/s", "140 m/s"],
    answer: 1,
    explanation: "Average speed = distance ÷ time = 120 m ÷ 20 s = 6 m/s."
  },
  {
    topic: "Forces",
    level: "Starter",
    prompt: "A net force of 18 N acts on a 3 kg object. What is its acceleration?",
    options: ["6 m/s²", "15 m/s²", "21 m/s²", "54 m/s²"],
    answer: 0,
    explanation: "Newton’s second law gives a = F ÷ m = 18 N ÷ 3 kg = 6 m/s²."
  },
  {
    topic: "Energy",
    level: "Core",
    prompt: "A 2 kg object is lifted 5 m. Using g = 10 N/kg, how much gravitational potential energy does it gain?",
    options: ["10 J", "25 J", "100 J", "250 J"],
    answer: 2,
    explanation: "GPE = mgh = 2 × 10 × 5 = 100 J."
  },
  {
    topic: "Electricity",
    level: "Core",
    prompt: "A 12 V battery is connected across a 4 Ω resistor. What current flows?",
    options: ["0.33 A", "3 A", "8 A", "48 A"],
    answer: 1,
    explanation: "Ohm’s law: I = V ÷ R = 12 ÷ 4 = 3 A."
  },
  {
    topic: "Waves",
    level: "Core",
    prompt: "A wave has frequency 5 Hz and wavelength 2 m. What is its speed?",
    options: ["2.5 m/s", "7 m/s", "10 m/s", "25 m/s"],
    answer: 2,
    explanation: "Wave speed = frequency × wavelength = 5 × 2 = 10 m/s."
  },
  {
    topic: "Pressure",
    level: "Stretch",
    prompt: "A force of 200 N acts over an area of 0.5 m². What pressure is produced?",
    options: ["100 Pa", "200 Pa", "400 Pa", "1,000 Pa"],
    answer: 2,
    explanation: "Pressure = force ÷ area = 200 ÷ 0.5 = 400 Pa."
  },
  {
    topic: "Power",
    level: "Stretch",
    prompt: "A machine transfers 600 J of energy in 3 seconds. What is its power?",
    options: ["100 W", "180 W", "200 W", "1,800 W"],
    answer: 2,
    explanation: "Power = energy transferred ÷ time = 600 ÷ 3 = 200 W."
  },
  {
    topic: "Density",
    level: "Stretch",
    prompt: "A block has mass 240 g and volume 80 cm³. What is its density?",
    options: ["0.3 g/cm³", "3 g/cm³", "160 g/cm³", "320 g/cm³"],
    answer: 1,
    explanation: "Density = mass ÷ volume = 240 ÷ 80 = 3 g/cm³."
  }
];

const topics = ["All topics", "Motion", "Forces", "Energy", "Electricity", "Waves", "Pressure", "Power", "Density"];

export default function PhysicsChallengeCentre() {
  const [topic, setTopic] = useState("All topics");
  const [level, setLevel] = useState("All levels");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ question: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const pool = useMemo(
    () => questions.filter(q => (topic === "All topics" || q.topic === topic) && (level === "All levels" || q.level === level)),
    [topic, level]
  );
  const current = pool[index];
  const score = answers.filter(a => a.correct).length;

  function restart(nextTopic = topic, nextLevel = level) {
    setTopic(nextTopic);
    setLevel(nextLevel);
    setIndex(0);
    setChoice(null);
    setAnswers([]);
    setFinished(false);
  }

  function submit() {
    if (choice === null || !current) return;
    const updated = [...answers, { question: current.topic, correct: choice === current.answer }];
    setAnswers(updated);
    if (index + 1 >= pool.length) setFinished(true);
    else {
      setIndex(index + 1);
      setChoice(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 dark:border-sky-900 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">Physics practice studio</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Physics Challenge Centre</h2>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">Build confidence with short calculation and concept challenges. Choose a topic, work through the questions and learn from each explanation.</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm dark:bg-slate-800">
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">{score}/{answers.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Correct so far</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Topic
          <select value={topic} onChange={e => restart(e.target.value, level)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            {topics.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Difficulty
          <select value={level} onChange={e => restart(topic, e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            {["All levels", "Starter", "Core", "Stretch"].map(l => <option key={l}>{l}</option>)}
          </select>
        </label>
      </div>

      {!pool.length ? <p className="rounded-xl bg-amber-50 p-4 text-amber-900">No questions match this combination. Choose another topic or difficulty.</p> :
      finished ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Challenge complete</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{score} out of {pool.length} correct</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{score === pool.length ? "Excellent work — you answered every question correctly." : score >= pool.length / 2 ? "Good progress. Review the explanations and have another go." : "Keep practising. The explanations are a useful place to start."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => restart()} className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800">Try again</button>
            <button onClick={() => restart("All topics", "All levels")} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 dark:border-slate-700 dark:text-white">All questions</button>
          </div>
        </div>
      ) : current ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{current.topic} · {current.level}</span><span>Question {index + 1} of {pool.length}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${(index / pool.length) * 100}%` }} /></div>
          <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{current.prompt}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {current.options.map((option, i) => (
              <button key={option} onClick={() => setChoice(i)} className={`rounded-xl border p-4 text-left transition ${choice === i ? "border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-200 dark:bg-sky-950 dark:text-sky-100" : "border-slate-200 hover:border-sky-300 dark:border-slate-700 dark:text-slate-200"}`}>
                <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>{option}
              </button>
            ))}
          </div>
          <button disabled={choice === null} onClick={submit} className="mt-6 rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-sky-800">Check answer</button>
        </div>
      ) : null}

      {answers.length > 0 && !finished && (
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Latest feedback</h3>
          {(() => {
            const last = answers[answers.length - 1];
            const q = questions.find(item => item.topic === last.question && (topic === "All topics" || item.topic === topic));
            return <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{last.question}: {last.correct ? "Correct — well done." : "Not quite. Review the formula and try a fresh round."} {q?.explanation}</p>;
          })()}
        </div>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400">Learning note: these are simplified practice questions. Use the stated values and units; real experiments may involve measurement uncertainty and additional factors.</p>
    </section>
  );
}
