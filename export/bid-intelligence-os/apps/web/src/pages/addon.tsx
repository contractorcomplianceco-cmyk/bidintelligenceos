import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Blocks, ArrowRight, ShieldCheck, FileCheck, Zap, Network } from "lucide-react";
import { useAppContext } from "@/lib/context";

export default function Addon() {
  const { mode, setMode } = useAppContext();

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
               <Network className="h-8 w-8 text-teal-500" />
               ContractorConnect Integration
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Seamlessly sync your intelligence with the verified contractor network.</p>
          </div>
          <Button 
            className={`shadow-lg font-semibold h-11 px-6 ${mode === "addon" ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600" : "bg-teal-600 hover:bg-teal-500 text-white"}`}
            onClick={() => setMode(mode === "addon" ? "standalone" : "addon")}
          >
            {mode === "addon" ? "Disable Add-On Mode" : "Activate Network Sync"}
          </Button>
        </div>

        {mode === "addon" ? (
          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="md:col-span-2 border-teal-900/50 bg-teal-950/10 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
               <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
                 <Blocks className="w-48 h-48" />
               </div>
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-teal-900/30 flex items-center justify-center border border-teal-800/50 shadow-[0_0_20px_rgba(20,184,166,0.2)] shrink-0">
                    <Blocks className="h-8 w-8 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1 tracking-tight">Active Connection: Secured</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">BidIntelligenceOS is currently pulling live compliance, pre-qualification, and network matching data from the ContractorConnect infrastructure.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                  Live Compliance Signals
                </CardTitle>
                <CardDescription className="text-slate-400">Network-verified credentials pulled in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">General Liability Ins.</span>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">Bonding Capacity</span>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" /> $5M Active
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">WA State License</span>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" /> Valid (2025)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <FileCheck className="h-5 w-5 text-teal-400" />
                  Pre-Qualification Sync
                </CardTitle>
                <CardDescription className="text-slate-400">Auto-attach to generated bid packages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Because you are connected, your company profile, safety records (EMR), and references are automatically cached and synced to the Bid Package Builder, helping keep your compliance documentation export-ready. Final review is required before every export.
                </p>
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold h-11">
                  View Synced Package Assets
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Network Intelligence & Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-5 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                       <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">High-Match Opportunity</p>
                    </div>
                    <p className="font-semibold text-lg text-white">Turner Construction is sourcing HVAC trades in Seattle.</p>
                    <p className="text-sm text-slate-400">Based on your recent $145k retrofit win and active license status, your profile is an 88% match for this upcoming RFP.</p>
                  </div>
                  <Button className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold shrink-0 shadow-lg">
                    Review Match Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center py-20 bg-slate-900/50 border-slate-800 border-dashed animate-in fade-in duration-500">
            <CardContent className="space-y-8 max-w-lg mx-auto">
              <div className="h-28 w-28 bg-slate-950 rounded-full flex items-center justify-center mx-auto border border-slate-800 shadow-inner">
                <Blocks className="h-12 w-12 text-slate-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">Unlock the Network</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Connect BidIntelligenceOS to ContractorConnect to automatically sync your compliance docs, pre-fill bid packages, and discover network-matched GC opportunities in real-time.
                </p>
              </div>
              <Button size="lg" onClick={() => setMode("addon")} className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-md h-14 px-8 shadow-lg">
                Activate Add-On Integration <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
