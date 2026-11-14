// /keys (neutral copy; data from the house /api/keys-data): the check-in pack as a page. Zahra sends it from the ops Team page
// ("Send pack"): /keys?b=<booking id>&k=<signature> (same signature as /welcome).
// Personal and private: name, house (No. 37 or No. 35), room, and the key-box code,
// read live from ops (settings "key_boxes"), so a changed code is always right.
// The code shows from three days before arrival once we have the arrival time, otherwise from 15:00 on arrival day.
// Saves as a PDF with the browser's print dialog. Straight corners, full-ink text.

import type { Metadata } from "next";
import DoorAnimation from "@/components/DoorAnimation";
import PrintSheet from "@/components/PrintSheet";
import { UPSTREAM } from "@/lib/upstream";
import { LANGS, langOf, longDate, type Lang } from "@/lib/guestLang";
import { W } from "../welcome/strings";
import { K, LOCK } from "./strings";
import PassportUpload from "@/components/PassportUpload";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your keys", robots: { index: false, follow: false } };

const ZAHRA = "+212 6 19 11 20 08";
const MOUAD = "+212 6 66 23 71 73";
const wa = (n: string) => `https://wa.me/${n.replace(/\D/g, "")}`;

const ROOMS: Record<string, { no: number; floor: "ground" | "first" }> = {
  "hidden gem": { no: 1, floor: "ground" },
  "trésor caché": { no: 2, floor: "first" },
  "tresor cache": { no: 2, floor: "first" },
  "jewel box": { no: 3, floor: "first" },
  love: { no: 1, floor: "ground" },
  joy: { no: 2, floor: "first" },
  bliss: { no: 3, floor: "first" },
};
const isDouaria = (s: string) => /douaria|annex|\b(love|joy|bliss)\b/i.test(s);
const addDays = (ymd: string, n: number) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** A chapter, numbered like the welcome page. */
function Part({ n, title, tone = "lime", children }: { n: number; title: string; tone?: "lime" | "plaster" | "straw"; children: React.ReactNode }) {
  const bg = tone === "plaster" ? "bg-tadelakt" : tone === "straw" ? "bg-door" : "bg-limewash";
  return (
    <section className={`${bg} text-ink keys-part`}>
      <div className="mx-auto max-w-xl px-6 py-12 md:py-16">
        <p className="house italic text-lg mb-2 text-bejmat">{n}</p>
        <h2 className="house font-light text-[clamp(2rem,7vw,2.9rem)] leading-[1.02] tracking-[-0.03em] mb-6">{title}</h2>
        <div className="space-y-4 text-[18px] leading-[1.65]">{children}</div>
      </div>
    </section>
  );
}

/** The code, one digit per square, set large. */
function Code({ value }: { value: string }) {
  return (
    <div className="flex gap-2" aria-label={value}>
      {value.split("").map((d, i) => (
        <span key={i} className="house flex h-[72px] w-[56px] items-center justify-center bg-night text-limewash text-[44px] font-light tabular-nums">{d}</span>
      ))}
    </div>
  );
}

