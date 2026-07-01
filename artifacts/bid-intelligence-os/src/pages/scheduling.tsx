import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/context";
import {
  scheduleDays,
  scheduleEvents as seedScheduleEvents,
  type ScheduleEvent,
  type ScheduleType,
  type ScheduleStatus,
} from "@/lib/operations";
import {
  CalendarDays,
  Users,
  HardHat,
  ClipboardCheck,
  FileCheck2,
  Truck,
  CloudRain,
  AlertTriangle,
  Clock,
  MapPin,
  CloudLightning,
  ShieldAlert,
  CalendarClock,
} from "lucide-react";

const TYPE_META: Record<
  ScheduleType,
  { label: string; color: string; bg: string; border: string; icon: typeof Users }
> = {
  Crew: { label: "Crew", color: "#38BDF8", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.35)", icon: Users },
  Sub: { label: "Sub", color: "#A78BFA", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.35)", icon: HardHat },
  Inspection: { label: "Inspection", color: "#22C55E", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.35)", icon: ClipboardCheck },
  Permit: { label: "Permit", color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.35)", icon: FileCheck2 },
  Delivery: { label: "Delivery", color: "#8A96B0", bg: "rgba(138,150,176,0.10)", border: "rgba(138,150,176,0.35)", icon: Truck },
  "Weather-Sensitive": { label: "Weather-Sensitive", color: "#0BA3A8", bg: "rgba(11,163,168,0.12)", border: "rgba(11,163,168,0.40)", icon: CloudRain },
};

