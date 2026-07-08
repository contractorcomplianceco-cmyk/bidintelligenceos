export function DemoDataBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-amber-300/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
      {label}
    </span>
  );
}
