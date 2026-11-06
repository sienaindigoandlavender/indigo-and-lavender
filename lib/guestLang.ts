// The languages the arrival pages speak (Yasmin's WhatsApp templates: en, fr, it, es, pt). Anything else gets English.
// Dates are written by hand (no locale APIs) so server and browser always agree.

export type Lang = "en" | "fr" | "it" | "es" | "pt";
export const LANGS: Lang[] = ["en", "fr", "it", "es", "pt"];

/** ops stores the guest's language as a word ("French", "Italiano", "es"…). */
export function langOf(v: string | null | undefined): Lang {
  const s = (v || "").trim().toLowerCase();
  if (/^(fr|french|fran[cç]ais)/.test(s)) return "fr";
  if (/^(it|italian|italiano)/.test(s)) return "it";
  if (/^(es|spanish|espa[nñ]ol|castellano)/.test(s)) return "es";
  if (/^(pt|portuguese|portugu[eê]s|brazilian)/.test(s)) return "pt";
  return "en";
}

const DAYS: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  it: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  pt: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
};
const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
};

/** "Saturday 5 December", "samedi 5 décembre", "sabato 5 dicembre", "sábado 5 de diciembre", "sábado, 5 de dezembro". */
export function longDate(ymd: string, lang: Lang = "en") {
  if (!ymd) return "";
  const d = new Date(`${ymd}T12:00:00Z`);
  const day = DAYS[lang][d.getUTCDay()];
  const month = MONTHS[lang][d.getUTCMonth()];
  if (lang === "es") return `${day} ${d.getUTCDate()} de ${month}`;
  if (lang === "pt") return `${day}, ${d.getUTCDate()} de ${month}`;
  return `${day} ${d.getUTCDate()} ${month}`;
}

/** 24-hour time for fr/it/es/pt, 3:30 PM for English. */
export function niceTime(t: string, lang: Lang = "en") {
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  if (lang !== "en") return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
