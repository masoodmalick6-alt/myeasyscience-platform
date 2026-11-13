"use client";

import { useMemo, useState } from "react";

type Step = { title: string; body: string; output: string };
const lessons: Record<string, Step[]> = {
  "Variables & output": [
    { title: "Store a value", body: "name = 'Ada'", output: "A variable called name stores the text Ada." },
    { title: "Use a variable", body: "print(name)", output: "Ada" },
    { title: "Change a value", body: "name = 'Grace'\nprint(name)", output: "Grace" }
  ],
  "Conditions": [
    { title: "Make a decision", body: "temperature = 28\nif temperature > 25:\n    print('Warm day')", output: "Warm day" },
    { title: "Try the other path", body: "temperature = 12\nif temperature > 25:\n    print('Warm day')\nelse:\n    print('Cool day')", output: "Cool day" },
    { title: "Compare values", body: "score = 85\nif score >= 50:\n    print('Pass')", output: "Pass" }
  ],
  "Loops": [
    { title: "Repeat an action", body: "for number in range(3):\n    print(number)", output: "0\n1\n2" },
    { title: "Count up", body: "for number in range(1, 4):\n    print(number)", output: "1\n2\n3" },
    { title: "Repeat a message", body: "for turn in range(2):\n    print('Keep learning!')", output: "Keep learning!\nKeep learning!" }
  ],
  "Functions": [
    { title: "Define a function", body: "def greet():\n    print('Hello!')", output: "The function is defined. It runs when called." },
    { title: "Call a function", body: "def greet():\n    print('Hello!')\ngreet()", output: "Hello!" },
    { title: "Return a result", body: "def double(number):\n    return number * 2\nprint(double(4))", output: "8" }
  ]
};

const challenges = [
  { title: "Find the bug", prompt: "You want to display the number 7. Which line is valid Python?", options: ["print(7)", "PRINT 7", "show(7)"], answer: 0, why: "Python uses the print() function with parentheses." },
  { title: "Choose the loop", prompt: "Which structure is useful when you want to repeat a block for each item in a sequence?", options: ["if", "for", "return"], answer: 1, why: "A for loop iterates over items in a sequence or other iterable." },
  { title: "Algorithm thinking", prompt: "What should an algorithm have to solve a task reliably?", options: ["Clear ordered steps", "Random guesses only", "As many steps as possible"], answer: 0, why: "An algorithm is a defined sequence of steps for solving a problem or completing a task." },
  { title: "Boolean logic", prompt: "When is the expression (true AND false) true?", options: ["Always", "When both are true", "Never"], answer: 2, why: "AND is true only when both inputs are true." },
  { title: "Data types", prompt: "Which is a Boolean value in Python?", options: ["'True'", "True", "42"], answer: 1, why: "True without quotation marks is a Boolean. 'True' is text (a string)." }
];

