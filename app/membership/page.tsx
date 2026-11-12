import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UpgradeButton } from "@/components/upgrade-button";

export default async function MembershipPage({ searchParams }: { searchParams: Promise<{ success?: string; canceled?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let tier = "free";
  if (user) {
    const { data } = await supabase.from("profiles").select("membership_tier").eq("id", user.id).single();
    tier = data?.membership_tier || "free";
  }
  return <main className="container py-16 max-w-4xl">
    <div className="text-center mb-10"><p className="eyebrow">MEMBERSHIP</p><h1 className="text-4xl font-black mt-3">Make science click.</h1><p className="text-slate-600 mt-3">Choose the learning experience that works for you.</p></div>
    {params.success && <p className="rounded-xl bg-green-50 text-green-800 p-4 mb-6">Checkout completed. Your Premium access will appear once Stripe confirms your subscription.</p>}
    {params.canceled && <p className="rounded-xl bg-slate-100 p-4 mb-6">Checkout was canceled. You can upgrade whenever you’re ready.</p>}
    <div className="grid md:grid-cols-2 gap-6">
      <section className="card p-7"><h2 className="text-2xl font-bold">Free</h2><p className="text-3xl font-black mt-4">$0</p><p className="text-slate-600 mt-2">A strong start for curious minds.</p><ul className="space-y-3 my-7 text-sm"><li>✓ Selected courses and lessons</li><li>✓ Practice quizzes</li><li>✓ Learning progress tracking</li></ul>{tier === "free" ? <span className="text-sm font-bold text-blue-700">Your current plan</span> : <span className="text-sm text-slate-500">Available anytime</span>}</section>
      <section className="card p-7 border-2 border-blue-600"><p className="eyebrow">MORE WAYS TO LEARN</p><h2 className="text-2xl font-bold mt-2">Premium</h2><p className="text-3xl font-black mt-4">See checkout for price</p><p className="text-slate-600 mt-2">For learners ready to go further.</p><ul className="space-y-3 my-7 text-sm"><li>✓ All free learning features</li><li>✓ Premium course access</li><li>✓ Extended practice and revision</li><li>✓ Cancel through your billing provider</li></ul>{tier === "premium" ? <span className="text-sm font-bold text-green-700">Premium is active on your account</span> : user ? <UpgradeButton /> : <Link className="btn btn-primary block text-center" href="/login?next=/membership">Log in to upgrade</Link>}</section>
    </div>
    <p className="text-xs text-slate-500 text-center mt-8">Premium pricing and tax are shown by the secure checkout. Membership features should be clearly described before launch.</p>
  </main>;
}
