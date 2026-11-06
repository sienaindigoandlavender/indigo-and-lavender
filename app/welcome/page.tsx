// /welcome (neutral copy of the house welcome page; data from /api/welcome-data): the guest's arrival companion, sent by Yasmin 3 days before check-in.
//  - Personal: /welcome?b=<booking id>&k=<signature> (same signature as /arrival)
//    shows their name, dates, house, room and arrival time.
//  - Plain: /welcome (main riad) or /welcome?house=douaria.
// The house look: a full photo to open, then the stay told in order, day into
// night (limewash, tadelakt, candlelit night), straight corners, full-ink text.
// No key-box codes here (they come on WhatsApp).
// Edit the words in this file; the door animation is components/DoorAnimation.tsx;
// the drawings are public/drawings/*.svg.

import DoorAnimation from "@/components/DoorAnimation";
import AtAGlance from "@/components/AtAGlance";
import { UPSTREAM } from "@/lib/upstream";
import { LANGS, langOf, longDate, niceTime as fmtTime, type Lang } from "@/lib/guestLang";
import { W } from "./strings";

export const dynamic = "force-dynamic";

const ZAHRA_WA = "https://wa.me/212619112008";
const ZAHRA = "+212 6 19 11 20 08";
const MOUAD = "+212 6 66 23 71 73";
const YASMIN = "+212 7 18 87 15 29"; // the AI assistant, shown once YASMIN_LIVE=true

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

/** Our own copy with a few <b> tags; never guest input. */
const Html = ({ s }: { s: string }) => <span dangerouslySetInnerHTML={{ __html: s }} />;

type Tone = "lime" | "plaster" | "night";
const TONE: Record<Tone, string> = {
  lime: "bg-limewash text-ink",
  plaster: "bg-tadelakt text-ink",
  night: "night bg-night text-limewash",
};

/** One chapter of the stay: its number (the stay is told in order), a large title, the words. */
function Section({ id, n, title, tone = "lime", drawing, children }: { id: string; n: number; title: string; tone?: Tone; drawing?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-24 ${TONE[tone]}`}>
      <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
        {/* A small ink-and-wash drawing of the moment (public/drawings), decorative. */}
        {drawing && <img src={drawing} alt="" aria-hidden className="block w-full max-w-[460px] mb-6 -ms-2 select-none" draggable={false} />}
        <p className={`house italic text-lg mb-2 ${tone === "night" ? "text-candle" : "text-bejmat"}`}>{n}</p>
        <h2 className="house font-light text-[clamp(2.3rem,8vw,3.4rem)] leading-[1.02] tracking-[-0.03em] mb-8">{title}</h2>
        <div className="space-y-5 text-[18px] leading-[1.7]">{children}</div>
      </div>
    </section>
  );
}

function Pill({ href, children, solid }: { href: string; children: React.ReactNode; solid?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-block px-6 py-3.5 text-[16px] no-underline ${solid ? "bg-door text-ink hover:bg-[#F1E2AE]" : "border border-current"}`}
    >
      {children}
    </a>
  );
}

/** A date set large: the day number big, the rest of the date beside it. */
function BigDate({ label, ymd, lang, extra }: { label: string; ymd: string; lang: Lang; extra?: string }) {
  const day = ymd ? String(Number(ymd.slice(8, 10))) : "";
  return (
    <div>
      <p className="text-[15px] mb-1">{label}</p>
      <p className="flex items-end gap-3">
        <span className="house font-light text-[64px] leading-[0.8] tracking-[-0.04em]">{day}</span>
        <span className="text-[16px] leading-snug pb-1">{longDate(ymd, lang)}{extra || ""}</span>
      </p>
    </div>
  );
}

// The key pack, on the welcome page so guests have it before they travel (Yasmin sends this page 3 days before).
const KEYS: Record<Lang, { title: string; body: string; button: string }> = {
  en: { title: "Your keys", body: "The key-box code, your room and the way, on one page. Save it as a PDF before you travel: it works without internet.", button: "Open your keys" },
  fr: { title: "Vos clés", body: "Le code de la boîte à clé, votre chambre et le chemin, sur une seule page. Enregistrez-la en PDF avant de partir : elle marche sans internet.", button: "Ouvrir vos clés" },
  it: { title: "Le chiavi", body: "Il codice della scatola, la camera e la strada, in una pagina. La salvi in PDF prima di partire: funziona senza internet.", button: "Apri le chiavi" },
  es: { title: "Sus llaves", body: "El código de la caja, su habitación y el camino, en una sola página. Guárdela en PDF antes de viajar: funciona sin internet.", button: "Abrir sus llaves" },
  pt: { title: "As suas chaves", body: "O código da caixa, o quarto e o caminho, numa só página. Guarde-a em PDF antes de viajar: funciona sem internet.", button: "Abrir as chaves" },
};

