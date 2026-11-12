"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FlaskConical, RotateCcw, Sparkles } from "lucide-react";

type Counts = Record<string, number>;
type Balanced = { reactants: string[]; products: string[]; coefficients: number[]; elements: string[]; counts: Counts[] };

const examples = [
  { label: "Water formation", equation: "H2 + O2 -> H2O" },
  { label: "Rust formation", equation: "Fe + O2 -> Fe2O3" },
  { label: "Combustion of methane", equation: "CH4 + O2 -> CO2 + H2O" },
  { label: "Ammonia synthesis", equation: "N2 + H2 -> NH3" },
  { label: "Magnesium oxide", equation: "Mg + O2 -> MgO" },
  { label: "Calcium hydroxide", equation: "Ca(OH)2 + HCl -> CaCl2 + H2O" },
];

function parseFormula(formula: string): Counts {
  const tokens = formula.match(/[A-Z][a-z]?|\d+|[()]/g) || [];
  if (tokens.join("") !== formula || !tokens.length) throw new Error(`Could not read formula “${formula}”. Use element symbols and subscripts, for example Ca(OH)2.`);
  let i = 0;
  function group(): Counts {
    const result: Counts = {};
    while (i < tokens.length && tokens[i] !== ")") {
      if (tokens[i] === "(") {
        i++;
        const nested = group();
        if (tokens[i] !== ")") throw new Error(`Missing closing bracket in ${formula}.`);
        i++;
        const multiplier = /^\d+$/.test(tokens[i] || "") ? Number(tokens[i++]) : 1;
        Object.entries(nested).forEach(([el,n]) => result[el] = (result[el] || 0) + n * multiplier);
      } else if (/^[A-Z][a-z]?$/.test(tokens[i])) {
        const el = tokens[i++];
        const multiplier = /^\d+$/.test(tokens[i] || "") ? Number(tokens[i++]) : 1;
        if (multiplier < 1 || multiplier > 999) throw new Error("Subscripts must be between 1 and 999.");
        result[el] = (result[el] || 0) + multiplier;
      } else throw new Error(`Unexpected part of formula ${formula}.`);
    }
    return result;
  }
  const result = group();
  if (i !== tokens.length) throw new Error(`Check the brackets in ${formula}.`);
  return result;
}
function gcd(a:number,b:number):number { a=Math.abs(a); b=Math.abs(b); while(b){const t=b;b=a%b;a=t;} return a||1; }
function lcm(a:number,b:number):number { return Math.abs(a*b)/gcd(a,b); }
function balance(input:string): Balanced {
  const parts = input.replace(/→|⟶|=/g,"->").split("->");
  if (parts.length !== 2) throw new Error("Enter one reaction arrow, for example H2 + O2 -> H2O.");
  const split = (s:string) => s.split("+").map(x=>x.trim().replace(/^\d+\s*/,"")).filter(Boolean);
  const reactants=split(parts[0]), products=split(parts[1]);
  if (!reactants.length || !products.length || reactants.length+products.length>10) throw new Error("Add at least one formula on each side (up to 10 substances).");
  const formulas=[...reactants,...products], counts=formulas.map(parseFormula);
  const elements=Array.from(new Set(counts.flatMap(c=>Object.keys(c)))).sort();
  const matrix=elements.map(el=>counts.map((c,j)=>(j<reactants.length?1:-1)*(c[el]||0)));
  // Reduced row-echelon form. For the common one-dimensional solution, set the free variable to 1.
  const a=matrix.map(row=>row.map(v=>v));
  let r=0; const pivots:number[]=[];
  for(let c=0;c<formulas.length && r<a.length;c++){
    let pivot=r; for(let k=r+1;k<a.length;k++) if(Math.abs(a[k][c])>Math.abs(a[pivot][c])) pivot=k;
    if(Math.abs(a[pivot][c])<1e-10) continue;
    [a[r],a[pivot]]=[a[pivot],a[r]];
    const div=a[r][c]; for(let j=c;j<formulas.length;j++) a[r][j]/=div;
    for(let k=0;k<a.length;k++) if(k!==r){const factor=a[k][c];for(let j=c;j<formulas.length;j++) a[k][j]-=factor*a[r][j];}
    pivots.push(c); r++;
  }
  const free=Array.from({length:formulas.length},(_,i)=>i).filter(i=>!pivots.includes(i));
  if(!free.length) throw new Error("This equation does not have a non-zero balancing solution. Check the formulas.");
  if(free.length>1) throw new Error("This reaction has multiple independent solutions. Try a simpler reaction or check the formulas.");
  const x=Array(formulas.length).fill(0); x[free[0]]=1;
  pivots.forEach((col,row)=>x[col]=-a[row][free[0]]);
  if(x.some(v=>!Number.isFinite(v)||v<=0)) throw new Error("No positive coefficient solution was found. Check the reaction formulas.");
  const scale=1000000;
  let ints=x.map(v=>Math.round(v*scale));
  let common=ints.reduce((acc,v)=>gcd(acc,v),0);
  ints=ints.map(v=>v/common);
  const max=Math.max(...ints);
  if(max>10000) throw new Error("The coefficients are unusually large; please check the formulas.");
  // Verify atom conservation before returning.
  elements.forEach(el=>{
    const left=counts.slice(0,reactants.length).reduce((sum,c,j)=>sum+c[el]*ints[j],0);
    const right=counts.slice(reactants.length).reduce((sum,c,j)=>sum+c[el]*ints[j+reactants.length],0);
    if(left!==right) throw new Error("A clean integer solution could not be found for this equation.");
  });
  return {reactants,products,coefficients:ints,elements,counts};
}

