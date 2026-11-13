import Link from "next/link";
import { ThemeToggle } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  let user = null;
  let isAdmin = false;
  let isTeacher = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) { const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(); isAdmin = profile?.role === "admin"; isTeacher = profile?.role === "teacher"; }
  }
  return <header className="bg-white border-b border-slate-100">
    <div className="container flex items-center justify-between py-4 gap-4">
      <Link href="/" className="font-black text-xl tracking-tight"><span className="text-blue-700">My</span>EasyScience<span className="text-blue-700">.</span></Link>
      <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link href="/courses">Courses</Link><Link href="/labs">Virtual Labs</Link><Link href="/biology-lab">Biology Lab</Link><Link href="/physics-lab">Physics Lab</Link><Link href="/space-exploration">Space</Link><Link href="/earth-climate">Earth & Climate</Link><Link href="/mathematics-discovery">Maths</Link><Link href="/coding-discovery">Coding</Link><Link href="/science-assessment">Assessments</Link><Link href="/certificate-wallet">Certificate Wallet</Link><Link href="/certificates">Certificates</Link><Link href="/verified-certificates">Verified awards</Link><Link href="/verify-certificate">Verify certificate</Link><Link href="/periodic-table">Periodic Table</Link><Link href="/equation-balancer">Equation Balancer</Link><Link href="/chemistry-practice">Chemistry Practice</Link><Link href="/progress">My Progress</Link><Link href="/rewards">Rewards</Link><Link href="/arcade">Science Arcade</Link><Link href="/#subjects">Subjects</Link><Link href="/membership">Membership</Link>{isTeacher && <Link href="/teacher">Teacher</Link>}{user && <Link href="/classroom">Classroom</Link>}{isAdmin && <Link href="/admin">Admin</Link>}
      </nav>
      <div className="flex gap-2 items-center"><ThemeToggle />
        {user ? <><Link className="btn btn-secondary text-sm" href="/dashboard">My dashboard</Link><form action="/auth/signout" method="post"><button className="text-sm font-bold text-slate-600 px-2 py-2">Sign out</button></form></> :
          <><Link className="text-sm font-bold px-2 py-2" href="/login">Log in</Link><Link className="btn btn-primary text-sm" href="/signup">Join free</Link></>}
      </div>
    </div>
  </header>;
}
