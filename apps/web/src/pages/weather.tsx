import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jobsiteWeather as seedWeather } from "@core/operations";
import type { WeatherCondition, RiskBand } from "@core/operations";
import { useAppContext } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useOpsWeather } from "@/hooks/use-ops";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  CalendarClock,
  AlertTriangle,
  Info,
  MapPin,
  ShieldAlert,
  CloudSun,
} from "lucide-react";

function conditionIcon(condition: WeatherCondition, className: string) {
  switch (condition) {
    case "Clear":
      return <Sun className={className} />;
    case "Partly Cloudy":
      return <CloudSun className={className} />;
    case "Cloudy":
      return <Cloud className={className} />;
    case "Rain":
      return <CloudRain className={className} />;
    case "Storms":
      return <CloudLightning className={className} />;
    case "Windy":
      return <Wind className={className} />;
    case "Hot":
      return <Thermometer className={className} />;
    default:
      return <Cloud className={className} />;
  }
}

function conditionColor(condition: WeatherCondition) {
  switch (condition) {
    case "Clear":
      return "text-[#F59E0B]";
    case "Partly Cloudy":
      return "text-[#0284C7]";
    case "Cloudy":
      return "text-slate-500";
    case "Rain":
      return "text-[#0284C7]";
    case "Storms":
      return "text-[#EF4444]";
    case "Windy":
      return "text-[#0284C7]";
    case "Hot":
      return "text-[#F59E0B]";
    default:
      return "text-slate-500";
  }
}

