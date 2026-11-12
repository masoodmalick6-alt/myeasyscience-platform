import Link from "next/link";
import { signIn, signUp } from "@/app/auth/actions";

export function AuthForm({ mode, error, message }: { mode: "login" | "signup"; error?: string; message?: string }) {
  const signup = mode === "signup";
  return <main className="container py-16 max-w-md"><div className="card p-8">
    <p className="text-blue-700 font-bold text-sm uppercase tracking-wider">{signup ? "Create your account" : "Welcome back"}</p>
    <h1 className="text-3xl font-black mt-2">{signup ? "Start learning free" : "Log in to MyEasyScience"}</h1>
    <p className="text-slate-600 text-sm mt-3">{signup ? "Save your progress and continue learning wherever you are." : "Continue your science learning journey."}</p>
    {message && <p className="mt-5 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm">{message}</p>}
    {error && <p className="mt-5 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
    <form action={signup ? signUp : signIn} className="mt-6 space-y-4">
      {signup && <label className="block text-sm font-bold">Full name<input className="field mt-2" name="name" autoComplete="name" required/></label>}
      <label className="block text-sm font-bold">Email address<input className="field mt-2" type="email" name="email" autoComplete="email" required/></label>
      <label className="block text-sm font-bold">Password<input className="field mt-2" type="password" name="password" minLength={signup ? 8 : 1} autoComplete={signup ? "new-password" : "current-password"} required/>{signup && <span className="text-xs text-slate-500 font-normal">Use at least 8 characters.</span>}</label>
      <button className="btn btn-primary w-full" type="submit">{signup ? "Create account" : "Log in"}</button>
    </form>
    <p className="text-sm text-slate-600 mt-6">{signup ? "Already registered?" : "New to MyEasyScience?"} <Link className="text-blue-700 font-bold" href={signup ? "/login" : "/signup"}>{signup ? "Log in" : "Create an account"}</Link></p>
  </div></main>;
}