export default async function WelcomePage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = searchParams;
  const data = await fetch(`${UPSTREAM}/api/welcome-data?b=${encodeURIComponent(q.b || "")}&k=${encodeURIComponent(q.k || "")}`, { cache: "no-store" })
    .then((r) => r.json()).catch(() => ({ guest: null, photo: {} }));
  const g = data.guest as null | { booking_id: string; first_name: string; room: string; property: string; source: string; language: string; check_in: string; check_out: string; arrival: string };
  const signed = q.b && q.k ? `b=${encodeURIComponent(q.b)}&k=${encodeURIComponent(q.k)}` : "";

  const roomRaw = (g?.room || "").split("/")[0].trim();
  const douaria = g ? isDouaria(`${g.property || ""} ${g.room || ""}`) : q.house === "douaria" || q.building === "annex";
  const room = ROOMS[roomRaw.toLowerCase()];
  const wholeHouse = douaria && /whole house/i.test(g?.room || "");
  const airbnb = /airbnb/i.test(g?.source || "");
  const arrival = g?.arrival || "";
  const first = (g?.first_name || "").trim().split(/\s+/)[0];
  const lang: Lang = LANGS.includes(q.lang as Lang) ? (q.lang as Lang) : langOf(g?.language);
  const t = W[lang];
  const niceDate = (ymd: string) => longDate(ymd, lang);
  const niceTime = (x: string) => fmtTime(x, lang);
  const langHref = (l: Lang) => {
    const p = new URLSearchParams();
    for (const k of ["b", "k", "house", "building"]) if (q[k]) p.set(k, q[k] as string);
    p.set("lang", l);
    return `/welcome?${p.toString()}`;
  };

  const lq = lang !== "en" ? `lang=${lang}` : "";
  const house = douaria
    ? { name: t.douaria, no: "35", directions: `/the-douaria/directions${lq ? `?${lq}` : ""}` }
    : { name: t.mainRiad, no: "37", directions: `/the-riad/directions${lq ? `?${lq}` : ""}` };

  const nav = (["arrive", "door", "breakfast", "dinner", "house", "leaving", "zahra"] as const).map((id) => [id, id === "dinner" ? t.dinnerTitle : t.nav[id]]);

  // The opening photo: the Douaria's for its guests, the courtyard for everyone else.
  const raw = (douaria ? data.photo?.douaria : "") || data.photo?.main || "";
  const photo = /riad-?di-?siena/i.test(raw) ? `/api/img?u=${encodeURIComponent(raw)}` : raw;

  return (
    <div className="min-h-screen bg-limewash text-ink">
      {/* Hello: the house fills the screen, the guest's name on it */}
      <section className="night relative min-h-[88svh] bg-night text-limewash overflow-hidden">
        {photo && (
          <>
            <img src={photo} alt={house.name} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-night/10" />
          </>
        )}
        <div className="relative mx-auto max-w-xl min-h-[88svh] px-6 pt-28 pb-12 flex flex-col justify-end">
          <div className="mb-auto flex items-center gap-2 text-[15px]">
            Derb Fhal Zefriti
            <span className="ms-auto flex gap-3 text-[14px]">
              {LANGS.map((l) => (
                <a key={l} href={langHref(l)} className={l === lang ? "underline underline-offset-4" : "no-underline"} aria-current={l === lang ? "true" : undefined}>{l.toUpperCase()}</a>
              ))}
            </span>
          </div>
          <h1 className="house font-light text-[clamp(3rem,13vw,5.2rem)] leading-[0.92] tracking-[-0.04em]">
            {first ? t.hello.replace("{name}", first) : t.helloPlain}
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed">{t.intro}</p>
        </div>
      </section>

      {/* Your stay: the dates large, the house number as the landmark */}
      {g && (
        <section className="bg-limewash">
          <div className="mx-auto max-w-xl px-6 py-12 grid grid-cols-[1fr_auto] gap-x-6 gap-y-8 border-b border-ink/15">
            <div className="space-y-7">
              <BigDate label={t.arriving} ymd={g.check_in || ""} lang={lang} extra={arrival ? t.around.replace("{time}", niceTime(arrival)) : ""} />
              <BigDate label={t.leaving} ymd={g.check_out || ""} lang={lang} extra={t.before11} />
            </div>
            <div className="text-right">
              <p className="text-[15px] mb-1">{t.yourHouse}</p>
              <p className="house font-light text-bejmat text-[96px] leading-[0.8] tracking-[-0.05em]">{house.no}</p>
              <p className="text-[15px] mt-2 leading-snug">{house.name}<br />Derb Fhal Zefriti</p>
            </div>
            {(roomRaw || wholeHouse) && (
              <p className="col-span-2 text-[17px]">
                <span className="house italic text-bejmat me-2">{t.yourRoom}</span>
                {wholeHouse ? t.wholeHouse : `${roomRaw}${room ? ` (${room.no}), ${t.floor[room.floor]}` : ""}`}
              </p>
            )}
          </div>
          {!arrival && (
            <div className="mx-auto max-w-xl px-6 pt-8">
              <p className="text-[17px] mb-3">{t.noTime}</p>
              <Pill href={`/arrival?${signed}${lang !== "en" ? `&lang=${lang}` : ""}`} solid>{t.confirmTime}</Pill>
            </div>
          )}
        </section>
      )}

      {g && (
        <section className="night bg-night text-limewash">
          <div className="mx-auto max-w-xl px-6 py-10">
            <h2 className="house font-light text-[clamp(2rem,7vw,2.6rem)] leading-tight mb-3">{KEYS[lang].title}</h2>
            <p className="text-[18px] leading-relaxed mb-6">{KEYS[lang].body}</p>
            <Pill href={`/keys?${signed}${lang !== "en" ? `&lang=${lang}` : ""}`} solid>{KEYS[lang].button}</Pill>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-xl px-6 pb-4">
        <AtAGlance t={t.glance} lang={lang} houseNo={house.no} zahraPhone={ZAHRA} mouadPhone={MOUAD} yasminPhone={process.env.YASMIN_LIVE === "true" ? YASMIN : undefined} />
      </div>

      {/* The chapters, in order, stuck to the top while you read */}
      <nav className="sticky top-[72px] z-30 bg-limewash/95 backdrop-blur-sm border-y border-ink/15 mt-10">
        <div className="mx-auto max-w-xl px-6 flex gap-5 overflow-x-auto scrollbar-hide py-3 text-[15px]">
          {nav.map(([id, label], i) => (
            <a key={id} href={`#${id}`} className="shrink-0 no-underline hover:underline underline-offset-4">
              <span className="house italic text-bejmat me-1.5">{i + 1}</span>{label}
            </a>
          ))}
        </div>
      </nav>

      <Section id="arrive" n={1} title={t.arriveTitle} drawing="/drawings/arriving.svg">
        <p><Html s={t.arrive1} /></p>
        <p>{t.arrive2}</p>
        <Pill href={house.directions} solid>{t.wayButton}</Pill>
        <p className="text-[16px]">{t.noMaps}</p>
        <p>{t.arrive3}</p>
        <p className="text-[16px]">{t.airport}</p>
      </Section>

      <Section id="door" n={2} title={douaria ? t.doorsTitle : t.doorTitle} tone="plaster">
        <p>{douaria ? t.doorDouaria : t.doorMain}</p>
        <DoorAnimation steps={t.doorSteps} aria={t.doorAria} />
        <p className="text-[16px]">{t.doorAfter}</p>
        {/* Wrida on the wall, keeping an eye on the door. */}
        <img src="/drawings/wrida-wall.svg" alt="" aria-hidden draggable={false} className="block w-40 md:w-48 ms-auto mt-4 select-none" />
      </Section>

      <Section id="breakfast" n={3} title={t.breakfastTitle} drawing="/drawings/breakfast.svg">
        <p>{t.breakfast1}</p>
        <img src="/drawings/jams.svg" alt="" aria-hidden className="block w-full my-2 select-none" draggable={false} />
        <p><Html s={t.breakfast2} /></p>
        <div className="border-t border-ink/15 pt-6">
          <h3 className="house text-[24px] mb-3">{t.requestsTitle}</h3>
          <ul className="list-none pl-0 border-t border-ink/15">
            {t.requests.map((r) => (
              <li key={r} className="py-3 border-b border-ink/15"><Html s={r} /></li>
            ))}
          </ul>
          <div className="mt-5"><Pill href={ZAHRA_WA} solid>{t.zahraButton}</Pill></div>
        </div>
      </Section>

      <Section id="dinner" n={4} title={t.dinnerTitle} tone="night">
        <p>{t.dinner}</p>
        <p>{t.dinnerDiet}</p>
        <div className="flex flex-wrap gap-3">
          <Pill href={ZAHRA_WA} solid>{t.zahraButton}</Pill>
          <Pill href="/the-riad/dinners">{t.dinnerButton}</Pill>
        </div>
      </Section>

      <Section id="house" n={5} title={t.houseTitle} tone="plaster">
        <p>{t.house1}</p>
        <ul className="list-none pl-0 border-t border-ink/15">
          {t.rules.map((r) => <li key={r} className="py-3 border-b border-ink/15">{r}</li>)}
          {douaria && <li className="py-3 border-b border-ink/15">{t.humidity}</li>}
        </ul>
        <p>{airbnb ? t.passportAirbnb : t.passport}</p>
      </Section>

      <Section id="leaving" n={6} title={t.leavingTitle}>
        <p><Html s={t.leaving1} /></p>
        <p>{t.leaving2}</p>
      </Section>

      <Section id="zahra" n={7} title={t.zahraTitle} tone="night">
        <p>{t.zahra1}</p>
        <Pill href={ZAHRA_WA} solid>{t.zahraButton}</Pill>
        <p className="text-[16px]">{ZAHRA}</p>
        <p>{t.zahra2}</p>
        <p className="text-[16px]">
          {t.mouad} <a href={`tel:${MOUAD.replace(/\s/g, "")}`} className="underline underline-offset-4 text-candle">{MOUAD}</a>.
        </p>
        <div className="pt-14 text-center">
          <p className="house italic font-light text-[clamp(1.8rem,7vw,2.6rem)] leading-tight">{t.until}</p>
        </div>
      </Section>
    </div>
  );
}
