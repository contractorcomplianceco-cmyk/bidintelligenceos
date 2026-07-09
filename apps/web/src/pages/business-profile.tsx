import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { VERTICALS } from "@core/verticals";
import {
  crewMembers,
  subcontractors,
  jobDeployments,
  costRecords,
} from "@core/operations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useOrgProfile, useUpdateOrgProfile } from "@/hooks/use-org";
import {
  parseCertifications,
  parseLeadershipEntries,
  parseLicenseEntries,
  parseServiceAreas,
  parseStringField,
  initialsFromName,
} from "@/lib/org-profile";
import { useWinLossAnalytics } from "@/hooks/use-bids";
import { useJobs } from "@/hooks/use-jobs";
import { DemoDataBadge } from "@/components/demo-data-badge";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  TrendingUp,
  Target,
  Clock,
  HardHat,
  BadgeCheck,
  Layers,
  Landmark,
  Star,
  Pencil,
  Save,
  Info,
  DollarSign,
  Briefcase,
  Phone,
  Mail,
} from "lucide-react";

interface FieldProps {
  label: string;
  value: string;
  editing: boolean;
  accent?: boolean;
}

function ProfileField({ label, value, editing, accent }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <input
        readOnly={!editing}
        defaultValue={value}
        className={`w-full rounded-lg border bg-[#F1F5F9] px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors ${
          editing
            ? "border-[#38BDF8]/50 focus:border-[#38BDF8]"
            : "border-[#E2E8F0] cursor-default"
        } ${accent ? "text-[#0284C7]" : ""}`}
      />
    </div>
  );
}

