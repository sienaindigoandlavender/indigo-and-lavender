"use client";

// The house calendar: the month grid of the Riad di Siena booking modal, used for
// every date on the site. Dates are plain "YYYY-MM-DD" strings built by hand in UTC
// (Morocco = UTC), with no locale APIs, so server and browser always agree.

import { useEffect, useRef, useState } from "react";

// Site colours, in one place.
const T = {
  ink: "text-foreground",
  paper: "bg-background",
  selected: "bg-foreground text-background",
  range: "bg-foreground/10",
  hover: "hover:bg-foreground/5",
  past: "bg-foreground/[0.06]",
  unavailable: "bg-foreground/10",
  rule: "border-foreground/10",
  legendSelected: "bg-foreground",
  legendUnavailable: "border border-foreground/20 bg-foreground/5",
  popover: "border border-foreground/15 shadow-lg",
  field:
    "w-full border-0 border-b border-foreground/30 bg-transparent px-0 py-3 text-left text-[18px] text-foreground focus:outline-none focus:border-foreground",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" from a year, a 0-based month and a day. */
export function ymd(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Today in Morocco (UTC) as "YYYY-MM-DD". */
export function todayYMD() {
  const d = new Date();
  return ymd(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Adds days to a "YYYY-MM-DD" string. */
export function addDaysYMD(s: string, days: number) {
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return ymd(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
}

/** "21 Oct 2026" from "2026-10-21". */
export function niceYMD(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return s;
  return `${d} ${SHORT_MONTHS[m - 1]} ${y}`;
}

function longLabel(year: number, month: number, day: number) {
  const dow = new Date(Date.UTC(year, month, day)).getUTCDay();
  return `${DAY_NAMES[dow]} ${day} ${MONTHS[month]} ${year}`;
}

function monthOf(s: string | undefined) {
  if (s && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m] = s.split("-").map(Number);
    return { year: y, month: m - 1 };
  }
  return null;
}

// ============================================================================
// THE MONTH GRID (the booking modal's calendar)
// ============================================================================

export function MonthCalendar({
  start = "",
  end = "",
  onSelect,
  min,
  max,
  isUnavailable,
  showLegend,
}: {
  /** Selected day, or check-in of a range. */
  start?: string;
  /** Check-out of a range. */
  end?: string;
  onSelect: (date: string) => void;
  /** Days before this are past: grey and not clickable; months before it are out of reach. */
  min?: string;
  /** Days after this are not clickable; months after it are out of reach. */
  max?: string;
  /** Booked or closed days: struck through and not clickable. */
  isUnavailable?: (date: string) => boolean;
  showLegend?: boolean;
}) {
  const [view, setView] = useState(() => monthOf(start) || monthOf(min) || monthOf(todayYMD())!);
  const { year, month } = view;

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const startingDay = new Date(Date.UTC(year, month, 1)).getUTCDay();

  const minMonth = monthOf(min);
  const maxMonth = monthOf(max);
  const canGoPrev = !minMonth || year * 12 + month > minMonth.year * 12 + minMonth.month;
  const canGoNext = !maxMonth || year * 12 + month < maxMonth.year * 12 + maxMonth.month;

  const go = (delta: number) => {
    const n = year * 12 + month + delta;
    setView({ year: Math.floor(n / 12), month: n % 12 });
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => canGoPrev && go(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className={`w-8 h-8 flex items-center justify-center ${T.ink} disabled:opacity-20 disabled:cursor-not-allowed transition-colors`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <polyline points="10,2 5,8 10,14" />
          </svg>
        </button>
        <span className={`text-sm tracking-wide ${T.ink}`} aria-live="polite">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => canGoNext && go(1)}
          disabled={!canGoNext}
          aria-label="Next month"
          className={`w-8 h-8 flex items-center justify-center ${T.ink} disabled:opacity-20 disabled:cursor-not-allowed transition-colors`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <polyline points="6,2 11,8 6,14" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <div key={day} className={`text-center text-[12px] tracking-wider ${T.ink} uppercase`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = ymd(year, month, day);
          const isPastDate = (!!min && dateStr < min) || (!!max && dateStr > max);
          const isBookedDate = !!isUnavailable?.(dateStr);
          const isStart = dateStr === start;
          const isEnd = dateStr === end;
          const isRange = !!start && !!end && dateStr > start && dateStr < end;
          const isDisabled = isPastDate || isBookedDate;

          return (
            <button
              type="button"
              key={day}
              onClick={() => !isDisabled && onSelect(dateStr)}
              disabled={isDisabled}
              aria-label={`${longLabel(year, month, day)}${isBookedDate && !isPastDate ? ", unavailable" : ""}`}
              aria-pressed={isStart || isEnd}
              className={`
                aspect-square flex items-center justify-center text-sm relative transition-all
                ${isDisabled ? "cursor-not-allowed" : `cursor-pointer ${T.hover}`}
                ${isStart || isEnd ? T.selected : ""}
                ${isRange ? T.range : ""}
                ${isPastDate ? T.past : ""}
                ${isBookedDate && !isPastDate ? "line-through" : ""}
                ${!isDisabled && !isStart && !isEnd && !isRange ? T.ink : ""}
              `}
            >
              <span className="relative z-10">{day}</span>
              {isBookedDate && !isPastDate && <div className={`absolute inset-0 ${T.unavailable}`} />}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className={`flex items-center gap-6 mt-6 pt-4 border-t ${T.rule}`}>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${T.legendSelected}`} />
            <span className={`text-[12px] tracking-wide ${T.ink} uppercase`}>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${T.legendUnavailable}`} />
            <span className={`text-[12px] tracking-wide ${T.ink} uppercase`}>Unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// THE FIELD: an underline that opens the calendar
// ============================================================================

export default function DatePicker({
  value,
  defaultValue,
  onChange,
  name,
  id,
  min,
  max,
  isDisabled,
  required,
  placeholder = "Choose a date",
  rangeWith,
  align = "left",
  ariaLabel,
  className,
}: {
  /** "YYYY-MM-DD" (controlled). */
  value?: string;
  /** "YYYY-MM-DD" (uncontrolled, for plain forms). */
  defaultValue?: string;
  onChange?: (date: string) => void;
  /** Form field name: the value is posted as "YYYY-MM-DD". */
  name?: string;
  id?: string;
  min?: string;
  max?: string;
  /** Booked or closed days. A legend shows when this is set. */
  isDisabled?: (date: string) => boolean;
  required?: boolean;
  placeholder?: string;
  /** The other end of a stay (check-in for a check-out field): drawn as a range. */
  rangeWith?: string;
  /** Which edge the calendar opens from. */
  align?: "left" | "right";
  ariaLabel?: string;
  /** Classes for the underline field, to match the form around it. */
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value !== undefined ? value : inner;
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("touchstart", away);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("touchstart", away);
    };
  }, [open]);

  const pick = (d: string) => {
    if (value === undefined) setInner(d);
    onChange?.(d);
    setOpen(false);
    field.current?.focus();
  };

  let start = current;
  let end = "";
  if (rangeWith && current) {
    start = rangeWith < current ? rangeWith : current;
    end = rangeWith < current ? current : rangeWith;
  }

  return (
    <div
      ref={wrap}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          field.current?.focus();
        }
      }}
    >
      <button
        ref={field}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel ? `${ariaLabel}${current ? `: ${niceYMD(current)}` : ""}` : undefined}
        onClick={() => setOpen((o) => !o)}
        className={className ?? T.field}
      >
        {current ? niceYMD(current) : <span className="italic">{placeholder || "\u00a0"}</span>}
      </button>
      {/* Carries the value into the form and keeps "required" working. */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={current}
        required={required}
        onChange={() => {}}
        onInvalid={() => setOpen(true)}
        className="absolute bottom-0 left-0 h-px w-px opacity-0 pointer-events-none"
      />
      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel || "Choose a date"}
          className={`absolute z-50 mt-2 ${align === "right" ? "right-0" : "left-0"} w-[18rem] max-w-[calc(100vw-2rem)] p-4 ${T.paper} ${T.popover}`}
        >
          <MonthCalendar start={start} end={end} onSelect={pick} min={min} max={max} isUnavailable={isDisabled} showLegend={!!isDisabled} />
        </div>
      )}
    </div>
  );
}
