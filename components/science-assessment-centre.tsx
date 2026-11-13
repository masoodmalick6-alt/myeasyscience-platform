"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  id: number;
  subject: string;
  level: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const bank: Question[] = [
  { id: 1, subject: "Biology", level: "Starter", prompt: "Which cell structure contains most of the genetic material in a typical animal cell?", options: ["Nucleus", "Cell membrane", "Ribosome", "Cytoplasm"], answer: 0, explanation: "The nucleus contains most of the cell's DNA and helps control cell activities." },
  { id: 2, subject: "Biology", level: "Core", prompt: "Which process allows green plants to make glucose using light energy?", options: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], answer: 1, explanation: "Photosynthesis uses light energy to convert carbon dioxide and water into glucose and oxygen." },
  { id: 3, subject: "Biology", level: "Stretch", prompt: "In a simple cross Aa × Aa, what fraction of offspring are expected to have genotype aa?", options: ["0", "1/4", "1/2", "3/4"], answer: 1, explanation: "The four equally likely combinations are AA, Aa, Aa and aa, so one quarter are aa." },
  { id: 4, subject: "Chemistry", level: "Starter", prompt: "What is the chemical symbol for oxygen?", options: ["Ox", "O", "Og", "Oy"], answer: 1, explanation: "The chemical symbol for oxygen is O." },
  { id: 5, subject: "Chemistry", level: "Core", prompt: "A solution with pH 3 is best described as:", options: ["Acidic", "Neutral", "Alkaline", "Pure water"], answer: 0, explanation: "A pH below 7 is acidic; pH 7 is neutral at about room temperature." },
  { id: 6, subject: "Chemistry", level: "Stretch", prompt: "How many moles are present in 18 g of water (H₂O), given Mr = 18?", options: ["0.5 mol", "1 mol", "2 mol", "18 mol"], answer: 1, explanation: "Amount in moles = mass ÷ molar mass = 18 ÷ 18 = 1 mol." },
  { id: 7, subject: "Physics", level: "Starter", prompt: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: 2, explanation: "Force is measured in newtons (N)." },
  { id: 8, subject: "Physics", level: "Core", prompt: "A car travels 150 m in 10 s. What is its average speed?", options: ["10 m/s", "15 m/s", "25 m/s", "1500 m/s"], answer: 1, explanation: "Average speed = distance ÷ time = 150 ÷ 10 = 15 m/s." },
  { id: 9, subject: "Physics", level: "Stretch", prompt: "A 4 Ω resistor carries a current of 3 A. What is the potential difference?", options: ["0.75 V", "7 V", "12 V", "24 V"], answer: 2, explanation: "Ohm's law gives V = IR = 3 × 4 = 12 V." },
  { id: 10, subject: "Mathematics", level: "Starter", prompt: "What is 15% of 200?", options: ["15", "20", "30", "45"], answer: 2, explanation: "0.15 × 200 = 30." },
  { id: 11, subject: "Mathematics", level: "Core", prompt: "Solve 5x − 7 = 18.", options: ["x = 3", "x = 5", "x = 7", "x = 11"], answer: 1, explanation: "Add 7 to get 5x = 25, then divide by 5: x = 5." },
  { id: 12, subject: "Mathematics", level: "Stretch", prompt: "A right triangle has shorter sides 6 cm and 8 cm. What is the hypotenuse?", options: ["9 cm", "10 cm", "12 cm", "14 cm"], answer: 1, explanation: "Pythagoras: c² = 6² + 8² = 100, so c = 10 cm." },
  { id: 13, subject: "Computer Science", level: "Starter", prompt: "Which of these is a Boolean value in Python?", options: ["'False'", "False", "0.5", "'0'"], answer: 1, explanation: "False without quotation marks is a Boolean value. Quoted values are strings." },
  { id: 14, subject: "Computer Science", level: "Core", prompt: "What is the purpose of a loop in a program?", options: ["Repeat instructions", "Delete variables", "Always stop a program", "Encrypt every file"], answer: 0, explanation: "A loop repeats a block of instructions while a condition holds or for each item in a sequence." },
  { id: 15, subject: "Computer Science", level: "Stretch", prompt: "What is the binary representation of decimal 10?", options: ["1001", "1010", "1100", "1110"], answer: 1, explanation: "Binary 1010 represents 8 + 2, which equals decimal 10." },
  { id: 16, subject: "Earth Science", level: "Starter", prompt: "Which layer of the atmosphere contains most weather?", options: ["Troposphere", "Mesosphere", "Thermosphere", "Exosphere"], answer: 0, explanation: "Most clouds and weather occur in the troposphere, the lowest atmospheric layer." },
  { id: 17, subject: "Earth Science", level: "Core", prompt: "Which rock type forms when molten rock cools and solidifies?", options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], answer: 2, explanation: "Igneous rocks form when magma or lava cools and solidifies." },
  { id: 18, subject: "Astronomy", level: "Starter", prompt: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1, explanation: "Iron-rich minerals in Martian surface dust give Mars its reddish appearance." },
  { id: 19, subject: "Astronomy", level: "Core", prompt: "What causes the phases of the Moon?", options: ["Earth's shadow every night", "Changing views of its sunlit half as it orbits Earth", "The Moon changing shape", "Clouds covering the Moon"], answer: 1, explanation: "We see different portions of the Moon's sunlit half as the Moon orbits Earth." }
];

