"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { quizQuestions } from "@/lib/course-data";

export function Quiz() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const q = quizQuestions[index];
  const score = answers.filter(Boolean).length;
  async function next() {
    const nextAnswers = [...answers, choice === q.answer];
    setAnswers(nextAnswers);
    setChoice(null);
    if (index === quizQuestions.length - 1) {
      setFinished(true);
      setSaving(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("quiz_attempts").insert({ user_id: user.id, quiz_title: "Science starter quiz", score: nextAnswers.filter(Boolean).length, total: quizQuestions.length });
        if (!error) setSaved(true);
      }
      setSaving(false);
    } else setIndex(index + 1);
  }
  function restart() { setIndex(0); setChoice(null); setAnswers([]); setFinished(false); setSaved(false); }
  if (finished) return <div className="rounded-2xl bg-blue-50 p-6"><div className="text-3xl font-black">{score}/{quizQuestions.length}</div><h3 className="font-bold text-xl mt-2">Quiz complete!</h3><p className="text-slate-600 mt-2">{score === quizQuestions.length ? "Excellent work — a perfect score!" : "Good effort. Review the explanations and try again."}</p><p className="text-xs text-slate-500 mt-2">{saving ? "Saving your result…" : saved ? "Your score has been saved to your dashboard." : "Sign in to save your quiz history."}</p><button className="btn btn-primary mt-5" onClick={restart}>Try again</button></div>;
  return <div><div className="flex justify-between text-sm font-bold text-slate-500 mb-3"><span>Question {index + 1} of {quizQuestions.length}</span><span>{Math.round(index / quizQuestions.length * 100)}% complete</span></div><div className="h-2 bg-slate-100 rounded-full mb-6"><div className="h-2 bg-blue-600 rounded-full" style={{ width: `${(index / quizQuestions.length) * 100}%` }}/></div><h3 className="font-extrabold text-lg">{q.question}</h3><div className="grid sm:grid-cols-2 gap-3 mt-5">{q.options.map((option, i) => <button key={option} onClick={() => setChoice(i)} className={`text-left p-4 rounded-xl border font-semibold ${choice === i ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 hover:border-blue-300"}`}>{String.fromCharCode(65 + i)}. {option}</button>)}</div><button disabled={choice === null} onClick={next} className="btn btn-primary mt-6 disabled:opacity-40">{index === quizQuestions.length - 1 ? "Finish quiz" : "Next question"}</button></div>;
}