const RISK_STYLES: Record<RiskBand, { text: string; bg: string; border: string; bar: string; pct: number }> = {
  Low: { text: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/30", bar: "bg-[#22C55E]", pct: 25 },
  Moderate: { text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/30", bar: "bg-[#F59E0B]", pct: 55 },
  High: { text: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/30", bar: "bg-[#EF4444]", pct: 80 },
  Severe: { text: "text-[#EF4444]", bg: "bg-[#EF4444]/15", border: "border-[#EF4444]/40", bar: "bg-[#EF4444]", pct: 100 },
};

function RiskBadge({ label, band, icon: Icon }: { label: string; band: RiskBand; icon: React.ElementType }) {
  const s = RISK_STYLES[band];
  return (
    <div className={`rounded-lg border ${s.border} ${s.bg} p-3`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-3.5 h-3.5 ${s.text}`} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-sm font-bold ${s.text}`}>{band}</div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.pct}%` }} />
      </div>
    </div>
  );
}

export default function Weather() {
  const { verticalConfig } = useAppContext();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: liveSites } = useOpsWeather();
  const jobsiteWeather = live ? (liveSites ?? []) : seedWeather;
  const [rescheduled, setRescheduled] = useState<Record<string, boolean>>({});
  const liveForecastCount = jobsiteWeather.filter((s) => s.liveData).length;
  const placeholderCount = jobsiteWeather.length - liveForecastCount;

  if (live && jobsiteWeather.length === 0) {
    return (
      <Layout>
        <div className="space-y-6 max-w-[1600px] mx-auto">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <CloudRain className="h-7 w-7 text-[#0284C7]" />
              Weather Watch
            </h2>
            <p className="text-slate-500 mt-1.5">
              Live Open-Meteo forecasts keyed to active job site locations for {verticalConfig.name} operations.
            </p>
          </div>
          <OpsModuleEmpty
            module="No active jobsites"
            description="Record won jobs in deployment to monitor weather-sensitive work at each jobsite."
          />
        </div>
      </Layout>
    );
  }

  const highRiskSites = jobsiteWeather.filter(
    (s) => s.rainRisk === "High" || s.rainRisk === "Severe" || s.windRisk === "High" || s.windRisk === "Severe"
  );

  const handleReschedule = (site: string, task: string) => {
    const key = `${site}::${task}`;
    setRescheduled((prev) => ({ ...prev, [key]: true }));
    toast({
      title: "Task flagged for reschedule",
      description: `${task} at ${site} moved to the next clear window. Review before confirming with crews.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <CloudRain className="h-7 w-7 text-[#0284C7]" />
              Weather Watch
            </h2>
            <p className="text-slate-500 mt-1.5">
              {live
                ? "5-day Open-Meteo forecasts, weather-risk bands, and schedule impact for active jobsites."
                : `5-day jobsite forecasts, weather-risk bands, and schedule impact for active ${verticalConfig.name} operations.`}
            </p>
            {!live && <DemoDataBadge />}
            {live && jobsiteWeather.length > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                {liveForecastCount > 0
                  ? `${liveForecastCount} site${liveForecastCount === 1 ? "" : "s"} on live Open-Meteo feed`
                  : null}
                {liveForecastCount > 0 && placeholderCount > 0 ? " · " : null}
                {placeholderCount > 0
                  ? `${placeholderCount} site${placeholderCount === 1 ? "" : "s"} using placeholder (geocode unavailable)`
                  : null}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Sites Monitored</div>
            <div className="text-2xl font-bold text-slate-900">{jobsiteWeather.length}</div>
          </div>
        </div>

        {/* Vertical weather note */}
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 flex items-start gap-3">
          <CloudSun className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">{verticalConfig.name} Weather Exposure</div>
            <p className="text-sm text-slate-500 leading-snug">{verticalConfig.weatherNote}</p>
          </div>
        </div>

        {/* Rain-out alert lead */}
        {highRiskSites.length > 0 && (
          <div className="rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#EF4444]/15 p-2 shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">Rain-Out & High-Wind Alert</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/15 px-1.5 py-0.5 rounded">
                    Action Recommended
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-snug">
                  {highRiskSites.length} jobsite{highRiskSites.length > 1 ? "s have" : " has"} elevated weather risk this week.
                  {" "}
                  {highRiskSites.map((s) => s.jobName).join(", ")} — review weather-sensitive tasks and stage reschedules early.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Site cards */}
        <div className="space-y-6">
          {jobsiteWeather.map((site) => (
            <Card key={site.jobId} className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    {site.jobName}
                    {live && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          site.liveData
                            ? "text-[#22C55E] bg-[#22C55E]/10"
                            : "text-slate-500 bg-slate-100"
                        }`}
                      >
                        {site.liveData ? "Live forecast" : "Placeholder"}
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {site.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {conditionIcon(site.forecast[0].condition, `w-8 h-8 ${conditionColor(site.forecast[0].condition)}`)}
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900 leading-none">{site.forecast[0].high}&deg;</div>
                    <div className="text-[10px] text-slate-500">Today High</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Forecast row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {site.forecast.map((day) => (
                    <div
                      key={day.label}
                      className="rounded-lg border border-[#E2E8F0] bg-white p-3 flex flex-col items-center text-center"
                    >
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{day.label}</div>
                      {conditionIcon(day.condition, `w-7 h-7 mb-2 ${conditionColor(day.condition)}`)}
                      <div className="text-[10px] text-slate-500 mb-2">{day.condition}</div>
                      <div className="text-sm font-bold text-slate-900">
                        {day.high}&deg; <span className="text-slate-500 font-medium">/ {day.low}&deg;</span>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-3 text-[10px]">
                        <span className="flex items-center gap-0.5 text-[#0284C7]">
                          <Droplets className="w-3 h-3" />
                          {day.rainRisk}%
                        </span>
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <Wind className="w-3 h-3" />
                          {day.windMph}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risk bands */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <RiskBadge label="Rain Risk" band={site.rainRisk} icon={CloudRain} />
                  <RiskBadge label="Wind Risk" band={site.windRisk} icon={Wind} />
                  <RiskBadge label="Heat Risk" band={site.heatRisk} icon={Thermometer} />
                </div>

                {/* Recommendation + weather-sensitive tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#38BDF8]/25 bg-[#38BDF8]/5 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CalendarClock className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-widest">Recommendation</span>
                    </div>
                    <p className="text-sm text-slate-900 leading-snug">{site.recommendation}</p>
                  </div>

                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Weather-Sensitive Tasks
                      </span>
                    </div>
                    <div className="space-y-2">
                      {site.weatherSensitiveTasks.map((task) => {
                        const isDone = rescheduled[`${site.jobName}::${task}`];
                        return (
                          <div
                            key={task}
                            className="flex items-center justify-between gap-3 rounded border border-[#E2E8F0] bg-white px-3 py-2"
                          >
                            <span className={`text-sm ${isDone ? "text-slate-500 line-through" : "text-slate-900"}`}>{task}</span>
                            {isDone ? (
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                                Rescheduled
                              </span>
                            ) : (
                              <button
                                onClick={() => handleReschedule(site.jobName, task)}
                                className="text-[10px] font-semibold text-[#0284C7] hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1"
                              >
                                <CalendarClock className="w-3 h-3" />
                                Reschedule
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guardrail note */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <p className="text-[11px] text-slate-500">
            {live
              ? "Live forecasts from Open-Meteo (no API key) keyed to job site city/state. Decision-support only — verify conditions before committing crews or equipment."
              : "Forecast data is decision-support guidance only. Projections require user verification before committing crews or equipment."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