const subjects = ["All subjects", "Biology", "Chemistry", "Physics", "Mathematics", "Computer Science", "Earth Science", "Astronomy"];
const levels = ["All levels", "Starter", "Core", "Stretch"];

export default function ScienceAssessmentCentre() {
  const [subject, setSubject] = useState("All subjects");
  const [level, setLevel] = useState("All levels");
  const [questionCount, setQuestionCount] = useState("10");
  const [timed, setTimed] = useState(false);
  const [duration, setDuration] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ question: Question; selected: number | null; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const available = useMemo(
    () => bank.filter(q => (subject === "All subjects" || q.subject === subject) && (level === "All levels" || q.level === level)),
    [subject, level]
  );
  const current = questions[index];
  const correctCount = answers.filter(a => a.correct).length;
  const percentage = answers.length ? Math.round(correctCount / answers.length * 100) : 0;

  useEffect(() => {
    if (!started || !timed || finished) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = window.setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, timed, finished, secondsLeft]);

  function startAssessment() {
    const count = Math.min(Number(questionCount), available.length);
    const selectedQuestions = [...available].slice(0, count);
    setQuestions(selectedQuestions);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowFeedback(false);
    setFinished(false);
    setSecondsLeft(duration * 60);
    setStarted(true);
  }

  function submitAnswer() {
    if (!current || selected === null || showFeedback) return;
    const correct = selected === current.answer;
    setAnswers(prev => [...prev, { question: current, selected, correct }]);
    setShowFeedback(true);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex(i => i + 1);
    setSelected(null);
    setShowFeedback(false);
  }

  function restart() {
    setStarted(false);
    setFinished(false);
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setSecondsLeft(duration * 60);
  }

  const breakdown = subjects.slice(1).map(s => {
    const subjectAnswers = answers.filter(a => a.question.subject === s);
    return { subject: s, total: subjectAnswers.length, correct: subjectAnswers.filter(a => a.correct).length };
  }).filter(x => x.total > 0);

  const formatTime = (value: number) => `${Math.floor(value / 60).toString().padStart(2, "0")}:${(value % 60).toString().padStart(2, "0")}`;

  return <div className="space-y-7">
    <section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 p-6 text-white md:p-8">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-violet-200">All-subject assessment</p>
      <h2 className="mt-3 text-3xl font-black md:text-4xl">Put your science knowledge to the test</h2>
      <p className="mt-3 max-w-2xl leading-7 text-violet-50">Build a practice paper across Biology, Chemistry, Physics, Mathematics, Computer Science, Earth Science and Astronomy. Review every answer and see where to focus next.</p>
    </section>

    {!started && !finished && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">Assessment setup</p>
      <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Build your practice paper</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Subject<select value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">{subjects.map(s => <option key={s}>{s}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Difficulty<select value={level} onChange={e => setLevel(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">{levels.map(l => <option key={l}>{l}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Number of questions<select value={questionCount} onChange={e => setQuestionCount(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">{["5","10","15","20"].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><input type="checkbox" checked={timed} onChange={e => setTimed(e.target.checked)} className="h-4 w-4 accent-violet-700"/> Timed assessment</label>
        {timed && <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">Time limit<select value={duration} onChange={e => setDuration(Number(e.target.value))} className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"><option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option><option value={20}>20 minutes</option></select></label>}
      </div>
      <div className="mt-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-950 dark:bg-violet-950 dark:text-violet-100">{available.length} questions available for this selection. The paper will include up to {Math.min(Number(questionCount), available.length)} questions.</div>
      <button onClick={startAssessment} disabled={!available.length} className="mt-5 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-40">Start assessment</button>
    </section>}

    {started && !finished && current && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">{current.subject} · {current.level}</p><h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Question {index + 1} of {questions.length}</h3></div>
        <div className="flex items-center gap-3"><div className="text-sm text-slate-500 dark:text-slate-400">Answered: {answers.length}</div>{timed && <div className={`rounded-xl px-3 py-2 font-mono text-lg font-black ${secondsLeft <= 60 ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-200"}`}>{formatTime(secondsLeft)}</div>}</div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${((index + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}/></div>
      <p className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{current.prompt}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{current.options.map((option,i)=><button key={option} disabled={showFeedback} onClick={()=>setSelected(i)} className={`rounded-xl border p-4 text-left text-sm transition ${selected===i?"border-violet-600 bg-violet-50 text-violet-950 ring-2 ring-violet-200 dark:bg-violet-950 dark:text-violet-100":"border-slate-200 hover:border-violet-300 dark:border-slate-700 dark:text-slate-200"} disabled:opacity-90`}><span className="mr-2 font-bold">{String.fromCharCode(65+i)}.</span>{option}</button>)}</div>
      {showFeedback && <div className={`mt-4 rounded-xl p-4 text-sm ${answers[answers.length-1]?.correct?"bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100":"bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}><strong>{answers[answers.length-1]?.correct?"Correct!":"Review this one."}</strong> {current.explanation}</div>}
      <div className="mt-5 flex flex-wrap gap-2">{!showFeedback?<button disabled={selected===null} onClick={submitAnswer} className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white disabled:opacity-40">Submit answer</button>:<button onClick={nextQuestion} className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white">{index+1===questions.length?"View results":"Next question"}</button>}<button onClick={()=>setFinished(true)} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">End assessment</button></div>
    </section>}

    {finished && <section className="space-y-5">
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-900 dark:bg-violet-950/40">
        <p className="text-sm font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">Assessment report</p>
        <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{correctCount} / {answers.length} correct</h3>
        <p className="mt-1 text-slate-700 dark:text-slate-300">{percentage}% accuracy · {timed && secondsLeft === 0 ? "Time expired." : "Assessment completed."}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white dark:bg-slate-800"><div className="h-full rounded-full bg-violet-600" style={{width:`${percentage}%`}}/></div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{percentage >= 80 ? "Excellent work. Keep challenging yourself with more advanced questions." : percentage >= 50 ? "Good progress. Review the explanations and practise the topics that need more attention." : "Keep learning step by step. Use the answer explanations to guide your next practice session."}</p>
      </div>
      {breakdown.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h4 className="font-black text-slate-900 dark:text-white">Subject breakdown</h4><div className="mt-3 space-y-3">{breakdown.map(row=><div key={row.subject}><div className="flex justify-between text-sm"><span className="font-semibold text-slate-700 dark:text-slate-200">{row.subject}</span><span className="text-slate-500">{row.correct}/{row.total}</span></div><div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-violet-600" style={{width:`${row.correct/row.total*100}%`}}/></div></div>)}</div></div>}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h4 className="font-black text-slate-900 dark:text-white">Answer review</h4><div className="mt-3 space-y-3">{answers.map((a,i)=><div key={`${a.question.id}-${i}`} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><div className="flex flex-wrap justify-between gap-2"><span className="text-xs font-bold uppercase text-slate-500">{a.question.subject} · {a.question.level}</span><span className={`text-xs font-bold ${a.correct?"text-emerald-700 dark:text-emerald-300":"text-amber-700 dark:text-amber-300"}`}>{a.correct?"Correct":"Incorrect"}</span></div><p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{a.question.prompt}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your answer: {a.selected===null?"Not answered":a.question.options[a.selected]} · Correct answer: {a.question.options[a.question.answer]}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{a.question.explanation}</p></div>)}</div></div>
      <div className="flex flex-wrap gap-2"><button onClick={restart} className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white">Build another assessment</button><button onClick={()=>{setSubject("All subjects");setLevel("All levels");restart();}} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700">Reset filters</button></div>
    </section>}
    <p className="text-xs text-slate-500 dark:text-slate-400">Assessment note: questions are educational practice items, not a formal qualification or externally standardised examination. Results are kept in this page session and are not submitted to a teacher or saved to an account.</p>
  </div>;
}
