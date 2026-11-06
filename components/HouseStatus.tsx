"use client";

import { useEffect, useState } from "react";

/**
 * Time-aware house status — reads the current hour in Marrakech (not the
 * visitor's timezone) and adapts: staff availability + day/night arrival note.
 * No autoplay, no API, no permissions. Ticks each minute.
 */
function marrakechNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hh = parts.find((p) => p.type === "hour")?.value ?? "12";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { hour: parseInt(hh, 10), label: `${hh}:${mm}` };
}

const ZAHRA_WA = "https://wa.me/212619112008";
const MOUAD_WA = "https://wa.me/212666237173";

export default function HouseStatus() {
  const [t, setT] = useState<{ hour: number; label: string } | null>(null);

  useEffect(() => {
    const tick = () => setT(marrakechNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!t) return null;

  const staffOpen = t.hour >= 8 && t.hour < 17; // 8am–5pm Marrakech
  const daylight = t.hour >= 7 && t.hour < 19; // rough light window

  return (
    <div className="bg-[hsl(var(--secondary))] border border-foreground/10 p-6 mb-10">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${staffOpen ? "bg-[#C2410C]" : "bg-foreground/25"}`} />
        <span className="text-[12px] tracking-[0.2em] uppercase text-foreground">
          {t.label} in the medina
        </span>
      </div>

      <p className="text-foreground text-sm leading-relaxed text-center">
        {staffOpen ? (
          <>
            Zahra is here now —{" "}
            <a href={ZAHRA_WA} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#C2410C] transition-colors">
              message her on WhatsApp
            </a>{" "}
            and we&apos;ll guide you in.
          </>
        ) : (
          <>
            The house is resting. Zahra replies from 8am. For a true emergency tonight,{" "}
            <a href={MOUAD_WA} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#C2410C] transition-colors">
              reach Mouad
            </a>
            .
          </>
        )}
      </p>

      <p className="text-foreground text-sm leading-relaxed text-center mt-2">
        {daylight
          ? "Arriving in daylight? Aim for the Koutoubia minaret, then follow the steps below."
          : "Arriving after dark? The alley is lit and safe — stay on live WhatsApp and we'll walk you in."}
      </p>
    </div>
  );
}
