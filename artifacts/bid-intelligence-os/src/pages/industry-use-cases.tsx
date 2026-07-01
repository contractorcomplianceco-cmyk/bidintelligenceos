import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import { activateOnKey } from "@/lib/a11y";
import {
  INDUSTRY_USE_CASES,
  IndustryUseCase,
  IndustryIconKey,
  useCaseIdForVertical,
} from "@/lib/industry-use-cases";
import {
  Factory,
  Home,
  CloudLightning,
  Building2,
  Wind,
  Mountain,
  Zap,
  Droplets,
  Wrench,
  ShieldCheck,
  Settings2,
  AlertTriangle,
  Sparkles,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const ICON_MAP: Record<IndustryIconKey, typeof Factory> = {
  roofing: Home,
  storm: CloudLightning,
  gc: Building2,
  hvac: Wind,
  engineering: Mountain,
  electrical: Zap,
  plumbing: Droplets,
  facility: Wrench,
  insurance: ShieldCheck,
  custom: Settings2,
};

export default function IndustryUseCases() {
  const { vertical } = useAppContext();

  const defaultId = useMemo(() => {
    const mappedId = useCaseIdForVertical(vertical);
    const match = INDUSTRY_USE_CASES.find((i) => i.id === mappedId);
    return match ? match.id : INDUSTRY_USE_CASES[0].id;
  }, [vertical]);

  const [activeId, setActiveId] = useState<string>(defaultId);

  const active =
    INDUSTRY_USE_CASES.find((i) => i.id === activeId) ?? INDUSTRY_USE_CASES[0];

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <Factory className="h-7 w-7 text-[#38BDF8]" />
              Industry Use Cases
            </h2>
            <p className="text-[#8A96B0] mt-2 max-w-2xl">
              BidIntelligenceOS adapts to how your trade actually works. Explore the pain
              points we target, the features that address them, and what the Command Center
              emphasizes for each industry.
            </p>
          </div>
          <div className="rounded-lg border border-[#1C253B] bg-[#0F1830] px-4 py-2.5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
              Industries
            </div>
            <div className="text-2xl font-bold text-white">{INDUSTRY_USE_CASES.length}</div>
          </div>
        </div>

        {/* Industry selector chips */}
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_USE_CASES.map((industry) => {
            const Icon = ICON_MAP[industry.icon];
            const selected = industry.id === activeId;
            return (
              <button
                key={industry.id}
                onClick={() => setActiveId(industry.id)}
                aria-pressed={selected}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors ${
                  selected
                    ? "border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8]"
                    : "border-[#1C253B] bg-[#0F1830] text-[#8A96B0] hover:text-white hover:border-[#2A3756]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {industry.name}
              </button>
            );
          })}
        </div>

        {/* Active industry detail */}
        <ActiveIndustry industry={active} />

        {/* All industries grid */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#5b6680] mb-3">
            All Industries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {INDUSTRY_USE_CASES.map((industry) => {
              const Icon = ICON_MAP[industry.icon];
              const selected = industry.id === activeId;
              return (
                <Card
                  key={industry.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveId(industry.id)}
                  onKeyDown={activateOnKey(() => setActiveId(industry.id))}
                  className={`cursor-pointer transition-colors bg-[#0F1830] ${
                    selected
                      ? "border-[#38BDF8]/40"
                      : "border-[#1C253B] hover:border-[#2A3756]"
                  }`}
                >
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="flex items-center gap-3 text-white text-base">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20">
                        <Icon className="w-5 h-5 text-[#38BDF8]" />
                      </span>
                      {industry.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-[12px] text-[#8A96B0] leading-snug">
                      {industry.tagline}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {industry.features.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center rounded bg-[#111A2E] border border-[#1C253B] px-1.5 py-0.5 text-[10px] font-medium text-[#c3ccdd]"
                        >
                          {f}
                        </span>
                      ))}
                      {industry.features.length > 3 && (
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium text-[#8A96B0]">
                          +{industry.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-[#8A96B0] flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Industry configurations tailor labels, workflows, and dashboard focus. AI outputs
          remain decision support and require user verification.
        </p>
      </div>
    </Layout>
  );
}

function ActiveIndustry({ industry }: { industry: IndustryUseCase }) {
  const Icon = ICON_MAP[industry.icon];
  return (
    <Card className="bg-[#0F1830] border-[#1C253B] overflow-hidden">
      <CardHeader className="p-5 border-b border-[#1C253B]">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20">
            <Icon className="w-6 h-6 text-[#38BDF8]" />
          </span>
          <div>
            <CardTitle className="text-white text-xl">{industry.name}</CardTitle>
            <p className="text-[13px] text-[#8A96B0] mt-1 max-w-2xl">{industry.tagline}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Pain points */}
          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A96B0] mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              Pain Points
            </h4>
            <ul className="space-y-2">
              {industry.painPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] text-[#c3ccdd]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A96B0] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              How We Help
            </h4>
            <ul className="space-y-2">
              {industry.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[#c3ccdd]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard shows */}
          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A96B0] mb-3">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#A855F7]" />
              Command Center Shows
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industry.dashboardShows.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-md bg-[#111A2E] border border-[#1C253B] px-2 py-1 text-[11px] font-medium text-[#c3ccdd]"
                >
                  <ArrowRight className="w-3 h-3 text-[#A855F7]" />
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
