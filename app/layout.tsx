import type { Metadata } from "next";
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
      <body className="bg-limewash text-ink">{children}</body>
    </html>
  );
}