export default async function KeysPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = searchParams;
  const data = await fetch(`${UPSTREAM}/api/keys-data?b=${encodeURIComponent(q.b || "")}&k=${encodeURIComponent(q.k || "")}${q.room ? `&room=${encodeURIComponent(q.room)}` : ""}`, { cache: "no-store" })
    .then((r) => r.json()).catch(() => ({ guest: null }));
  const g = data.guest as null | { booking_id: string; first_name: string; language: string; source: string; check_in: string; check_out: string };
  const lang: Lang = LANGS.includes(q.lang as Lang) ? (q.lang as Lang) : langOf(g?.language);
  const t = K[lang];
  const w = W[lang];

  if (!g) {
    return (
      <div className="min-h-[70vh] bg-limewash text-ink flex items-center">
        <div className="mx-auto max-w-xl px-6">
          <h1 className="house font-light text-[clamp(2.4rem,9vw,3.6rem)] leading-none mb-6">{t.titlePlain}</h1>
          <p className="text-[18px] mb-6">{t.notFound}</p>
          <a href={wa(ZAHRA)} className="inline-block px-6 py-3.5 bg-door text-ink no-underline">Zahra · {ZAHRA}</a>
        </div>
      </div>
    );
  }

  const first = (g.first_name || "").trim().split(/\s+/)[0];
  const roomRaw: string = data.roomRaw || "";
  const douaria: boolean = !!data.douaria;
  const wholeHouse = douaria && /whole house/i.test(roomRaw);
  const room = ROOMS[roomRaw.toLowerCase()];
  const no = douaria ? "35" : "37";
  const lq = lang !== "en" ? `lang=${lang}` : "";
  const directions = douaria ? `/the-douaria/directions${lq ? `?${lq}` : ""}` : `/the-riad/directions${lq ? `?${lq}` : ""}`;
  const gt = data.gate as { passport: boolean; taxOk: boolean; late: boolean; tax: number | null };
  const lk = LOCK[lang];
  const amount = gt.tax !== null ? (lang === "en" ? gt.tax.toFixed(2) : gt.tax.toFixed(2).replace(".", ",")) : "";
  const locked: boolean = !!data.locked;
  const code: string = data.code || "";
  const taxHref = `/api/tax?b=${encodeURIComponent(g.booking_id)}&k=${encodeURIComponent(q.k || "")}${lang !== "en" ? `&lang=${lang}` : ""}`;
  const steps = douaria ? t.stepsDouaria : t.stepsMain;
  const langHref = (l: Lang) => `/keys?b=${encodeURIComponent(g.booking_id)}&k=${encodeURIComponent(q.k || "")}&lang=${l}${q.room ? `&room=${encodeURIComponent(q.room)}` : ""}`;

  return (
    <div id="keys-sheet" className="min-h-screen bg-limewash text-ink">
      <style>{`@media print{@page{margin:12mm}header,footer,nav,.keys-noprint{display:none!important}#keys-sheet{-webkit-print-color-adjust:exact;print-color-adjust:exact}.keys-part{break-inside:avoid}}`}</style>

      {/* Hello: name, house number, room */}
      <section className="bg-limewash">
        <div className="mx-auto max-w-xl px-6 pt-28 pb-10">
          <div className="keys-noprint mb-10 flex items-center text-[15px]">
            Derb Fhal Zefriti
            <span className="ms-auto flex gap-3 text-[14px]">
              {LANGS.map((l) => (
                <a key={l} href={langHref(l)} className={l === lang ? "underline underline-offset-4" : "no-underline"}>{l.toUpperCase()}</a>
              ))}
            </span>
          </div>
          <h1 className="house font-light text-[clamp(2.8rem,12vw,4.8rem)] leading-[0.92] tracking-[-0.04em]">
            {first ? t.title.replace("{name}", first) : t.titlePlain}
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed">{t.intro}</p>
          <p className="mt-6 text-[17px]">{longDate(g.check_in || "", lang)} → {longDate(g.check_out || "", lang)}</p>
          <div className="mt-10 grid grid-cols-[1fr_auto] gap-6 border-t border-ink/20 pt-8">
            <div>
              <p className="text-[15px] mb-1">{t.yourRoom}</p>
              <p className="house text-[28px] leading-tight">{wholeHouse ? t.wholeHouse : roomRaw}</p>
              {room && !wholeHouse && <p className="text-[16px] mt-1">No {room.no} · {t.floor[room.floor]}</p>}
            </div>
            <div className="text-right">
              <p className="text-[15px] mb-1">{t.yourHouse}</p>
              <p className="house font-light text-bejmat text-[96px] leading-[0.8] tracking-[-0.05em]">{no}</p>
              <p className="text-[15px] mt-2">Derb Fhal Zefriti</p>
            </div>
          </div>
        </div>
      </section>

      <Part n={1} title={t.findTitle} tone="plaster">
        <img src="/drawings/arriving.svg" alt="" aria-hidden draggable={false} className="block w-full max-w-[460px] -ms-2 mb-2 select-none" />
        <p>{t.find1}</p>
        <p>{t.find2}</p>
        <a href={directions} className="keys-noprint inline-block px-6 py-3.5 bg-door text-ink no-underline">{t.wayButton}</a>
        <p className="text-[16px]">{t.noMaps}</p>
      </Part>

      <Part n={2} title={t.boxTitle}>
        <img src="/drawings/keybox.svg" alt="" aria-hidden draggable={false} className="block w-full max-w-[460px] -ms-2 mb-2 select-none" />
        <p>{t.boxIntro.replace("{no}", no)}</p>
        <div className="py-2">
          <p className="text-[15px] mb-2">{t.code}</p>
          {code ? <Code value={code} /> : locked ? (
            <div className="space-y-3">
              <p className="text-[17px] font-medium">{lk.intro}</p>
              <p className="text-[17px]">{gt.passport ? `✓ ${lk.passportDone}` : lk.passport}</p>
              {!gt.passport && <PassportUpload b={g.booking_id} k={q.k || ""} label={lk.upload} sending={lk.sending} failed={lk.upFailed} />}
              <p className="text-[17px]">{gt.taxOk ? `✓ ${lk.taxDone}` : lk.tax.replace(/\{amount\}/g, amount).replace("{dh}", gt.tax !== null ? String(Math.round(gt.tax * 10)) : "")}</p>
              {!gt.taxOk && <a href={taxHref} className="keys-noprint inline-block px-6 py-3.5 bg-night text-limewash no-underline">{lk.pay.replace("{amount}", amount)}</a>}
              {q.tax === "failed" && <p className="text-[17px] font-medium">{lk.failed}</p>}
            </div>
          ) : <p className="text-[17px] font-medium">{gt.late ? t.codeLater : t.codeDoor}</p>}
          <p className="text-[17px]">{t.sim}</p>
        </div>
        <ol className="list-none pl-0 border-t border-ink/20">
          {steps.map((s, i) => (
            <li key={i} className="py-3 border-b border-ink/20 grid grid-cols-[2rem_1fr] gap-2">
              <span className="house italic text-bejmat text-[20px]">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {!douaria && (
          <div className="keys-noprint">
            <DoorAnimation steps={w.doorSteps} aria={w.doorAria} />
          </div>
        )}
      </Part>

      <Part n={3} title={t.roomTitle} tone="plaster">
        <p className="house text-[26px] leading-tight">
          {wholeHouse ? t.wholeHouse : `${roomRaw}${room ? ` · No ${room.no}, ${t.floor[room.floor]}` : ""}`}
        </p>
        <p>{t.roomKey}</p>
        {douaria && <p>{t.douariaKeys}</p>}
        <img src="/drawings/walle-cushions.svg" alt="" aria-hidden draggable={false} className="block w-48 ms-auto mt-2 select-none" />
      </Part>

      <Part n={4} title={t.morningTitle}>
        <p>{t.morning}</p>
      </Part>

      {/* Airbnb collects the city tax itself: Airbnb guests don't see this. */}
      {!/airbnb/i.test(g.source || "") && !gt.late && (
        <Part n={5} title={t.taxTitle} tone="straw">
          <p>{t.tax}</p>
        </Part>
      )}

      <section className="night bg-night text-limewash keys-part">
        <div className="mx-auto max-w-xl px-6 py-12 md:py-16">
          <h2 className="house font-light text-[clamp(1.9rem,7vw,2.6rem)] leading-tight mb-4">{t.helpTitle}</h2>
          <p className="text-[18px] mb-6">{t.help}</p>
          <ul className="list-none pl-0 space-y-3 text-[18px]">
            <li><a href={wa(ZAHRA)} className="underline underline-offset-4 text-candle">{t.zahra}</a> · {ZAHRA}</li>
            <li><a href={wa(MOUAD)} className="underline underline-offset-4 text-candle">{t.mouad}</a> · {MOUAD}</li>
          </ul>
          <div className="keys-noprint mt-8">
            <PrintSheet label={t.print} />
          </div>
          <p className="house italic font-light text-[clamp(1.6rem,6vw,2.2rem)] mt-12 text-center">{t.until}</p>
        </div>
      </section>
    </div>
  );
}
