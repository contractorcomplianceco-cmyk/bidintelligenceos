import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Bell, DownloadCloud, Building2, MapPin, Wrench, Save, FileCheck, Blocks, Network, ArrowRight, Check, Palette, Globe, Users, ShieldCheck, Sparkles, UserPlus, Layers } from "lucide-react";
import { useAppContext } from "@/lib/context";
import { VERTICALS } from "@core/verticals";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useOrgProfile, useUpdateOrgProfile } from "@/hooks/use-org";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { useEffect, useState } from "react";
import {
  BRAND_COLORS,
  ENTERPRISE_LOCATIONS,
  ENTERPRISE_PERMISSIONS,
  ENTERPRISE_ROLES,
} from "@core/enterprise";
import { parseCertifications, parseLeadershipEntries, parseLicenseEntries, parseStringField, parseUrlField, type LeadershipEntry, type LicenseEntry } from "@/lib/org-profile";

export default function Settings() {
  const { mode, setMode, vertical, setVertical, verticalConfig } = useAppContext();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: org } = useOrgProfile();
  const updateOrg = useUpdateOrgProfile();

  const profile = (org?.profile ?? {}) as Record<string, unknown>;
  const demoCompanyName = "Acme Commercial Trades";
  const demoContractorType = "General/Specialty";
  const demoServices = "HVAC, Electrical, Facilities Maintenance";
  const demoAreas = "Greater Seattle Area, Bellevue, Tacoma";
  const demoJobSize = "$50k - $500k";
  const demoCrew = "15 active field personnel";
  const demoMargin = "18% - 25%";
  const demoOverhead = "12%";
  const demoBonding = "Standard $2M liability. Custom bonding available for municipal projects.";
  const demoLicense = "WA State L&I fully compliant. Electrical administrator assigned.";

  const [companyName, setCompanyName] = useState("");
  const [contractorType, setContractorType] = useState("");
  const [services, setServices] = useState("");
  const [areas, setAreas] = useState("");
  const [jobSize, setJobSize] = useState("");
  const [crew, setCrew] = useState("");
  const [margin, setMargin] = useState("");
  const [overhead, setOverhead] = useState("");
  const [bonding, setBonding] = useState("");
  const [license, setLicense] = useState("");

  const companyNameValue = live ? (companyName || org?.name || "") : companyName || demoCompanyName;
  const contractorTypeValue = live ? (contractorType || String(profile.contractorType ?? "")) : contractorType || demoContractorType;
  const servicesValue = live ? (services || String(profile.services ?? "")) : services || demoServices;
  const areasValue = live ? (areas || String(profile.serviceAreas ?? "")) : areas || demoAreas;
  const jobSizeValue = live ? (jobSize || String(profile.preferredJobSize ?? "")) : jobSize || demoJobSize;
  const crewValue = live ? (crew || String(profile.crewCapacity ?? "")) : crew || demoCrew;
  const marginValue = live ? (margin || String(profile.targetMargin ?? "")) : margin || demoMargin;
  const overheadValue = live ? (overhead || String(profile.overheadAssumptions ?? "")) : overhead || demoOverhead;
  const bondingValue = live ? (bonding || String(profile.bondingNotes ?? "")) : bonding || demoBonding;
  const licenseValue = live ? (license || String(profile.licenseNotes ?? "")) : license || demoLicense;

  const userNameParts = (live ? user?.name ?? "" : "Jordan P.").trim().split(/\s+/);
  const firstName = live ? userNameParts[0] ?? "" : "Jordan";
  const lastName = live ? userNameParts.slice(1).join(" ") : "P.";
  const email = live ? user?.email ?? "" : "jordan@acmetrades.com";

  const [licenses, setLicenses] = useState<LicenseEntry[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [leadership, setLeadership] = useState<LeadershipEntry[]>([]);
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (!live || !org) return;
    setLicenses(parseLicenseEntries(org.profile?.licenses));
    setCertifications(parseCertifications(org.profile?.certifications));
    setPhone(parseStringField(org.profile?.phone));
    setContactEmail(parseStringField(org.profile?.contactEmail));
    setLeadership(parseLeadershipEntries(org.profile?.leadership));
    setBrandName(parseStringField(org.profile?.brandName));
    setLogoUrl(parseUrlField(org.profile?.logoUrl));
  }, [live, org?.id, org?.profile]);

  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0].hex);
  const [productName, setProductName] = useState("BidIntelligenceOS");
  const [customDomain, setCustomDomain] = useState("bids.yourcompany.com");
  const [rollupEnabled, setRollupEnabled] = useState(true);
  const [regionalSegmentation, setRegionalSegmentation] = useState(false);

  const handleSaveEnterpriseCredentials = () => {
    if (!live) return;
    const nextLicenses = licenses
      .map((entry) => ({
        name: entry.name.trim(),
        ...(entry.id?.trim() ? { id: entry.id.trim() } : {}),
        ...(entry.status?.trim() ? { status: entry.status.trim() } : {}),
        ...(entry.expires?.trim() ? { expires: entry.expires.trim() } : {}),
      }))
      .filter((entry) => entry.name.length > 0);
    const nextCertifications = certifications.map((entry) => entry.trim()).filter(Boolean);
    const nextLeadership = leadership
      .map((entry) => ({
        name: entry.name.trim(),
        ...(entry.role?.trim() ? { role: entry.role.trim() } : {}),
        ...(entry.tenure?.trim() ? { tenure: entry.tenure.trim() } : {}),
        ...(entry.phone?.trim() ? { phone: entry.phone.trim() } : {}),
        ...(entry.email?.trim() ? { email: entry.email.trim() } : {}),
      }))
      .filter((entry) => entry.name.length > 0);
    const trimmedLogoUrl = logoUrl.trim();
    if (trimmedLogoUrl && !parseUrlField(trimmedLogoUrl)) {
      toast({
        title: "Invalid logo URL",
        description: "Logo URL must be a valid http or https link.",
        variant: "destructive",
      });
      return;
    }
    updateOrg.mutate({
      profile: {
        ...profile,
        licenses: nextLicenses,
        certifications: nextCertifications,
        phone: phone.trim(),
        contactEmail: contactEmail.trim(),
        leadership: nextLeadership,
        brandName: brandName.trim(),
        ...(trimmedLogoUrl ? { logoUrl: trimmedLogoUrl } : { logoUrl: "" }),
      },
    });
    toast({
      title: "Enterprise credentials saved",
      description: "Licenses, certifications, contact, leadership, and white-label branding stored on your organization profile.",
    });
  };

  const handleSaveProfile = () => {
    if (live) {
      updateOrg.mutate({
        name: companyNameValue,
        vertical,
        profile: {
          contractorType: contractorTypeValue,
          services: servicesValue,
          serviceAreas: areasValue,
          preferredJobSize: jobSizeValue,
          crewCapacity: crewValue,
          targetMargin: marginValue,
          overheadAssumptions: overheadValue,
          bondingNotes: bondingValue,
          licenseNotes: licenseValue,
        },
      });
    }
    toast({
      title: "Profile saved",
      description: live
        ? "Organization profile updated from live settings."
        : "Demo profile saved locally for this session.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <SettingsIcon className="h-8 w-8 text-[#0284C7]" />
             Settings & Configuration
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Manage your company profile, ContractorConnect integration, and preferences.</p>
          {!live && <DemoDataBadge />}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-[#E2E8F0]">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">Company Profile</TabsTrigger>
            <TabsTrigger value="addon" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">ContractorConnect</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">App Preferences</TabsTrigger>
            <TabsTrigger value="enterprise" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">Enterprise & White Label</TabsTrigger>
          </TabsList>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-white border-[#E2E8F0] shadow-sm">
                  <CardHeader className="border-b border-[#E2E8F0] pb-4">
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#0284C7]" />
                      Business Type
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Sets the active vertical across BidIntelligenceOS — phases, cost
                      categories, permit needs, and labels adapt to your trade. Currently:{" "}
                      <span className="text-[#0284C7] font-semibold">{verticalConfig.name}</span>.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {VERTICALS.map((v) => {
                        const active = v.id === vertical;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setVertical(v.id)}
                            className={`text-left rounded-xl border p-3 transition-all ${
                              active
                                ? "border-[#38BDF8] bg-[#38BDF8]/10 shadow-sm"
                                : "border-[#E2E8F0] bg-[#F1F5F9] hover:border-[#CBD5E1]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-900">{v.name}</span>
                              {active && <Check className="w-4 h-4 text-[#0284C7]" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-tight">{v.tagline}</p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E2E8F0] shadow-sm">
                  <CardHeader className="border-b border-[#E2E8F0] pb-4">
                    <CardTitle className="text-lg text-slate-900">Core Details</CardTitle>
                    <CardDescription className="text-slate-500">Basic information about your contracting business.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</Label>
                        <Input id="companyName" value={companyNameValue} onChange={(e) => setCompanyName(e.target.value)} placeholder={live ? "Company name" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contractorType" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contractor Type</Label>
                        <Input id="contractorType" value={contractorTypeValue} onChange={(e) => setContractorType(e.target.value)} placeholder={live ? "Contractor type" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="services" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5" /> Trades / Services
                      </Label>
                      <Input id="services" value={servicesValue} onChange={(e) => setServices(e.target.value)} placeholder={live ? "Trades / services" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="areas" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Service Areas
                      </Label>
                      <Input id="areas" value={areasValue} onChange={(e) => setAreas(e.target.value)} placeholder={live ? "Service areas" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E2E8F0] shadow-sm">
                  <CardHeader className="border-b border-[#E2E8F0] pb-4">
                    <CardTitle className="text-lg text-slate-900">Operational Capacity</CardTitle>
                    <CardDescription className="text-slate-500">Metrics used to calculate Bid Fit and capacity constraints.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="jobSize" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Job Size ($)</Label>
                        <Input id="jobSize" value={jobSizeValue} onChange={(e) => setJobSize(e.target.value)} placeholder={live ? "Preferred job size" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crew" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crew Capacity</Label>
                        <Input id="crew" value={crewValue} onChange={(e) => setCrew(e.target.value)} placeholder={live ? "Crew capacity" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="margin" className="text-xs font-semibold text-[#0284C7] uppercase tracking-wider">Target Margin Range (%)</Label>
                        <Input id="margin" value={marginValue} onChange={(e) => setMargin(e.target.value)} placeholder={live ? "Target margin" : undefined} className="bg-[#F1F5F9] border-[#38BDF8]/50 text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="overhead" className="text-xs font-semibold text-[#0284C7] uppercase tracking-wider">Overhead Assumptions (%)</Label>
                        <Input id="overhead" value={overheadValue} onChange={(e) => setOverhead(e.target.value)} placeholder={live ? "Overhead assumptions" : undefined} className="bg-[#F1F5F9] border-[#38BDF8]/50 text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white border-[#E2E8F0] shadow-sm">
                  <CardHeader className="border-b border-[#E2E8F0] pb-4">
                    <CardTitle className="text-lg text-slate-900">Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="bonding" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bonding/Insurance Notes</Label>
                      <Textarea id="bonding" value={bondingValue} onChange={(e) => setBonding(e.target.value)} placeholder={live ? "Bonding / insurance notes" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 resize-none h-24 focus-visible:ring-[#38BDF8]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License Notes</Label>
                      <Textarea id="license" value={licenseValue} onChange={(e) => setLicense(e.target.value)} placeholder={live ? "License notes" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 resize-none h-24 focus-visible:ring-[#38BDF8]" />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={live && updateOrg.isPending} className="w-full mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold h-11">
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Addon Tab */}
          <TabsContent value="addon" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  <Network className="h-6 w-6 text-[#0284C7]" />
                  ContractorConnect Integration
                </h3>
                <p className="text-slate-500 mt-1">Seamlessly sync your intelligence with the verified contractor network.</p>
              </div>
              <Button 
                className={`shadow-lg font-semibold h-11 px-6 ${mode === "addon" ? "bg-[#E2E8F0] hover:bg-[#CBD5E1] text-slate-900 border border-[#CBD5E1]" : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"}`}
                onClick={() => setMode(mode === "addon" ? "standalone" : "addon")}
              >
                {mode === "addon" ? "Disable Add-On Mode" : "Activate Network Sync"}
              </Button>
            </div>

            {mode === "addon" ? (
              <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="md:col-span-2 border-[#38BDF8]/50 bg-[#38BDF8]/10 shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[#38BDF8]"></div>
                   <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
                     <Blocks className="w-48 h-48" />
                   </div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-full bg-[#F1F5F9]/50 flex items-center justify-center border border-[#38BDF8]/30 shadow-sm shrink-0">
                        <Blocks className="h-8 w-8 text-[#0284C7]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 mb-1 tracking-tight">Active Connection: Secured</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">BidIntelligenceOS is currently pulling live compliance, pre-qualification, and network matching data from the ContractorConnect infrastructure.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E2E8F0] shadow-sm">
                  <CardHeader className="border-b border-[#E2E8F0] pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                      <FileCheck className="h-5 w-5 text-[#0284C7]" />
                      Pre-Qualification Sync
                    </CardTitle>
                    <CardDescription className="text-slate-500">Auto-attach to generated bid packages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Because you are connected, your company profile, safety records (EMR), and references are automatically cached and synced to the Bid Package Builder, helping keep your compliance documentation export-ready. Final review is required before every export.
                    </p>
                    <Button className="w-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-slate-900 border border-[#CBD5E1] font-semibold h-11">
                      View Synced Package Assets
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-20 bg-white border-[#E2E8F0] border-dashed animate-in fade-in duration-500">
                <CardContent className="space-y-8 max-w-lg mx-auto">
                  <div className="h-28 w-28 bg-[#E2E8F0] rounded-full flex items-center justify-center mx-auto border border-[#CBD5E1] shadow-inner">
                    <Blocks className="h-12 w-12 text-slate-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Unlock the Network</h3>
                    <p className="text-slate-500 text-base leading-relaxed">
                      Connect BidIntelligenceOS to ContractorConnect to automatically sync your compliance docs, pre-fill bid packages, and discover network-matched GC opportunities in real-time.
                    </p>
                  </div>
                  <Button size="lg" onClick={() => setMode("addon")} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-md h-14 px-8 shadow-lg">
                    Activate Add-On Integration <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* App Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                   <User className="h-5 w-5 text-slate-500" />
                   Account Information
                </CardTitle>
                <CardDescription className="text-slate-500">Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</Label>
                    <Input defaultValue={firstName} placeholder={live ? "First name" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</Label>
                    <Input defaultValue={lastName} placeholder={live ? "Last name" : undefined} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</Label>
                    <Input defaultValue={email} placeholder={live ? "Email address" : undefined} type="email" readOnly={live} className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#E2E8F0] pt-4 bg-[#F1F5F9]/50">
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-md">Save Changes</Button>
              </CardFooter>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                   <Bell className="h-5 w-5 text-slate-500" />
                   Notification Preferences
                </CardTitle>
                <CardDescription className="text-slate-500">Control when and how you receive alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-slate-700">Bid Follow-Up Reminders</Label>
                    <p className="text-sm text-slate-500 leading-relaxed">Receive alerts when submitted bids require follow-up.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#38BDF8]" />
                </div>
                <Separator className="bg-[#E2E8F0]" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-slate-700">Missing Information Alerts</Label>
                    <p className="text-sm text-slate-500 leading-relaxed">Notify me when scope analysis detects high-risk missing info.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#38BDF8]" />
                </div>
                <Separator className="bg-[#E2E8F0]" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-slate-700">Weekly Analytics Digest</Label>
                    <p className="text-sm text-slate-500 leading-relaxed">Receive a summary of win/loss metrics every Monday.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#38BDF8]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                   <DownloadCloud className="h-5 w-5 text-slate-500" />
                   Export & Defaults
                </CardTitle>
                <CardDescription className="text-slate-500">Configure package builder outputs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Default Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8]">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E2E8F0] text-slate-700">
                      <SelectItem value="pdf" className="focus:bg-[#E2E8F0] focus:text-slate-900 cursor-pointer">PDF Document (.pdf)</SelectItem>
                      <SelectItem value="docx" className="focus:bg-[#E2E8F0] focus:text-slate-900 cursor-pointer">Word Document (.docx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Default Validity Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E2E8F0] text-slate-700">
                      <SelectItem value="15" className="focus:bg-[#E2E8F0] focus:text-slate-900 cursor-pointer">15 Days</SelectItem>
                      <SelectItem value="30" className="focus:bg-[#E2E8F0] focus:text-slate-900 cursor-pointer">30 Days</SelectItem>
                      <SelectItem value="60" className="focus:bg-[#E2E8F0] focus:text-slate-900 cursor-pointer">60 Days</SelectItem>
                      <SelectItem value="90" className="focus:bg-[#E2E8F0] focus:text-slate-900 cursor-pointer">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enterprise & White Label Tab */}
          <TabsContent value="enterprise" className="space-y-6">
            {live ? (
            <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-[#0284C7]" />
                  Enterprise Credentials
                </h3>
                <p className="text-slate-500 mt-1">
                  Licenses, certifications, contacts, leadership, and optional white-label branding persist on your organization profile.
                  Multi-location rollups and role-based access remain Phase 5.
                </p>
              </div>
            </div>

            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#0284C7]" />
                  White Label
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Optional brand name and logo URL shown on your business profile header. URL only — no file upload.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brandName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Brand name
                    </Label>
                    <Input
                      id="brandName"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Your client-facing brand"
                      className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Logo URL
                    </Label>
                    <Input
                      id="logoUrl"
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://cdn.example.com/logo.png"
                      className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700"
                    />
                  </div>
                </div>
                {(brandName.trim() || parseUrlField(logoUrl)) && (
                  <div className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                    {parseUrlField(logoUrl) ? (
                      <img
                        src={parseUrlField(logoUrl)}
                        alt={brandName.trim() || "Brand logo"}
                        className="h-14 w-14 rounded-lg border border-[#E2E8F0] bg-white object-contain shrink-0"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white shrink-0">
                        <Building2 className="h-7 w-7 text-[#0284C7]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Header preview</p>
                      <p className="text-xs text-slate-500">
                        {brandName.trim() || "Brand name not set"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-[#0284C7]" />
                  Licenses
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Trade and municipal licenses used for compliance and bid readiness.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {licenses.length === 0 ? (
                  <p className="text-sm text-slate-500">No licenses on file. Add your first license below.</p>
                ) : (
                  licenses.map((entry, index) => (
                    <div key={index} className="grid gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License name</Label>
                        <Input
                          value={entry.name}
                          onChange={(e) =>
                            setLicenses((rows) =>
                              rows.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)),
                            )
                          }
                          className="bg-white border-[#E2E8F0] text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License ID</Label>
                        <Input
                          value={entry.id ?? ""}
                          onChange={(e) =>
                            setLicenses((rows) =>
                              rows.map((row, i) => (i === index ? { ...row, id: e.target.value } : row)),
                            )
                          }
                          className="bg-white border-[#E2E8F0] text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</Label>
                        <Input
                          value={entry.status ?? ""}
                          onChange={(e) =>
                            setLicenses((rows) =>
                              rows.map((row, i) => (i === index ? { ...row, status: e.target.value } : row)),
                            )
                          }
                          placeholder="Active"
                          className="bg-white border-[#E2E8F0] text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expires</Label>
                        <div className="flex gap-2">
                          <Input
                            value={entry.expires ?? ""}
                            onChange={(e) =>
                              setLicenses((rows) =>
                                rows.map((row, i) => (i === index ? { ...row, expires: e.target.value } : row)),
                              )
                            }
                            placeholder="Mar 2026"
                            className="bg-white border-[#E2E8F0] text-slate-700"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-[#CBD5E1] bg-white text-slate-700"
                            onClick={() => setLicenses((rows) => rows.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  variant="outline"
                  className="border-[#CBD5E1] bg-white text-slate-700"
                  onClick={() => setLicenses((rows) => [...rows, { name: "", status: "Active" }])}
                >
                  Add license
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#0284C7]" />
                  Primary Contact
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Main phone and email shown on your business profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(512) 555-0199"
                      className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</Label>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="ops@yourcompany.com"
                      className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#0284C7]" />
                  Leadership
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Key contacts displayed on your business profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {leadership.length === 0 ? (
                  <p className="text-sm text-slate-500">No leadership contacts on file. Add your first contact below.</p>
                ) : (
                  leadership.map((entry, index) => (
                    <div key={index} className="grid gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</Label>
                        <Input
                          value={entry.name}
                          onChange={(e) =>
                            setLeadership((rows) =>
                              rows.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)),
                            )
                          }
                          className="bg-white border-[#E2E8F0] text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</Label>
                        <Input
                          value={entry.role ?? ""}
                          onChange={(e) =>
                            setLeadership((rows) =>
                              rows.map((row, i) => (i === index ? { ...row, role: e.target.value } : row)),
                            )
                          }
                          className="bg-white border-[#E2E8F0] text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenure</Label>
                        <Input
                          value={entry.tenure ?? ""}
                          onChange={(e) =>
                            setLeadership((rows) =>
                              rows.map((row, i) => (i === index ? { ...row, tenure: e.target.value } : row)),
                            )
                          }
                          placeholder="12 yrs"
                          className="bg-white border-[#E2E8F0] text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Remove</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-[#CBD5E1] bg-white text-slate-700"
                          onClick={() => setLeadership((rows) => rows.filter((_, i) => i !== index))}
                        >
                          Remove contact
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  variant="outline"
                  className="border-[#CBD5E1] bg-white text-slate-700"
                  onClick={() => setLeadership((rows) => [...rows, { name: "" }])}
                >
                  Add leadership contact
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0284C7]" />
                  Certifications
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Set-aside, safety, and trade certifications for pursuit and compliance gates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {certifications.length === 0 ? (
                  <p className="text-sm text-slate-500">No certifications on file. Add your first certification below.</p>
                ) : (
                  certifications.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={cert}
                        onChange={(e) =>
                          setCertifications((rows) =>
                            rows.map((row, i) => (i === index ? e.target.value : row)),
                          )
                        }
                        className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 border-[#CBD5E1] bg-white text-slate-700"
                        onClick={() => setCertifications((rows) => rows.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
                <Button
                  variant="outline"
                  className="border-[#CBD5E1] bg-white text-slate-700"
                  onClick={() => setCertifications((rows) => [...rows, ""])}
                >
                  Add certification
                </Button>
              </CardContent>
              <CardFooter className="border-t border-[#E2E8F0] pt-4">
                <Button
                  onClick={handleSaveEnterpriseCredentials}
                  disabled={updateOrg.isPending}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save credentials
                </Button>
              </CardFooter>
            </Card>
            </>
            ) : (
            <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-[#0284C7]" />
                  Enterprise & White Label
                </h3>
                <p className="text-slate-500 mt-1">
                  Branding, multi-location rollups, and role-based access. These are prototype controls for
                  demonstration — decision-support only, with human review before anything ships.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <Sparkles className="h-3.5 w-3.5" /> Enterprise plan
              </span>
            </div>

            {/* White Labeling */}
            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#0284C7]" />
                  White Labeling
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Apply your own brand across the workspace and client-facing exports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Logo</Label>
                    <div className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-lg text-white font-bold text-lg shrink-0"
                        style={{ backgroundColor: brandColor }}
                      >
                        AC
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">Brand mark preview</p>
                        <p className="text-xs text-slate-500">Mock swatch — upload disabled in prototype.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto border-[#CBD5E1] bg-white text-slate-700 hover:bg-[#F1F5F9]"
                        onClick={() =>
                          toast({
                            title: "Logo upload (prototype)",
                            description: "Branding assets are illustrative in this demo.",
                          })
                        }
                      >
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand Color</Label>
                    <div className="flex flex-wrap gap-2 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                      {BRAND_COLORS.map((c) => {
                        const active = c.hex === brandColor;
                        return (
                          <button
                            key={c.id}
                            title={c.label}
                            onClick={() => setBrandColor(c.hex)}
                            className={`h-9 w-9 rounded-full border-2 transition-all ${
                              active ? "border-slate-900 scale-110 shadow-sm" : "border-white hover:scale-105"
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="productName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Product Name Override
                    </Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium"
                    />
                    <p className="text-xs text-slate-500">Replaces the product name shown to your team and clients.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customDomain" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Custom Domain
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="customDomain"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium"
                      />
                      <Button
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shrink-0"
                        onClick={() =>
                          toast({
                            title: "Domain verification queued (prototype)",
                            description: `We'd check DNS for ${customDomain}. No changes are persisted in this demo.`,
                          })
                        }
                      >
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">Mock DNS check — no records are modified.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-location / Franchise */}
            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#0284C7]" />
                      Multi-Location & Franchise
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Sample locations and regions. Figures are illustrative for review, not guaranteed outcomes.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Label htmlFor="rollup" className="text-sm font-semibold text-slate-700">Portfolio rollup</Label>
                    <Switch
                      id="rollup"
                      checked={rollupEnabled}
                      onCheckedChange={setRollupEnabled}
                      className="data-[state=checked]:bg-[#38BDF8]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {rollupEnabled && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                      <p className="text-xs text-slate-500">Total active bids</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ENTERPRISE_LOCATIONS.reduce((s, l) => s + l.activeBids, 0)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                      <p className="text-xs text-slate-500">Locations</p>
                      <p className="text-xl font-bold text-slate-900">{ENTERPRISE_LOCATIONS.length}</p>
                    </div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                      <p className="text-xs text-slate-500">Avg win rate</p>
                      <p className="text-xl font-bold text-[#0284C7]">
                        {Math.round(
                          ENTERPRISE_LOCATIONS.reduce((s, l) => s + l.winRatePct, 0) /
                            ENTERPRISE_LOCATIONS.length,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {ENTERPRISE_LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3"
                    >
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#0284C7]">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{loc.name}</p>
                          <p className="text-xs text-slate-500">{loc.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <div className="text-right">
                          <p className="text-slate-500 text-xs">Active bids</p>
                          <p className="font-semibold text-slate-700">{loc.activeBids}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500 text-xs">Win rate</p>
                          <p className="font-semibold text-slate-700">{loc.winRatePct}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500 text-xs">Pipeline</p>
                          <p className="font-semibold text-slate-700">{loc.pipelineLabel}</p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            loc.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {loc.status === "active" ? "Active" : "Onboarding"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role-based access */}
            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-[#0284C7]" />
                      Role-Based Access
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Seeded roles and permissions. Access is enforced with human review of approvals.
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shrink-0"
                    onClick={() =>
                      toast({
                        title: "Invite sent (prototype)",
                        description: "User invitations are simulated in this demo — nothing is persisted.",
                      })
                    }
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite user
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {ENTERPRISE_ROLES.map((role) => (
                  <div key={role.id} className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        <p className="text-sm font-semibold text-slate-900">{role.name}</p>
                        <span className="text-xs text-slate-500">· {role.members} members</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ENTERPRISE_PERMISSIONS.map((perm) => {
                        const granted = role.permissions.includes(perm.id);
                        return (
                          <span
                            key={perm.id}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              granted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-white text-slate-400 border-[#E2E8F0]"
                            }`}
                          >
                            {granted && <Check className="h-3 w-3" />}
                            {perm.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regional segmentation */}
            <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#0284C7] shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="regional" className="text-sm font-semibold text-slate-700">
                        Regional segmentation
                      </Label>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Scope dashboards, pipelines, and alerts by region. Signals are drawn only from lawful,
                        public data and surfaced for human review.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="regional"
                    checked={regionalSegmentation}
                    onCheckedChange={(v) => {
                      setRegionalSegmentation(v);
                      toast({
                        title: v ? "Regional segmentation on (prototype)" : "Regional segmentation off",
                        description: "Preference is local to this demo session only.",
                      });
                    }}
                    className="data-[state=checked]:bg-[#38BDF8]"
                  />
                </div>
              </CardContent>
            </Card>
            </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
