// The Douaria's footer (copied from the-douaria/components/Footer.tsx), shown only when a page is served through
// ii.riaddisiena.com for Booking.com guests. Links are absolute so they stay on ii.
const II = "https://ii.riaddisiena.com";
const link = "text-ink text-sm hover:underline underline-offset-4";

export default function IIFooter() {
  return (
    <footer className="text-ink print:hidden">
      <div className="bg-[#e8e0d4]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2 md:col-span-2">
              <span className="flex flex-col items-start leading-tight mb-3">
                <span className="text-sm tracking-[0.3em] font-light">THE</span>
                <span className="text-sm tracking-[0.3em] font-light">DOUARIA</span>
              </span>
              <p className="text-sm leading-relaxed max-w-xs mb-0">Old walls, steady and sure. A small house that keeps you safe from the city&apos;s rush.</p>
              <p className="text-sm leading-relaxed mt-4 mb-0">35 Derb Fhal Zefriti, Laksour<br />Medina, Marrakech</p>
            </div>
            <div>
              <span className="text-xs tracking-widest mb-4 block">STAY</span>
              <ul className="space-y-1.5">
                {[["The House", "/the-house"], ["Philosophy", "/philosophy"], ["Amenities", "/amenities"], ["Rooms", "/rooms"]].map(([t, h]) => (
                  <li key={h}><a href={`${II}${h}`} className={link}>{t}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-xs tracking-widest mb-4 block">EXPERIENCE</span>
              <ul className="space-y-1.5">
                {[["The Medina", "/the-medina"], ["Dinners", "/dinners"], ["The Sahara", "/sahara"], ["Day Trips", "/day-trips"], ["Morocco", "https://www.slowmorocco.com"]].map(([t, h]) => (
                  <li key={h}><a href={h.startsWith("http") ? h : `${II}${h}`} className={link}>{t}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-xs tracking-widest mb-4 block">LEARN</span>
              <ul className="space-y-1.5">
                {[["Derb.so", "https://derb.so"], ["Darija.io", "https://darija.io"], ["Amazigh.online", "https://www.amazigh.online"], ["Tsawer", "https://www.tsawer.org/"]].map(([t, h]) => (
                  <li key={h}><a href={h} className={link}>{t}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-xs tracking-widest mb-4 block">GOOD TO KNOW</span>
              <ul className="space-y-1.5">
                {[["Contact Us", "/contact"], ["Before You Book", "/before-you-book"], ["House Rules", "/house-rules"]].map(([t, h]) => (
                  <li key={h}><a href={`${II}${h}`} className={link}>{t}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#d2c9bb]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between gap-3 text-xs tracking-wide">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <a href={`${II}/booking-conditions`} className="hover:underline">Booking conditions</a>
            <a href={`${II}/house-rules`} className="hover:underline">House rules</a>
          </div>
          <span>© {new Date().getFullYear()} The Douaria</span>
        </div>
      </div>
    </footer>
  );
}
