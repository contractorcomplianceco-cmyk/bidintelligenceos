import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Blocks, ArrowRight, ShieldCheck, FileCheck, Zap } from "lucide-react";
import { useAppContext } from "@/lib/context";

export default function Addon() {
  const { mode, setMode } = useAppContext();

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">ContractorConnect Integration</h2>
            <p className="text-muted-foreground">Seamlessly sync your intelligence with the ContractorConnect network.</p>
          </div>
          <Button 
            variant={mode === "addon" ? "secondary" : "default"}
            onClick={() => setMode(mode === "addon" ? "standalone" : "addon")}
          >
            {mode === "addon" ? "Disable Add-On Mode" : "Activate Add-On Mode"}
          </Button>
        </div>

        {mode === "addon" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Blocks className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary">Integration Active</h3>
                    <p className="text-sm text-muted-foreground">BidIntelligenceOS is currently pulling compliance and network data from ContractorConnect.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  Compliance Signals
                </CardTitle>
                <CardDescription>Network-verified credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">General Liability Ins.</span>
                  <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bonding Capacity</span>
                  <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> $5M Active
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">WA State License</span>
                  <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Valid through 2025
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-accent" />
                  Pre-Qualification
                </CardTitle>
                <CardDescription>Auto-attach to bid packages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Because you are connected, your company profile, safety records (EMR), and references are automatically synced to the Bid Package Builder.
                </p>
                <Button variant="outline" className="w-full">View Synced Profile</Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Network Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-background border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">General Contractor matching your profile</p>
                    <p className="text-sm text-muted-foreground">Turner Construction is looking for HVAC trades in Seattle.</p>
                  </div>
                  <Button size="sm">Review Match</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent className="space-y-6 max-w-lg mx-auto">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Blocks className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Unlock the Network</h3>
                <p className="text-muted-foreground text-sm">
                  Connect BidIntelligenceOS to ContractorConnect to automatically sync your compliance docs, pre-fill bid packages, and discover network-matched GC opportunities.
                </p>
              </div>
              <Button size="lg" onClick={() => setMode("addon")}>
                Activate Add-On Integration <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