const STATUS_META: Record<ScheduleStatus, { color: string; bg: string }> = {
  Scheduled: { color: "#38BDF8", bg: "rgba(56,189,248,0.12)" },
  "At Risk": { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  Rescheduled: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  Complete: { color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
};

const ALL_TYPES = Object.keys(TYPE_META) as ScheduleType[];

export default function Scheduling() {
  const { toast } = useToast();
  const { verticalConfig } = useAppContext();
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ScheduleStatus>>({});
  const [activeType, setActiveType] = useState<ScheduleType | "All">("All");

  const events: ScheduleEvent[] = useMemo(
    () =>
      seedScheduleEvents.map((e) => ({
        ...e,
        status: statusOverrides[e.id] ?? e.status,
      })),
    [statusOverrides],
  );

  const visibleEvents = useMemo(
    () => (activeType === "All" ? events : events.filter((e) => e.type === activeType)),
    [events, activeType],
  );

  const criticalEvents = useMemo(
    () => visibleEvents.filter((e) => e.critical && e.status !== "Complete"),
    [visibleEvents],
  );

  const atRiskCount = visibleEvents.filter((e) => e.status === "At Risk").length;
  const rescheduledCount = visibleEvents.filter((e) => e.status === "Rescheduled").length;

  const handleReschedule = (event: ScheduleEvent) => {
    setStatusOverrides((prev) => ({ ...prev, [event.id]: "Rescheduled" }));
    toast({
      title: "Rain delay applied",
      description: `${event.title} for ${event.jobName} marked Rescheduled. Crew and subs will be notified.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-[#38BDF8]" />
              Scheduling
            </h1>
            <p className="text-[#8A96B0] mt-1">
              Weekly operations calendar — {verticalConfig.name}. Crews, subs, inspections, permits, and weather-sensitive work in one view.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-[#1C253B] bg-[#0F1830] px-4 py-2 text-center">
              <div className="text-lg font-bold text-[#F59E0B]">{atRiskCount}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#8A96B0]">At Risk</div>
            </div>
            <div className="rounded-lg border border-[#1C253B] bg-[#0F1830] px-4 py-2 text-center">
              <div className="text-lg font-bold text-[#A78BFA]">{rescheduledCount}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#8A96B0]">Rescheduled</div>
            </div>
            <div className="rounded-lg border border-[#1C253B] bg-[#0F1830] px-4 py-2 text-center">
              <div className="text-lg font-bold text-[#EF4444]">{criticalEvents.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#8A96B0]">Critical Path</div>
            </div>
          </div>
        </div>

        {/* Critical-path warning banner */}
        {criticalEvents.length > 0 && (
          <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/[0.06] p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#EF4444] mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  Critical-path watch
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded">
                    {criticalEvents.length} events
                  </span>
                </div>
                <p className="text-xs text-[#8A96B0] mt-1 leading-relaxed">
                  {criticalEvents
                    .slice(0, 3)
                    .map((e) => `${e.title} (${scheduleDays[e.dayIndex]?.split(" ").slice(0, 2).join(" ")})`)
                    .join("  ·  ")}
                  {criticalEvents.length > 3 ? `  ·  +${criticalEvents.length - 3} more` : ""}
                </p>
                <p className="text-[11px] text-[#8A96B0]/70 mt-2 italic">
                  Decision-support guidance only. Confirm go/no-go with field leads before rescheduling.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Legend + Filter */}
        <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A96B0] mr-1">Filter</span>
          <button
            onClick={() => setActiveType("All")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              activeType === "All"
                ? "border-[#38BDF8] text-white bg-[#38BDF8]/10"
                : "border-[#2A3756] text-[#8A96B0] hover:text-white hover:border-[#38BDF8]/50"
            }`}
          >
            All
          </button>
          {ALL_TYPES.map((type) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            const active = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5"
                style={{
                  borderColor: active ? meta.color : "#2A3756",
                  color: active ? "#fff" : meta.color,
                  backgroundColor: active ? meta.bg : "transparent",
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Weekly grid */}
        <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-[#1C253B]">
                {scheduleDays.map((day, idx) => {
                  const [dow, ...rest] = day.split(" ");
                  const isToday = idx === 1;
                  return (
                    <div
                      key={day}
                      className={`px-3 py-3 text-center border-r border-[#1C253B] last:border-r-0 ${
                        isToday ? "bg-[#38BDF8]/[0.06]" : "bg-[#111A2E]"
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">{dow}</div>
                      <div className={`text-sm font-bold mt-0.5 ${isToday ? "text-[#38BDF8]" : "text-white"}`}>
                        {rest.join(" ")}
                      </div>
                      {isToday && (
                        <div className="text-[9px] font-bold uppercase tracking-widest text-[#38BDF8] mt-0.5">Today</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Day columns */}
              <div className="grid grid-cols-7">
                {scheduleDays.map((day, dayIndex) => {
                  const dayEvents = visibleEvents
                    .filter((e) => e.dayIndex === dayIndex)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));
                  const isToday = dayIndex === 1;
                  return (
                    <div
                      key={day}
                      className={`min-h-[360px] border-r border-[#1C253B] last:border-r-0 p-2 space-y-2 ${
                        isToday ? "bg-[#38BDF8]/[0.02]" : ""
                      }`}
                    >
                      {dayEvents.length === 0 && (
                        <div className="text-[10px] text-[#8A96B0]/50 text-center pt-6">No events</div>
                      )}
                      {dayEvents.map((event) => {
                        const meta = TYPE_META[event.type];
                        const Icon = meta.icon;
                        const status = STATUS_META[event.status];
                        const canReschedule =
                          (event.weatherSensitive || event.status === "At Risk") && event.status !== "Rescheduled";
                        return (
                          <div
                            key={event.id}
                            className="rounded-lg border p-2.5 bg-[#0F1830]"
                            style={{ borderColor: meta.border, borderLeftWidth: 3, borderLeftColor: meta.color }}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
                                <span className="text-xs font-semibold text-white leading-tight truncate">
                                  {event.title}
                                </span>
                              </div>
                              {event.critical && (
                                <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                              )}
                            </div>

                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#8A96B0]">
                              <Clock className="w-3 h-3" />
                              {event.startTime}–{event.endTime}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#8A96B0]">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.jobName}</span>
                            </div>
                            <div className="mt-0.5 text-[10px] text-[#8A96B0] truncate">{event.assignee}</div>

                            <div className="mt-2 flex flex-wrap items-center gap-1">
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{ color: status.color, backgroundColor: status.bg }}
                              >
                                {event.status}
                              </span>
                              {event.weatherSensitive && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[#0BA3A8] bg-[#0BA3A8]/10 flex items-center gap-0.5">
                                  <CloudRain className="w-2.5 h-2.5" /> Weather
                                </span>
                              )}
                              {event.permitDependent && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[#F59E0B] bg-[#F59E0B]/10">
                                  Permit
                                </span>
                              )}
                              {event.inspectionDependent && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[#22C55E] bg-[#22C55E]/10">
                                  Inspection
                                </span>
                              )}
                            </div>

                            {canReschedule && (
                              <button
                                onClick={() => handleReschedule(event)}
                                className="mt-2 w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded border border-[#2A3756] text-[#8A96B0] hover:text-white hover:border-[#0BA3A8]/60 hover:bg-[#0BA3A8]/[0.06] transition-colors"
                              >
                                <CloudLightning className="w-3 h-3" />
                                Rain delay / reschedule
                              </button>
                            )}
                            {event.status === "Rescheduled" && (
                              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#A78BFA]">
                                <CalendarClock className="w-3 h-3" />
                                Rescheduled
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#8A96B0]/70 italic">
          Weather-driven schedule changes are decision-support only. Review before sending client-facing updates.
        </p>
      </div>
    </Layout>
  );
}
