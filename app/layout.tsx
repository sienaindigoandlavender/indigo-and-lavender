import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import IIFooter from "@/components/IIFooter";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Indigo & Lavender", template: "%s" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-limewash text-ink">
        {children}
        {headers().get("x-via") === "ii" ? <IIFooter /> : null}
        {/* Jacqueline's secret door (10 Nov 2026), as on riaddisiena.com: two small dots, bottom right,
            to copy the directions fast. First = No. 37, second = No. 35. */}
        {headers().get("x-via") !== "ii" && <footer className="flex justify-end gap-2 px-6 py-4 print:hidden">
          <Link href="/the-riad/directions" className="w-2.5 h-2.5 rounded-full bg-ink/20 hover:bg-ink/40 transition-colors" aria-label="Directions to No. 37" />
          <Link href="/the-douaria/directions" className="w-2.5 h-2.5 rounded-full bg-ink/20 hover:bg-ink/40 transition-colors" aria-label="Directions to No. 35" />
        </footer>}
      </body>
    </html>
  );
}
