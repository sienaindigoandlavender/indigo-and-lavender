export const metadata = { title: "Dinners" };

const WA = `https://wa.me/212619112008?text=${encodeURIComponent("Hello Zahra, I'd like to reserve dinner at the house.")}`;

export default function Dinners() {
  return (
    <main className="night bg-night text-limewash min-h-screen px-5 md:px-10 lg:px-14 py-20 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <p className="house italic text-candle text-xl mb-6">Dinners</p>
        <h1 className="house font-light text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.03] tracking-[-0.03em]">A menu from the morning market, cooked by Zahra</h1>
        <p className="mt-8 text-[1.2rem] leading-[1.75] max-w-[60ch]">
          Three courses, traditional, made from what came from the market that morning. Zahra cooks the way she cooks breakfast: by hand, from the season. Served in the courtyard, by candlelight, for guests staying with us.
        </p>
        <div className="mt-16 grid md:grid-cols-3 gap-12">
          <div><p className="house italic text-candle text-lg mb-3">To start</p><p className="house font-light text-[1.8rem] leading-[1.15]">Seasonal vegetables and Moroccan salads</p></div>
          <div><p className="house italic text-candle text-lg mb-3">Tagine, your choice of</p><p className="house font-light text-[1.8rem] leading-[1.15]">Chicken and lemon</p><p className="house italic my-2">or</p><p className="house font-light text-[1.8rem] leading-[1.15]">Beef and dried prunes</p></div>
          <div><p className="house italic text-candle text-lg mb-3">To finish</p><p className="house font-light text-[1.8rem] leading-[1.15]">Orange with cinnamon</p></div>
        </div>
        <dl className="mt-16 grid sm:grid-cols-3 gap-8 border-t border-limewash/30 pt-10 text-[1.1rem]">
          <div><dt className="house italic text-candle mb-2">Price</dt><dd>250 MAD a person</dd></div>
          <div><dt className="house italic text-candle mb-2">For</dt><dd>Guests staying with us</dd></div>
          <div><dt className="house italic text-candle mb-2">Diets and allergies</dt><dd>Vegetarian, vegan or gluten-free on request. Tell Zahra when you reserve.</dd></div>
        </dl>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
          <a href={WA} className="btn-door">Reserve with Zahra on WhatsApp</a>
          <p className="text-base max-w-[38ch] mb-0">All proceeds from dinners go to Zahra and her team.</p>
        </div>
      </div>
    </main>
  );
}
