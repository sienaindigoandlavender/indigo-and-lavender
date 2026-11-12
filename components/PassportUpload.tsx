"use client";
// Passport photos on the keys page: pick or take photos, shrunk in the browser (1800px JPEG),
// sent to /api/passport with the signed link. On success the page reloads and shows ✓.
import { useRef, useState } from "react";

async function shrink(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    const s = Math.min(1, 1800 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85);
  } finally { URL.revokeObjectURL(url); }
}

export default function PassportUpload({ b, k, label, sending, failed }: { b: string; k: string; label: string; sending: string; failed: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  async function send(list: FileList | null) {
    if (!list?.length) return;
    setState("busy");
    try {
      // One photo per request: Vercel refuses bodies over 4.5 MB, and several phone photos
      // sent together went over it (12 Nov 2026), so the upload failed.
      for (const f of Array.from(list).slice(0, 10)) {
        const r = await fetch("/api/passport", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ b, k, files: [await shrink(f)] }) });
        if (!r.ok) throw new Error(String(r.status));
      }
      window.location.reload();
    } catch { setState("error"); }
  }
  return (
    <div className="keys-noprint space-y-2">
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => send(e.target.files)} />
      <button type="button" disabled={state === "busy"} onClick={() => input.current?.click()} className="inline-block px-6 py-3.5 bg-night text-limewash disabled:opacity-100 disabled:bg-ink">
        {state === "busy" ? sending : label}
      </button>
      {state === "error" && <p className="text-[17px] font-medium">{failed}</p>}
    </div>
  );
}
