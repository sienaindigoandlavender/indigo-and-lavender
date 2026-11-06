"use client";
import { useState } from "react";

// What a curious visitor sees at indigoandlavender.love: a password, nothing else (Jacqueline, 6 Nov 2026).
export default function Enter() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  async function go(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/enter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setMsg(r.ok ? "Welcome." : "That password doesn't open this door.");
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={go} className="w-full max-w-xs">
        <label htmlFor="pw" className="block text-[15px] mb-3">Enter your password</label>
        <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus
          className="w-full bg-transparent border-0 border-b border-ink rounded-none py-2 text-[18px] outline-none" />
        <button type="submit" className="mt-6 bg-ink text-limewash px-6 py-3 text-[14px] rounded-none">Enter</button>
        {msg && <p className="mt-4 text-[15px]">{msg}</p>}
      </form>
    </main>
  );
}
