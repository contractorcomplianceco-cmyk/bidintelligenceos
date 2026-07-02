import { Verdict, VERDICT_META } from "@core/roseos";

/* ------------------------------------------------------------------ */
/*  ROSEOS brand constants — rose sub-brand, distinct from             */
/*  VoiceConnect teal (#0BA3A8) and VideoConnect violet (#7C3AED).     */
/* ------------------------------------------------------------------ */

export const ROSE_COLOR = "#E11D48";
export const ROSE_COLOR_DARK = "#BE123C";

/* ------------------------------------------------------------------ */
/*  ROSEOS logo mark — layered "compass rose" of four petals rising    */
/*  above a base line (the layer above the modules).                   */
/* ------------------------------------------------------------------ */

export function RoseOsMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <rect x="4" y="26" width="24" height="3" rx="1.5" fill={ROSE_COLOR} opacity="0.25" />
      <rect x="7" y="21" width="18" height="3" rx="1.5" fill={ROSE_COLOR} opacity="0.45" />
      <path
        d="M16 2L19.5 9.5L27 13L19.5 16.5L16 24L12.5 16.5L5 13L12.5 9.5L16 2Z"
        fill={ROSE_COLOR}
      />
      <circle cx="16" cy="13" r="2.4" fill="white" />
    </svg>
  );
}

export function RoseOsLogo({
  size = 28,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <RoseOsMark size={size} />
      <span
        className={`font-bold tracking-tight leading-none ${dark ? "text-white" : "text-slate-900"}`}
        style={{ fontSize: size * 0.62 }}
      >
        ROSE<span style={{ color: ROSE_COLOR }}>OS</span>
      </span>
    </span>
  );
}

export function RoseOsBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
      style={{
        backgroundColor: "#FFF1F2",
        color: ROSE_COLOR_DARK,
        border: "1px solid #FECDD3",
      }}
    >
      <RoseOsMark size={10} />
      Intelligence Layer
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Verdict badge — GREEN LIGHT / YELLOW FLAG / RED ALERT              */
/* ------------------------------------------------------------------ */

export function VerdictBadge({
  verdict,
  size = "md",
}: {
  verdict: Verdict;
  size?: "sm" | "md";
}) {
  const meta = VERDICT_META[verdict];
  const sm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-full flex-shrink-0 ${
        sm ? "text-[8px] px-1.5 py-0.5" : "text-[9px] px-2 py-1"
      }`}
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
        border: `1px solid ${meta.border}`,
      }}
    >
      <span
        className={`rounded-full ${sm ? "w-1.5 h-1.5" : "w-2 h-2"}`}
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}
