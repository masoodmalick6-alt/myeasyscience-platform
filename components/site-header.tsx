import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  let user = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }
  return <header className="bg-white border-b border-slate-100">
    <div className="container flex items-center justify-between py-4 gap-4">
      <Link href="/" className="font-black text-xl tracking-tight"><span className="text-blue-700">My</span>EasyScience<span className="text-blue-700">.</span></Link>
      <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link href="/courses">Courses</Link><Link href="/#subjects">Subjects</Link><Link href="/#membership">Membership</Link>
      </nav>
      <div className="flex gap-2 items-center">
        {user ? <><Link className="btn btn-secondary text-sm" href="/dashboard">My dashboard</Link><form action="/auth/signout" method="post"><button className="text-sm font-bold text-slate-600 px-2 py-2">Sign out</button></form></> :
          <><Link className="text-sm font-bold px-2 py-2" href="/login">Log in</Link><Link className="btn btn-primary text-sm" href="/signup">Join free</Link></>}
      </div>
    </div>
  </header>;
}
