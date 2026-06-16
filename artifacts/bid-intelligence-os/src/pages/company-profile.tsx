import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/lib/context";
import { Building2, Save, MapPin, Wrench, FileCheck } from "lucide-react";

export default function CompanyProfile() {
  const { mode } = useAppContext();

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <Building2 className="h-8 w-8 text-teal-500" />
             Company Profile
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Manage your contractor profile and operational capabilities.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-white">Core Details</CardTitle>
                <CardDescription className="text-slate-400">Basic information about your contracting business.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</Label>
                    <Input id="companyName" defaultValue="Acme Commercial Trades" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractorType" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contractor Type</Label>
                    <Input id="contractorType" defaultValue="General/Specialty" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services" className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5" /> Trades / Services
                  </Label>
                  <Input id="services" defaultValue="HVAC, Electrical, Facilities Maintenance" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areas" className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Service Areas
                  </Label>
                  <Input id="areas" defaultValue="Greater Seattle Area, Bellevue, Tacoma" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-white">Operational Capacity</CardTitle>
                <CardDescription className="text-slate-400">Metrics used to calculate Bid Fit and capacity constraints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobSize" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preferred Job Size ($)</Label>
                    <Input id="jobSize" defaultValue="$50k - $500k" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crew" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Crew Capacity</Label>
                    <Input id="crew" defaultValue="15 active field personnel" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="margin" className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-teal-400">Target Margin Range (%)</Label>
                    <Input id="margin" defaultValue="18% - 25%" className="bg-slate-950/50 border-teal-900/50 text-slate-200 focus-visible:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overhead" className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-teal-400">Overhead Assumptions (%)</Label>
                    <Input id="overhead" defaultValue="12%" className="bg-slate-950/50 border-teal-900/50 text-slate-200 focus-visible:ring-teal-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {mode === "addon" && (
              <Card className="border-teal-900/50 bg-teal-950/10 shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-bl-full pointer-events-none"></div>
                <CardHeader className="pb-3 border-b border-teal-900/30">
                  <CardTitle className="text-teal-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    ContractorConnect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-sm">
                  <div className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 font-medium">Compliance</span>
                    <span className="font-bold text-teal-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_5px_rgba(45,212,191,0.8)]"></div>Verified</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 font-medium">Documents</span>
                    <span className="font-bold text-slate-200">12/12</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 font-medium">License</span>
                    <span className="font-bold text-slate-200">Active</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-white">Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="bonding" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bonding/Insurance Notes</Label>
                  <Textarea id="bonding" defaultValue="Standard $2M liability. Custom bonding available for municipal projects." className="bg-slate-950/50 border-slate-700 text-slate-300 resize-none h-24 focus-visible:ring-teal-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">License Notes</Label>
                  <Textarea id="license" defaultValue="WA State L&I fully compliant. Electrical administrator assigned." className="bg-slate-950/50 border-slate-700 text-slate-300 resize-none h-24 focus-visible:ring-teal-500" />
                </div>
                <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold h-11">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
