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
import { Settings as SettingsIcon, User, Bell, DownloadCloud, Building2, MapPin, Wrench, Save, FileCheck, Blocks, Network, ArrowRight, Check } from "lucide-react";
import { useAppContext } from "@/lib/context";
import { VERTICALS } from "@/lib/verticals";

export default function Settings() {
  const { mode, setMode, vertical, setVertical, verticalConfig } = useAppContext();

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <SettingsIcon className="h-8 w-8 text-[#0284C7]" />
             Settings & Configuration
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Manage your company profile, ContractorConnect integration, and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-[#E2E8F0]">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">Company Profile</TabsTrigger>
            <TabsTrigger value="addon" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">ContractorConnect</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-[#E2E8F0] data-[state=active]:text-slate-900">App Preferences</TabsTrigger>
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
                        <Input id="companyName" defaultValue="Acme Commercial Trades" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contractorType" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contractor Type</Label>
                        <Input id="contractorType" defaultValue="General/Specialty" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="services" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5" /> Trades / Services
                      </Label>
                      <Input id="services" defaultValue="HVAC, Electrical, Facilities Maintenance" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="areas" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Service Areas
                      </Label>
                      <Input id="areas" defaultValue="Greater Seattle Area, Bellevue, Tacoma" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
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
                        <Input id="jobSize" defaultValue="$50k - $500k" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crew" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crew Capacity</Label>
                        <Input id="crew" defaultValue="15 active field personnel" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="margin" className="text-xs font-semibold text-[#0284C7] uppercase tracking-wider">Target Margin Range (%)</Label>
                        <Input id="margin" defaultValue="18% - 25%" className="bg-[#F1F5F9] border-[#38BDF8]/50 text-slate-700 focus-visible:ring-[#38BDF8]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="overhead" className="text-xs font-semibold text-[#0284C7] uppercase tracking-wider">Overhead Assumptions (%)</Label>
                        <Input id="overhead" defaultValue="12%" className="bg-[#F1F5F9] border-[#38BDF8]/50 text-slate-700 focus-visible:ring-[#38BDF8]" />
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
                      <Textarea id="bonding" defaultValue="Standard $2M liability. Custom bonding available for municipal projects." className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 resize-none h-24 focus-visible:ring-[#38BDF8]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License Notes</Label>
                      <Textarea id="license" defaultValue="WA State L&I fully compliant. Electrical administrator assigned." className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 resize-none h-24 focus-visible:ring-[#38BDF8]" />
                    </div>
                    <Button className="w-full mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold h-11">
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
                    <Input defaultValue="Jordan" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</Label>
                    <Input defaultValue="P." className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</Label>
                    <Input defaultValue="jordan@acmetrades.com" type="email" className="bg-[#F1F5F9] border-[#E2E8F0] text-slate-700 focus-visible:ring-[#38BDF8] font-medium" />
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
        </Tabs>
      </div>
    </Layout>
  );
}