function runSimplePython(source: string): string {
  const lines = source.split("\n");
  const vars: Record<string, string | number | boolean> = {};
  const output: string[] = [];
  let skipIndented = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (raw.startsWith(" ") || raw.startsWith("\t")) {
      if (skipIndented) continue;
    } else skipIndented = false;
    const assignment = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (assignment) {
      const value = assignment[2];
      if (/^(['"]).*\1$/.test(value)) vars[assignment[1]] = value.slice(1, -1);
      else if (value === "True" || value === "False") vars[assignment[1]] = value === "True";
      else if (/^-?\d+(\.\d+)?$/.test(value)) vars[assignment[1]] = Number(value);
      else output.push(`This mini runner supports simple values only: ${value}`);
      continue;
    }
    const print = line.match(/^print\((.*)\)$/);
    if (print) {
      const arg = print[1].trim();
      if (/^(['"]).*\1$/.test(arg)) output.push(arg.slice(1, -1));
      else if (Object.prototype.hasOwnProperty.call(vars, arg)) output.push(String(vars[arg]));
      else if (/^-?\d+(\.\d+)?$/.test(arg)) output.push(arg);
      else output.push(`Name or expression not recognised: ${arg}`);
      continue;
    }
    if (line.startsWith("if ") || line.startsWith("for ") || line.startsWith("def ")) {
      output.push("This learning runner displays example output for control-flow and function lessons; it does not execute full Python.");
      skipIndented = true;
      continue;
    }
    if (line === "else:" || line === "return" || line.startsWith("return ")) continue;
    output.push(`Instruction not supported in this mini runner: ${line}`);
  }
  return output.join("\n") || "Program finished with no printed output.";
}

export default function CodingDiscoveryCentre() {
  const [lesson, setLesson] = useState("Variables & output");
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("name = 'Ada'\nprint(name)");
  const [result, setResult] = useState("");
  const [challenge, setChallenge] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [binary, setBinary] = useState(13);

  const lessonStep = lessons[lesson][step];
  const binaryString = useMemo(() => binary.toString(2).padStart(8, "0"), [binary]);
  const currentChallenge = challenges[challenge];

  function selectLesson(next: string) {
    setLesson(next);
    setStep(0);
  }
  function checkChallenge() {
    if (choice === null || checked) return;
    if (choice === currentChallenge.answer) setScore(s => s + 1);
    setChecked(true);
  }
  function nextChallenge() {
    setChallenge(c => (c + 1) % challenges.length);
    setChoice(null);
    setChecked(false);
  }

  return <div className="space-y-8">
    <section className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950 p-6 text-white md:p-8">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-cyan-200">Computer science & coding</p>
      <h2 className="mt-3 text-3xl font-black md:text-4xl">Learn to think like a programmer</h2>
      <p className="mt-3 max-w-2xl leading-7 text-cyan-50">Explore algorithms, Python basics, logical thinking and binary numbers through guided examples and interactive challenges.</p>
    </section>

    <section className="space-y-4">
      <div><p className="text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">01 · Coding lessons</p><h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">Build your first programming ideas</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Choose a concept and move through short, explained examples.</p></div>
      <div className="flex flex-wrap gap-2">{Object.keys(lessons).map(name => <button key={name} onClick={() => selectLesson(name)} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${lesson === name ? "border-cyan-600 bg-cyan-50 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100" : "border-slate-200 dark:border-slate-700 dark:text-slate-200"}`}>{name}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Step {step + 1} of {lessons[lesson].length}</div>
          <h4 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{lessonStep.title}</h4>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-cyan-100"><code>{lessonStep.body}</code></pre>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{lessonStep.output}</p>
          <div className="mt-4 flex gap-2"><button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700">Previous</button><button onClick={() => setStep(s => (s + 1) % lessons[lesson].length)} className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white">Next step</button></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Try the mini code runner</p>
          <h4 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Edit and run simple Python</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try assigning a number or text value, then print the variable.</p>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={6} spellCheck={false} className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-sm leading-6 text-emerald-100"/>
          <button onClick={() => setResult(runSimplePython(code))} className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white">Run example</button>
          <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><div className="text-xs font-bold uppercase text-slate-500">Output</div><pre className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">{result || "Your program output will appear here."}</pre></div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Safety and scope: this is a tiny educational interpreter for simple assignments and print statements, not a full Python runtime. It does not run arbitrary code or access files, networks or your device.</p>
        </div>
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">02 · Algorithm designer</p>
        <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Plan a simple algorithm</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A good algorithm breaks a task into clear, ordered steps. For example, to find the largest of three numbers:</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200"><li>Start by assuming the first number is the largest.</li><li>Compare the second number with the current largest.</li><li>If the second is larger, update the largest value.</li><li>Compare the third number and update if needed.</li><li>Report the largest value.</li></ol>
        <div className="mt-4 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-950 dark:bg-cyan-950 dark:text-cyan-100"><strong>Key idea:</strong> algorithms are language-independent plans. A program is one way to express an algorithm in a programming language.</div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">03 · Binary number lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">See how computers represent numbers</h3>
        <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Choose a decimal number: {binary}<input type="range" min="0" max="255" value={binary} onChange={e => setBinary(Number(e.target.value))} className="mt-2 w-full accent-cyan-600"/></label>
        <div className="mt-4 grid grid-cols-8 gap-1">{binaryString.split("").map((bit,i)=><div key={i} className={`rounded-lg p-2 text-center font-mono text-lg font-black ${bit==="1"?"bg-cyan-700 text-white":"bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>{bit}</div>)}</div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-slate-500"><span>128</span><span>64</span><span>32</span><span>16</span><span>8</span><span>4</span><span>2</span><span>1</span></div>
        <div className="mt-4 rounded-xl bg-cyan-50 p-4 dark:bg-cyan-950/50"><div className="text-sm text-slate-600 dark:text-slate-300">Binary representation</div><div className="text-2xl font-black tracking-widest text-cyan-800 dark:text-cyan-200">{binaryString}</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Decimal value = {binary}</div></div>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">04 · Logic & coding challenge</p><h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Test your computer science skills</h3></div><div className="rounded-xl bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">Score: {score}</div></div>
      <div className="mt-4 text-xs font-semibold text-slate-500">Challenge {challenge + 1} of {challenges.length}</div>
      <p className="mt-2 font-semibold text-slate-900 dark:text-white">{currentChallenge.title}: {currentChallenge.prompt}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">{currentChallenge.options.map((option,i)=><button key={option} disabled={checked} onClick={()=>setChoice(i)} className={`rounded-xl border p-3 text-left text-sm ${choice===i?"border-cyan-600 bg-cyan-50 dark:bg-cyan-950":"border-slate-200 dark:border-slate-700"} disabled:opacity-80`}>{option}</button>)}</div>
      {checked && <p className={`mt-3 rounded-xl p-3 text-sm ${choice===currentChallenge.answer?"bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100":"bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{choice===currentChallenge.answer?"Correct! ":"Not quite. "}{currentChallenge.why}</p>}
      <div className="mt-4 flex flex-wrap gap-2">{!checked?<button disabled={choice===null} onClick={checkChallenge} className="rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white disabled:opacity-40">Check answer</button>:<button onClick={nextChallenge} className="rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white">Next challenge</button>}<button onClick={()=>{setChallenge(0);setChoice(null);setChecked(false);setScore(0);}} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Reset score</button></div>
    </section>
    <p className="text-xs text-slate-500 dark:text-slate-400">Learning note: examples use beginner-friendly Python-like syntax. The mini runner intentionally supports only a small subset of Python so learners can experiment safely.</p>
  </div>;
}
