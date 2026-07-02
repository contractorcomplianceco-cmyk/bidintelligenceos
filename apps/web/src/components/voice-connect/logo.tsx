export function VoiceConnectMark({ className = "" }: { className?: string }) {
  const bars = [
    { x: 1, h: 9 },
    { x: 6, h: 19 },
    { x: 11, h: 28 },
    { x: 16, h: 15 },
    { x: 21, h: 22 },
  ];
  return (
    <svg viewBox="0 0 56 32" fill="none" className={className} aria-hidden="true">
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={(32 - b.h) / 2}
          width="3"
          height={b.h}
          rx="1.5"
          fill="currentColor"
        />
      ))}
      <g stroke="#0BA3A8" strokeWidth="1.8" strokeLinecap="round">
        <line x1="28" y1="16" x2="41" y2="7" />
        <line x1="28" y1="16" x2="41" y2="25" />
        <line x1="41" y1="7" x2="41" y2="25" />
        <line x1="41" y1="7" x2="53" y2="16" />
        <line x1="41" y1="25" x2="53" y2="16" />
      </g>
      <g fill="#0BA3A8">
        <circle cx="28" cy="16" r="2.6" />
        <circle cx="41" cy="7" r="3.4" />
        <circle cx="41" cy="25" r="3.4" />
        <circle cx="53" cy="16" r="3.4" />
      </g>
    </svg>
  );
}

export function VoiceConnectWordmark({
  className = "",
  markClassName = "h-6 w-auto text-white",
  textClassName = "text-base",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <VoiceConnectMark className={markClassName} />
      <span className={`font-bold tracking-tight text-white leading-none ${textClassName}`}>
        Voice<span className="text-[#0BA3A8]">Connect</span>
        <span className="align-super text-[0.55em] text-[#0BA3A8] ml-0.5">™</span>
      </span>
    </div>
  );
}
