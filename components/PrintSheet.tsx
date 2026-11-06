"use client";

/** Opens the browser's print dialog; "Save as PDF" is one of its choices. */
export default function PrintSheet({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="glance-noprint mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[15px]"
      style={{ border: "1px solid #C2410C", color: "#C2410C" }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z" />
      </svg>
      {label}
    </button>
  );
}
