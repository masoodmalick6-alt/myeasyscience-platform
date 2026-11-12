"use client";
import { useState } from "react";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function upgrade() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to start checkout.");
      window.location.assign(data.url);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); setLoading(false); }
  }
  return <div><button onClick={upgrade} disabled={loading} className="btn btn-primary w-full">{loading ? "Opening secure checkout…" : "Upgrade to Premium"}</button>{error && <p className="text-sm text-red-600 mt-3" role="alert">{error}</p>}</div>;
}
