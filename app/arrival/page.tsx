"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DatePicker from "@/components/DatePicker";
import { LANGS, langOf, longDate, niceTime as fmtTime, type Lang } from "@/lib/guestLang";
import { T, BREAKFAST_ASKED } from "./strings";

type Stay = { firstName: string; room: string; checkIn: string; checkOut: string; arrivalTime: string; note?: string; language?: string };

// The breakfast answer travels inside the note, as a tag ops can read.
const BREAKFAST_TAG = /\s*\[Breakfast: [^\]]*\]\s*/g;

const WHATSAPP = "https://wa.me/212619112008";
const SLOTS = Array.from({ length: 36 }, (_, i) => {
  const mins = 6 * 60 + i * 30; // 06:00 → 23:30
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${mins % 60 ? "30" : "00"}`;
});

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

// The house look (see /welcome): limewash, Fraunces, straight corners, the door-yellow button.
// The house form style (every project): a single underline, no box.
const input = "w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-[18px] placeholder:text-[15px] placeholder:italic placeholder:text-ink text-ink focus:outline-none focus:border-ink";
const dateField = `${input} text-left`;
const button = "w-full bg-door text-ink py-4 text-[17px] hover:bg-[#F1E2AE] transition-colors disabled:bg-tadelakt";
const label = "block house text-[24px] leading-tight mb-3";

function ArrivalForm() {
  const params = useSearchParams();
  const b = params.get("b") || "";
  const k = params.get("k") || "";
  const personal = !!(b && k);
  const asked = params.get("lang");
  const [lang, setLang] = useState<Lang>(asked && LANGS.includes(asked as Lang) ? (asked as Lang) : "en");
  const t = T[lang];
  const niceDate = (ymd: string) => longDate(ymd, lang);
  const niceTime = (x: string) => fmtTime(x, lang);
  const [breakfast, setBreakfast] = useState<"" | "moroccan" | "sweet">("");

  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(personal);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!personal) return;
    fetch(`/api/arrival?b=${encodeURIComponent(b)}&k=${encodeURIComponent(k)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.booking) {
          setStay(d.booking);
          setTime(d.booking.arrivalTime || "");
          const n: string = d.booking.note || "";
          setNote(n.replace(BREAKFAST_TAG, " ").trim());
          if (/\[Breakfast: sweet/i.test(n)) setBreakfast("sweet");
          else if (/\[Breakfast: Moroccan/i.test(n)) setBreakfast("moroccan");
          if (!asked && d.booking.language) setLang(langOf(d.booking.language));
        } else setError(d.error || "");
      })
      .catch(() => setError(T[lang].loadErr))
      .finally(() => setLoading(false));
  }, [personal, b, k]); // eslint-disable-line react-hooks/exhaustive-deps

  const ids = personal ? { b, k } : { number, name, checkIn };

  async function lookUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/arrival", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ids) });
      const d = await r.json();
      if (d.booking) {
        setStay(d.booking);
        setTime(d.booking.arrivalTime || "");
        if (!asked && d.booking.language) setLang(langOf(d.booking.language));
      } else setError(d.error);
    } catch { setError(t.wrong); }
    setBusy(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!time) { setError(t.pickTime); return; }
    setBusy(true); setError("");
    const tag = breakfast === "sweet" ? "[Breakfast: sweet, pastries and fruit]" : breakfast === "moroccan" ? "[Breakfast: Moroccan]" : "";
    const fullNote = [note.replace(BREAKFAST_TAG, " ").trim(), tag].filter(Boolean).join(" ");
    try {
      const r = await fetch("/api/arrival", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...ids, time, note: fullNote }) });
      const d = await r.json();
      if (d.ok) { setStay(d.booking); setSaved(true); } else setError(d.error);
    } catch { setError(t.wrong); }
    setBusy(false);
  }

  const late = time && time >= "17:00";

  const welcomeHref = personal ? `/welcome?b=${encodeURIComponent(b)}&k=${encodeURIComponent(k)}&lang=${lang}` : "/welcome";

  return (
    <div className="min-h-screen bg-limewash text-ink">
      <section className="pt-28 pb-24 md:pt-36">
        <div className="mx-auto px-6 max-w-xl">
          <div className="flex items-baseline gap-3 text-[13px] tracking-[0.18em] uppercase mb-8">
            <span>{t.eyebrow}</span>
            <span className="ms-auto flex gap-3">
              {LANGS.map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)} className={l === lang ? "underline underline-offset-4 decoration-bejmat decoration-2" : "hover:underline underline-offset-4"} aria-pressed={l === lang}>
                  {l}
                </button>
              ))}
            </span>
          </div>

          {/* The ink-and-wash drawing of the moment (public/drawings), decorative. */}
          <img src="/drawings/arriving.svg" alt="" aria-hidden draggable={false} className="block w-full max-w-[460px] -ms-2 mb-6 select-none" />

          <h1 className="house font-light text-[clamp(2.5rem,9vw,3.8rem)] leading-[1.02] tracking-[-0.03em] mb-6">
            {stay?.firstName ? fill(t.welcome, { name: stay.firstName }) : t.when}
          </h1>
          <p className="text-[18px] leading-[1.7] mb-10">{t.intro}</p>

          {loading ? (
            <p className="text-[18px]">{t.loading}</p>
          ) : saved && stay ? (
            <div className="bg-tadelakt px-6 py-8 md:px-8 space-y-4 text-[18px] leading-[1.7]">
              <p className="house text-[clamp(1.6rem,5vw,2.1rem)] leading-[1.15]">{t.received}</p>
              <p>{fill(t.thanks, { time: niceTime(stay.arrivalTime), date: niceDate(stay.checkIn) })}</p>
              <p>{t.packSoon}</p>
              <p>{t.meanwhile.split("{link}")[0]}<a className="underline underline-offset-4 decoration-bejmat" href={WHATSAPP}>WhatsApp, +212 6 19 11 20 08</a>{t.meanwhile.split("{link}")[1]}</p>
              {stay.note && stay.note.replace(BREAKFAST_TAG, " ").trim() && <p>{t.noteReached} &ldquo;{stay.note.replace(BREAKFAST_TAG, " ").trim()}&rdquo;</p>}
              <p className="text-[16px]">{t.changeLater}</p>
            </div>
          ) : stay ? (
            <form onSubmit={save} className="space-y-8">
              <p className="house italic text-[20px] text-bejmat">
                {stay.room ? `${stay.room} · ` : ""}{niceDate(stay.checkIn)}{stay.checkOut ? ` → ${niceDate(stay.checkOut)}` : ""}
              </p>
              <label className="block">
                <span className={label}>{t.timeLabel}</span>
                <select className={input} value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="">{t.choose}</option>
                  {SLOTS.map((s) => <option key={s} value={s}>{niceTime(s)}</option>)}
                </select>
                <span className="block mt-3 text-[16px] leading-relaxed">
                  {t.checkin}
                  {time && time > "21:00" ? t.after21 : late ? t.after17 : ""}
                </span>
              </label>
              <label className="block">
                <span className={label}>{t.noteLabel} <span className="text-[17px] italic">{t.optional}</span></span>
                <textarea className={input} rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.placeholder} />
              </label>
              {BREAKFAST_ASKED.includes(lang) && t.breakfastTitle && (
                <fieldset className="block">
                  <legend className={label}>{t.breakfastTitle}</legend>
                  <p className="text-[17px] mb-4">{t.breakfastText}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(["moroccan", "sweet"] as const).map((v) => (
                      <label key={v} className={`flex items-center gap-3 px-4 py-4 border cursor-pointer text-[17px] transition-colors ${breakfast === v ? "bg-door border-ink" : "bg-white border-ink/25 hover:border-ink"}`}>
                        <input type="radio" name="breakfast" className="accent-[#9A5236]" checked={breakfast === v} onChange={() => setBreakfast(v)} />
                        {v === "moroccan" ? t.breakfastMoroccan : t.breakfastSweet}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {error && <p className="text-[#8a3b2b] text-[17px]">{error}</p>}
              <button className={button} disabled={busy}>{busy ? t.saving : stay.arrivalTime ? t.update : t.confirm}</button>
            </form>
          ) : personal ? (
            <p className="text-[#8a3b2b] text-[18px]">{error || t.notFound}</p>
          ) : (
            <form onSubmit={lookUp} className="space-y-8">
              <label className="block">
                <span className={label}>{t.booker}</span>
                <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder={t.bookerHint} autoComplete="name" required />
              </label>
              <label className="block">
                <span className={label}>{t.number} <span className="text-[17px] italic">{t.optional}</span></span>
                <input className={input} value={number} onChange={(e) => setNumber(e.target.value)} placeholder={t.numberHint} autoComplete="off" />
              </label>
              <div>
                <span className={label}>{t.checkInDate}</span>
                <DatePicker className={dateField} value={checkIn} onChange={setCheckIn} required ariaLabel={t.checkInDate} placeholder="" />
              </div>
              {error && <p className="text-[#8a3b2b] text-[17px]">{error}</p>}
              <button className={button} disabled={busy}>{busy ? t.looking : t.find}</button>
            </form>
          )}

          {/* The welcome guide, and Zahra. */}
          <div className="mt-14 pt-8 border-t border-ink/15 space-y-5 text-[17px] leading-relaxed">
            <a href={welcomeHref} className="group flex items-baseline justify-between gap-4 no-underline">
              <span className="house text-[21px] leading-snug">{t.guide}</span>
              <span className="text-bejmat transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
            <p>
              {t.questions.split("{link}")[0]}<a className="underline underline-offset-4 decoration-bejmat" href={WHATSAPP}>WhatsApp, +212 6 19 11 20 08</a>{t.questions.split("{link}")[1]}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ArrivalPage() {
  return (
    <Suspense>
      <ArrivalForm />
    </Suspense>
  );
}