export function EquationBalancer() {
  const [equation,setEquation]=useState("H2 + O2 -> H2O");
  const [submitted,setSubmitted]=useState("H2 + O2 -> H2O");
  const [error,setError]=useState("");
  const [showSteps,setShowSteps]=useState(true);
  const result=useMemo(()=>{try{return balance(submitted);}catch(e){return null;}},[submitted]);
  function solve(value=equation){setEquation(value);setSubmitted(value);try{balance(value);setError("");}catch(e){setError(e instanceof Error?e.message:"Could not balance this reaction.");}}
  const formatted=result ? result.reactants.map((f,i)=>`${result.coefficients[i]===1?"":result.coefficients[i]}${f}`).join(" + ")+" → "+result.products.map((f,i)=>`${result.coefficients[i+result.reactants.length]===1?"":result.coefficients[i+result.reactants.length]}${f}`).join(" + ") : "";
  return <div className="grid lg:grid-cols-[1fr_330px] gap-6 items-start">
    <section className="card p-5 md:p-7">
      <div className="flex items-center gap-2 text-blue-700 font-bold text-sm"><FlaskConical size={18}/> EQUATION WORKSPACE</div>
      <h2 className="text-2xl font-black mt-2">Enter a chemical equation</h2>
      <p className="text-sm text-slate-600 mt-2 leading-6">Use element symbols and numbers for subscripts. Separate substances with + and use an arrow (→) between reactants and products. You can also type -&gt;.</p>
      <label className="block text-sm font-bold mt-5 mb-2" htmlFor="reaction">Unbalanced reaction</label>
      <input id="reaction" value={equation} onChange={e=>setEquation(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")solve();}} className="field font-mono text-lg" placeholder="e.g. H2 + O2 -> H2O"/>
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={()=>solve()} className="btn btn-primary"><Sparkles size={17}/> Balance equation</button>
        <button onClick={()=>{setEquation("");setSubmitted("");setError("");}} className="btn btn-secondary"><RotateCcw size={16}/> Clear</button>
      </div>
      {error && <div role="alert" className="mt-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 p-4 text-sm">{error}</div>}
      {result && !error && <div className="mt-6">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold"><CheckCircle2 size={18}/> BALANCED EQUATION</div>
          <div className="text-xl md:text-2xl font-black font-mono text-slate-900 mt-4 break-words leading-relaxed">{formatted}</div>
          <p className="text-xs text-emerald-800 mt-3">The number of atoms of every element is equal on both sides.</p>
        </div>
        <div className="flex justify-between items-center mt-6 gap-3"><h3 className="font-extrabold text-lg">Atom count check</h3><button onClick={()=>setShowSteps(v=>!v)} className="text-sm font-bold text-blue-700">{showSteps?"Hide":"Show"} working</button></div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead><tr className="bg-slate-50 text-slate-600"><th className="text-left p-3 rounded-tl-lg">Element</th><th className="text-center p-3">Reactants</th><th className="text-center p-3 rounded-tr-lg">Products</th></tr></thead>
            <tbody>{result.elements.map(el=>{
              const left=result.counts.slice(0,result.reactants.length).reduce((sum,c,j)=>sum+c[el]*result.coefficients[j],0);
              const right=result.counts.slice(result.reactants.length).reduce((sum,c,j)=>sum+c[el]*result.coefficients[j+result.reactants.length],0);
              return <tr key={el} className="border-b"><td className="p-3 font-bold border-b border-slate-100">{el}</td><td className="p-3 text-center border-b border-slate-100">{left}</td><td className="p-3 text-center border-b border-slate-100"><span className="inline-flex items-center gap-1 text-emerald-700 font-bold">{right} <CheckCircle2 size={14}/></span></td></tr>;
            })}</tbody>
          </table>
        </div>
        {showSteps && <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6">
          <h4 className="font-extrabold text-blue-900">How the balancing works</h4>
          <ol className="list-decimal pl-5 mt-2 space-y-1 text-slate-700">
            <li>Count each type of atom in every reactant and product formula.</li>
            <li>Find whole-number coefficients that make each element's total equal on both sides.</li>
            <li>Reduce the coefficients to the smallest whole-number ratio.</li>
            <li>Check the atom totals above to confirm conservation of matter.</li>
          </ol>
        </div>}
      </div>}
    </section>
    <aside className="card p-5">
      <h3 className="font-extrabold text-lg">Try a practice reaction</h3>
      <p className="text-sm text-slate-600 mt-1">Choose an example to load it into the workspace.</p>
      <div className="space-y-2 mt-4">{examples.map(ex=><button key={ex.label} onClick={()=>solve(ex.equation)} className="w-full text-left rounded-xl border border-slate-200 p-3 hover:border-blue-400 hover:bg-blue-50 transition"><span className="block text-sm font-bold">{ex.label}</span><span className="block text-xs font-mono text-slate-500 mt-1">{ex.equation}</span></button>)}</div>
      <div className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900"><b>Input guide:</b> Use correct element capitalisation (Co is cobalt, CO is carbon monoxide). Parentheses are supported, for example Ca(OH)2. This starter tool does not support ionic charges, hydrates, or state symbols.</div>
    </aside>
  </div>;
}
