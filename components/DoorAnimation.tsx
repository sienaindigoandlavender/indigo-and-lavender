// The big door of no. 37, animated: pull gently, turn the key once to the right, push.
// A placeholder until Zahra's video. Pure SVG + CSS, no JS. Calm, loops, and stops
// for people who prefer reduced motion (the three steps stay readable below it).

const CSS = `
.door-wrap{--clay:#C2410C;--ink:#2a2520}
.door-panel{transform-box:fill-box;transform-origin:0% 50%;animation:door-open 9s ease-in-out infinite}
.door-pull{animation:door-pull 9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 60%}
.door-key{opacity:0;transform-origin:150px 214px;animation:door-key 9s ease-in-out infinite}
.door-arrow-pull{opacity:0;animation:door-a1 9s ease-in-out infinite}
.door-arrow-push{opacity:0;animation:door-a3 9s ease-in-out infinite}
.door-light{opacity:0;animation:door-light 9s ease-in-out infinite}
.door-step{transition:color .4s;color:var(--ink)}
.door-step-1{animation:door-s1 9s infinite}
.door-step-2{animation:door-s2 9s infinite}
.door-step-3{animation:door-s3 9s infinite}
@keyframes door-pull{0%,4%{transform:scale(1)}12%,26%{transform:scale(1.025)}32%,100%{transform:scale(1)}}
@keyframes door-a1{0%,4%{opacity:0}10%,26%{opacity:1}31%,100%{opacity:0}}
@keyframes door-key{0%,30%{opacity:0;transform:rotate(0)}35%{opacity:1;transform:rotate(0)}45%,58%{opacity:1;transform:rotate(90deg)}64%,100%{opacity:0;transform:rotate(90deg)}}
@keyframes door-a3{0%,58%{opacity:0}63%,80%{opacity:1}86%,100%{opacity:0}}
@keyframes door-open{0%,60%{transform:scaleX(1)}78%,88%{transform:scaleX(.35)}97%,100%{transform:scaleX(1)}}
@keyframes door-light{0%,62%{opacity:0}78%,88%{opacity:1}97%,100%{opacity:0}}
@keyframes door-s1{0%,30%{color:var(--clay)}33%,100%{color:var(--ink)}}
@keyframes door-s2{0%,31%{color:var(--ink)}34%,58%{color:var(--clay)}61%,100%{color:var(--ink)}}
@keyframes door-s3{0%,59%{color:var(--ink)}62%,92%{color:var(--clay)}96%,100%{color:var(--ink)}}
@media (prefers-reduced-motion: reduce){
  .door-panel,.door-pull,.door-key,.door-arrow-pull,.door-arrow-push,.door-light,.door-step{animation:none!important}
  .door-step{color:var(--ink)}
}
`;

const STEPS: [string, string, string] = ["Pull the door gently towards you.", "Turn the key once to the right. Only once.", "Push, and you're home."];
const ARIA = "The door of no. 37: pull gently towards you, turn the key once to the right, then push.";

export default function DoorAnimation({ steps = STEPS, aria = ARIA }: { steps?: [string, string, string]; aria?: string }) {
  return (
    <div className="door-wrap">
      <style>{CSS}</style>
      <svg viewBox="0 0 300 360" className="w-full max-w-[280px] mx-auto block" role="img"
        aria-label={aria}>
        {/* wall */}
        <rect x="0" y="0" width="300" height="360" fill="#f3ece3" />
        {/* courtyard light behind the door */}
        <path className="door-light" d="M66 330 V120 Q150 30 234 120 V330 Z" fill="#fbe7c6" />
        <g className="door-pull">
          <g className="door-panel">
            {/* arched door */}
            <path d="M66 330 V120 Q150 30 234 120 V330 Z" fill="#6b4a33" stroke="#4a3222" strokeWidth="4" />
            <path d="M150 66 V330" stroke="#4a3222" strokeWidth="3" />
            {/* studs */}
            {[100, 140, 180, 220, 260, 300].map((y) =>
              [88, 122, 178, 212].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="#c9a66b" />)
            )}
            {/* ring handle */}
            <circle cx="172" cy="200" r="13" fill="none" stroke="#c9a66b" strokeWidth="4" />
            {/* keyhole */}
            <circle cx="150" cy="214" r="9" fill="#2a1d14" />
            <circle cx="150" cy="212" r="3" fill="#000" />
            {/* the key */}
            <g className="door-key">
              <rect x="146" y="176" width="8" height="38" rx="3" fill="#C2410C" />
              <circle cx="150" cy="172" r="10" fill="none" stroke="#C2410C" strokeWidth="5" />
            </g>
          </g>
        </g>
        {/* pull arrow (towards you) */}
        <g className="door-arrow-pull" stroke="#C2410C" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M150 265 v40" /><path d="M136 291 l14 14 l14 -14" />
        </g>
        {/* push arrow (into the house) */}
        <g className="door-arrow-push" stroke="#C2410C" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M150 305 v-40" /><path d="M136 279 l14 -14 l14 14" />
        </g>
        {/* threshold */}
        <rect x="56" y="330" width="188" height="10" fill="#d8cbb8" />
      </svg>
      <ol className="mt-6 space-y-2 text-[17px]">
        <li className="door-step door-step-1"><strong>1.</strong> {steps[0]}</li>
        <li className="door-step door-step-2"><strong>2.</strong> {steps[1]}</li>
        <li className="door-step door-step-3"><strong>3.</strong> {steps[2]}</li>
      </ol>
    </div>
  );
}
