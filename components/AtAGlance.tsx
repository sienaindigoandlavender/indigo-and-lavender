// "At a glance": the cheat sheet at the top of /welcome. Two small drawn diagrams:
// the day at the house (sun to moon) and the way in (car, two minutes on foot, the door).
// White, one clay accent, readable sizes; words come from app/welcome/strings.ts.

import { niceTime, type Lang } from "@/lib/guestLang";
import PrintSheet from "@/components/PrintSheet";

const CLAY = "#C2410C";
const INK = "#2a2520";

export type GlanceText = {
  title: string;
  dayTitle: string;
  breakfast: string;
  checkout: string;
  checkin: string;
  zahra: string;
  mouad: string;
  quiet: string;
  wayTitle: string;
  dropoff: string;
  walk: string;
  door: string; // "No. {no}"
  print: string;
  yasmin: string;
};

type Icon = "cup" | "key" | "door" | "phone" | "moon";

function Glyph({ name }: { name: Icon }) {
  const p = { fill: "none", stroke: CLAY, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {name === "cup" && (<><path {...p} d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path {...p} d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" /><path {...p} d="M9 3c-1 1.2 1 2 0 3.5M12.5 3c-1 1.2 1 2 0 3.5" /></>)}
      {name === "key" && (<><circle {...p} cx="8" cy="12" r="4" /><path {...p} d="M12 12h9M18 12v3M21 12v2" /></>)}
      {name === "door" && (<><path {...p} d="M5 21V9a7 7 0 0 1 14 0v12z" /><path {...p} d="M3 21h18" /><circle cx="14.5" cy="14" r="1" fill={CLAY} /></>)}
      {name === "phone" && (<path {...p} d="M7 3h4l1.5 4.5-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5L21 13v4a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2z" />)}
      {name === "moon" && (<path {...p} d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />)}
    </svg>
  );
}

export default function AtAGlance({ t, lang, houseNo, zahraPhone, mouadPhone, yasminPhone }: { t: GlanceText; lang: Lang; houseNo: string; zahraPhone: string; mouadPhone: string; yasminPhone?: string }) {
  const at = (x: string) => niceTime(x, lang);
  const day: { icon: Icon; time: string; label: string; phone?: string }[] = [
    { icon: "cup", time: `${at("08:30")} – ${at("10:30")}`, label: t.breakfast },
    { icon: "key", time: at("11:00"), label: t.checkout },
    { icon: "door", time: `${at("15:00")} – ${at("21:00")}`, label: t.checkin },
    { icon: "phone", time: `${at("08:00")} – ${at("17:00")}`, label: t.zahra, phone: zahraPhone },
    { icon: "phone", time: `${at("17:00")} →`, label: t.mouad, phone: mouadPhone },
    // Yasmin, the last resort, appears once she is live (yasminPhone is only passed then).
    ...(yasminPhone ? [{ icon: "phone" as Icon, time: "24/7", label: t.yasmin, phone: yasminPhone }] : []),
    { icon: "moon", time: `${at("23:00")} – ${at("08:00")}`, label: t.quiet },
  ];

  return (
    <section id="glance-sheet" aria-labelledby="glance" className="mt-10 border border-[#2a2520]/10 p-6 md:p-8">
      <style>{`@media print{@page{margin:14mm}body *{visibility:hidden!important}#glance-sheet,#glance-sheet *{visibility:visible!important}#glance-sheet{position:absolute;left:0;top:0;width:100%;border:0!important;margin:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.glance-noprint{display:none!important}}`}</style>
      <h2 id="glance" className="font-serif text-[26px] md:text-3xl mb-1">{t.title}</h2>
      <p className="text-[15px] text-[#2a2520] mb-6">{houseNo} Derb Fhal Zefriti, Marrakech</p>

      {/* The way in */}
      <p className="text-[15px] text-[#2a2520] mb-4">{t.wayTitle}</p>
      <div className="relative grid grid-cols-3 items-start text-center">
        <svg className="absolute left-[16%] right-[16%] top-[18px] w-[68%] h-[4px]" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden>
          <path d="M0 2 H100" stroke={CLAY} strokeWidth="2" strokeDasharray="1 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {[
          { label: t.dropoff, svg: <path d="M4 16v-4l2-5h12l2 5v4zM4 16v2M20 16v2M7 12h10M8 16h.01M16 16h.01" /> },
          { label: t.walk, svg: <path d="M8 4c1.5 0 2 1.5 2 3.5S9.5 11 8 11 6 9.5 6 7.5 6.5 4 8 4zM7 13.5h2M16 9c1.5 0 2 1.5 2 3.5S17.5 16 16 16s-2-1.5-2-3.5S14.5 9 16 9zM15 18.5h2" /> },
          { label: t.door.replace("{no}", houseNo), svg: <path d="M6 20V10a6 6 0 0 1 12 0v10zM4 20h16M14 14h.01" /> },
        ].map((s, i) => (
          <div key={i} className="relative flex flex-col items-center gap-2 px-1">
            <span className="flex h-10 w-10 items-center justify-center bg-white" style={{ border: `1.5px solid ${CLAY}` }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={CLAY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{s.svg}</svg>
            </span>
            <span className="text-[14px] leading-snug" style={{ color: INK }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* The day at the house: a line from sun to moon */}
      <p className="text-[15px] text-[#2a2520] mt-8 mb-4">{t.dayTitle}</p>
      <ol className="relative ms-[11px] space-y-4 border-s-2 ps-6" style={{ borderImage: "linear-gradient(#E8A33D, #C2410C 55%, #3B4A6B) 1" }}>
        {day.map((d, i) => (
          <li key={i} className="relative">
            <span className="absolute -start-[37px] top-0 flex h-[26px] w-[26px] items-center justify-center bg-white">
              <Glyph name={d.icon} />
            </span>
            <span className="block text-[15px] font-medium tabular-nums" style={{ color: INK }}>{d.time}</span>
            <span className="block text-[15px] text-[#2a2520]">{d.label}{d.phone && <span className="block whitespace-nowrap tabular-nums">{d.phone}</span>}</span>
          </li>
        ))}
      </ol>
      <PrintSheet label={t.print} />
    </section>
  );
}