export default function BusinessProfile() {
  const { verticalConfig } = useAppContext();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: org } = useOrgProfile();
  const updateOrg = useUpdateOrgProfile();
  const { data: liveJobs = [] } = useJobs();
  const { data: winLoss } = useWinLossAnalytics();
  const [editing, setEditing] = useState(false);

  const companyName = live && org?.name ? org.name : "Cornerstone Contracting Alliance";

  const stats = useMemo(() => {
    const jobs = live ? liveJobs : jobDeployments;
    const wonValue = jobs.reduce((sum, j) => sum + j.contractValue, 0);
    const avgProject = jobs.length ? wonValue / jobs.length : 0;
    const avgRoi = live
      ? jobs.length
        ? jobs.reduce((sum, j) => sum + j.projectedRoi, 0) / jobs.length
        : 0
      : costRecords.reduce((sum, c) => sum + c.projectedRoi, 0) / costRecords.length;
    const activeCrew = live ? 0 : crewMembers.filter((c) => c.status !== "PTO").length;
    const activeSubs = live ? 0 : subcontractors.length;
    const winRate = live && winLoss?.summary.winRate != null ? Math.round(winLoss.summary.winRate * 100) : live ? null : 63;
    const activeContracts = jobs.length;
    return { wonValue, avgProject, avgRoi, activeCrew, activeSubs, winRate, activeContracts };
  }, [live, liveJobs, winLoss]);

  const handleToggleEdit = () => {
    if (editing && live && org) {
      updateOrg.mutate({ name: companyName });
      toast({
        title: "Profile saved",
        description: "Business profile updates recorded. Bid-fit inputs refreshed.",
      });
    } else if (editing) {
      toast({
        title: "Profile saved",
        description: "Business profile updates recorded. Bid-fit inputs refreshed.",
      });
    }
    setEditing((e) => !e);
  };

  const servedVerticalIds: string[] = [
    "gc",
    "hvac",
    "roofing",
    "electrical",
    "restoration",
    "facility",
  ];

  const demoLicenses = [
    { name: "TX General Contractor License", id: "GC-#TX-448120", status: "Active", expires: "Mar 2026" },
    { name: "TX Mechanical Contractor (HVAC)", id: "TACLB-#98341", status: "Active", expires: "Aug 2026" },
    { name: "TX Master Electrician", id: "ME-#221765", status: "Active", expires: "Nov 2025" },
    { name: "Roofing Contractor Registration", id: "RCAT-#7742", status: "Active", expires: "Jan 2026" },
  ];

  const demoCertifications = [
    "OSHA 30 (all supervisors)",
    "EPA 608 Universal",
    "IICRC Water & Fire Restoration",
    "MBE / HUB Certified",
    "Manufacturer Certified (Carrier, GAF)",
    "DBIA Design-Build",
  ];

  const licenses = live ? parseLicenseEntries(org?.profile?.licenses) : demoLicenses;
  const certifications = live ? parseCertifications(org?.profile?.certifications) : demoCertifications;

  const demoServiceAreas = [
    "Austin Metro",
    "Round Rock",
    "Cedar Park",
    "Georgetown",
    "San Antonio",
    "Houston / Galveston",
    "Waco Corridor",
  ];
  const serviceAreas = live ? parseServiceAreas(org?.profile?.serviceAreas) : demoServiceAreas;

  const differentiators = live
    ? []
    : [
    {
      title: "Multi-trade self-perform",
      detail: "In-house HVAC, electrical, and restoration crews reduce sub dependency and schedule risk.",
      icon: Layers,
    },
    {
      title: "Weather-resilient scheduling",
      detail: "Active jobsite weather watch reroutes crews before rain-outs impact critical path.",
      icon: TrendingUp,
    },
    {
      title: "Transparent cost tracking",
      detail: "Real-time cost-to-date and profit-fade monitoring on every deployment.",
      icon: Target,
    },
    {
      title: "Rapid claims response",
      detail: "Restoration division mobilizes mitigation within 24 hours of carrier assignment.",
      icon: ShieldCheck,
    },
  ];

  const leadership = live
    ? parseLeadershipEntries(org?.profile?.leadership)
    : [
    { name: "Dana Whitfield", role: "President / Principal", tenure: "18 yrs", initials: "DW" },
    { name: "Marcus Ruiz", role: "VP Field Operations", tenure: "12 yrs", initials: "MR" },
    { name: "Priya Nair", role: "Director of Projects", tenure: "9 yrs", initials: "PN" },
    { name: "Devon Clarke", role: "Restoration Division Lead", tenure: "7 yrs", initials: "DC" },
  ];

  const contactPhone = live ? parseStringField(org?.profile?.phone) : "(512) 555-0199";
  const contactEmail = live ? parseStringField(org?.profile?.contactEmail) : "ops@cornerstonebuilders.com";
  const hasContact = Boolean(contactPhone || contactEmail);

  return (
    <Layout>
      <div className="space-y-6 max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white shrink-0">
              <Building2 className="h-7 w-7 text-[#0284C7]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                {companyName}
              </h1>
              <p className="text-slate-500 mt-1">
                Company profile powering bid-fit for the{" "}
                <span className="text-[#0284C7] font-semibold">{verticalConfig.name}</span> workflow.
              </p>
              {!live && <div className="mt-2"><DemoDataBadge /></div>}
            </div>
          </div>
          <Button
            onClick={handleToggleEdit}
            className={`h-10 px-5 font-semibold ${
              editing
                ? "bg-[#22C55E] hover:bg-[#22C55E]/90 text-white"
                : "bg-[#0BA3A8] hover:bg-[#0BA3A8]/90 text-white"
            }`}
          >
            {editing ? (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Past performance KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            {
              label: "Win Rate",
              value: stats.winRate != null ? `${stats.winRate}%` : "—",
              note: live ? "From recorded outcomes" : "Last 12 months",
              icon: TrendingUp,
              color: "#22C55E",
            },
            { label: "Avg Project Size", value: stats.avgProject ? `$${(stats.avgProject / 1000).toFixed(0)}K` : "—", note: live ? "From job deployments" : "Active portfolio", icon: DollarSign, color: "#38BDF8" },
            { label: "On-Time Completion", value: live ? "—" : "91%", note: live ? "Ops module Phase 4" : "Trailing 24 jobs", icon: Clock, color: "#38BDF8" },
            { label: "Avg Projected ROI", value: stats.avgRoi ? `${stats.avgRoi.toFixed(1)}%` : "—", note: "Across deployments", icon: Target, color: "#22C55E" },
            { label: "Safety (EMR)", value: live ? "—" : "0.78", note: live ? "Add to org profile" : "Below industry avg", icon: HardHat, color: "#F59E0B" },
            { label: "Active Contracts", value: `${stats.activeContracts}`, note: live ? "Live job count" : "In deployment", icon: Briefcase, color: "#38BDF8" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#E2E8F0] bg-white p-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <kpi.icon className="w-9 h-9" style={{ color: kpi.color }} />
              </div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight relative z-10">
                {kpi.value}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 relative z-10">{kpi.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: identity + capacity + differentiators */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company identity */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  COMPANY IDENTITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ProfileField label="Legal Name" value={companyName} editing={editing} />
                <ProfileField label="DBA" value={live ? "" : "Cornerstone Builders"} editing={editing} />
                <ProfileField label="Founded" value={live ? "" : "2007"} editing={editing} />
                <ProfileField label="Entity Type" value={live ? "" : "Limited Liability Company"} editing={editing} />
                <ProfileField label="Headquarters" value={live ? "" : "Austin, TX"} editing={editing} />
                <ProfileField label="Company Size" value={live ? "" : "120 employees (48 field)"} editing={editing} />
                <ProfileField label="Annual Revenue" value={live ? "" : "$42M (2024)"} editing={editing} accent />
                <ProfileField label="Primary Vertical" value={verticalConfig.name} editing={editing} accent />
              </CardContent>
            </Card>

            {/* Verticals served */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Layers className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  VERTICALS SERVED
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {VERTICALS.filter((v) => servedVerticalIds.includes(v.id)).map((v) => {
                    const isActive = v.id === verticalConfig.id;
                    return (
                      <div
                        key={v.id}
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                          isActive
                            ? "border-[#38BDF8]/50 bg-[#38BDF8]/10 text-[#0284C7]"
                            : "border-[#E2E8F0] bg-[#F1F5F9] text-slate-500"
                        }`}
                      >
                        {isActive && <BadgeCheck className="w-3.5 h-3.5" />}
                        {v.name}
                        {isActive && (
                          <span className="text-[9px] uppercase tracking-widest opacity-80">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                  Cornerstone self-performs {verticalConfig.name.toLowerCase()} work with{" "}
                  {verticalConfig.laborCategories.slice(0, 3).join(", ")} crews and partners on{" "}
                  {verticalConfig.subCategories.slice(0, 3).join(", ")} scopes.
                </p>
              </CardContent>
            </Card>

            {/* Crew / capacity */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Users className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  CREW &amp; CAPACITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Field Crew", value: `${stats.activeCrew}`, sub: "Active personnel" },
                    { label: "Sub Partners", value: `${stats.activeSubs}`, sub: "Vetted trades" },
                    { label: "Concurrent Jobs", value: "6-8", sub: "Typical load" },
                    { label: "Bonding Capacity", value: "$25M", sub: "Aggregate" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                      <div className="text-2xl font-bold text-slate-900">{c.value}</div>
                      <div className="text-[11px] font-semibold text-slate-900 mt-1">{c.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4 flex items-start gap-3">
                  <Landmark className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Bonding capacity: $5M single / $25M aggregate
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Surety line held through Meridian Surety Group. Figures indicative only and
                      require broker verification per project; capacity does not imply any guaranteed
                      bonding or award outcome.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Differentiators */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Star className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  KEY DIFFERENTIATORS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {differentiators.length === 0 ? (
                  <p className="text-sm text-slate-500 col-span-2">
                    {live ? "Add differentiators when editing your organization profile." : "No differentiators."}
                  </p>
                ) : (
                differentiators.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4 flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#38BDF8]/10 shrink-0">
                      <d.icon className="w-4 h-4 text-[#0284C7]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{d.title}</div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{d.detail}</p>
                    </div>
                  </div>
                ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: licenses, certs, service areas, leadership */}
          <div className="space-y-6">
            {/* Licenses */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  LICENSES
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {licenses.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {live
                      ? "No licenses on file. Add them in Settings → Enterprise & White Label."
                      : "No licenses."}
                  </p>
                ) : (
                licenses.map((l, index) => (
                  <div
                    key={l.id ?? `${l.name}-${index}`}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">{l.name}</span>
                      {l.status ? (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">
                          {l.status}
                        </span>
                      ) : null}
                    </div>
                    {(l.id || l.expires) && (
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-slate-500">{l.id ?? ""}</span>
                        {l.expires ? (
                          <span className="text-[10px] text-slate-500">Exp {l.expires}</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Award className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  CERTIFICATIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {certifications.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {live
                      ? "No certifications on file. Add them in Settings → Enterprise & White Label."
                      : "No certifications."}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] text-[11px] font-medium text-slate-500 flex items-center gap-1.5"
                      >
                        <BadgeCheck className="w-3 h-3 text-[#22C55E]" />
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service areas */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  SERVICE AREAS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {serviceAreas.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {live
                      ? "No service areas on file. Add them in Settings → Company Profile."
                      : "No service areas."}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((a) => (
                      <span
                        key={a}
                        className="px-2.5 py-1 rounded-lg bg-[#38BDF8]/10 text-[11px] font-medium text-[#0284C7] flex items-center gap-1.5"
                      >
                        <MapPin className="w-3 h-3" />
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Primary contact */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Phone className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  PRIMARY CONTACT
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {!hasContact ? (
                  <p className="text-sm text-slate-500">
                    {live
                      ? "No contact details on file. Add phone or email in Settings → Enterprise & White Label."
                      : "No contact details."}
                  </p>
                ) : (
                  <>
                    {contactPhone ? (
                      <div className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                        <Phone className="w-4 h-4 text-[#0284C7] shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone</div>
                          <div className="text-xs font-semibold text-slate-900 mt-0.5">{contactPhone}</div>
                        </div>
                      </div>
                    ) : null}
                    {contactEmail ? (
                      <div className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                        <Mail className="w-4 h-4 text-[#0284C7] shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</div>
                          <div className="text-xs font-semibold text-slate-900 mt-0.5">{contactEmail}</div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Leadership */}
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center gap-2">
                <Users className="w-4 h-4 text-[#0284C7]" />
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                  LEADERSHIP
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {leadership.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {live ? "No leadership on file. Add contacts in Settings → Enterprise & White Label." : "No leadership listed."}
                  </p>
                ) : (
                leadership.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0BA3A8]/15 text-[#0BA3A8] text-xs font-bold shrink-0">
                      {"initials" in p && p.initials ? p.initials : initialsFromName(p.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.role ?? "—"}</div>
                    </div>
                    {p.tenure ? (
                      <span className="text-[10px] text-slate-500 shrink-0">{p.tenure}</span>
                    ) : null}
                  </div>
                ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Guardrail note */}
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Decision-support guidance only. Bonding, licensing, insurance, and performance figures
            shown here are prototype values that require independent verification before inclusion in
            any client-facing or prequalification submission. Nothing here implies a guaranteed
            bonding, licensing, compliance, or award outcome. Review before sending client-facing
            output.
          </p>
        </div>
      </div>
    </Layout>
  );
}
