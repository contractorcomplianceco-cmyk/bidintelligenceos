import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeOff, AlertTriangle, ArrowRight, Save, BrainCircuit } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function StrategyMemo() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Strategy Saved",
      description: "Internal memo has been securely saved to the bid record.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
               <BrainCircuit className="h-8 w-8 text-teal-600" />
               Strategy Memo
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full border border-red-200 shrink-0 w-max">
              <EyeOff className="h-4 w-4" />
              Internal Only
            </div>
          </div>
          <p className="text-slate-500 mt-2 text-lg">Compile your tactical approach. This is strictly hidden from vendor-facing exports.</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4 items-start shadow-sm">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-700 uppercase tracking-wider">Crucial Guardrail</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Notes entered on this page remain securely in BidIntelligenceOS and will never be exposed in the Package Builder's client-facing exports. Use this space freely for margin logic and competitive intel.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] pb-4">
              <CardTitle className="text-lg text-slate-900">Positioning & Narrative</CardTitle>
              <CardDescription className="text-slate-500">High-level approach and pricing strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recommended Bid Posture</Label>
                <Input defaultValue="Balanced - Emphasize past reliability over lowest price" className="bg-white border-[#E2E8F0] text-slate-700 font-medium focus-visible:ring-teal-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-[#0A8A8F]">Pricing Strategy Logic</Label>
                <Textarea 
                  className="min-h-[100px] bg-white border-[#E2E8F0] text-slate-700 font-medium leading-relaxed resize-none focus-visible:ring-teal-500"
                  defaultValue="Holding margin at 20% due to night shift complexities. Competitors usually struggle with Port Authority compliance, so we don't need to be the cheapest, just the most reliable." 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Differentiators to Highlight</Label>
                <Textarea 
                  className="min-h-[100px] bg-white border-[#E2E8F0] text-slate-700 font-medium leading-relaxed resize-none focus-visible:ring-teal-500"
                  defaultValue="- Flawless safety record on previous Terminal A project&#10;- Existing security badges for 80% of our crew&#10;- Target 8-week timeline utilizing our dedicated logistics partner" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] pb-4">
              <CardTitle className="text-lg text-slate-900">Tactics & Leverage</CardTitle>
              <CardDescription className="text-slate-500">Negotiation points and internal awareness items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Negotiation Give/Gets</Label>
                <Textarea 
                  className="min-h-[80px] bg-white border-[#E2E8F0] text-slate-700 font-medium leading-relaxed resize-none focus-visible:ring-teal-500"
                  defaultValue="If they push back on price, offer to reduce the contingency by 2% IF they can provide a dedicated staging area inside the secure zone." 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Internal Risk Items to Monitor</Label>
                <Textarea 
                  className="min-h-[80px] bg-white border-[#E2E8F0] text-slate-700 font-medium leading-relaxed resize-none focus-visible:ring-teal-500"
                  defaultValue="- Lead times on the custom RTU units are volatile right now.&#10;- Need to verify Bob's crew has enough night-shift availability in October." 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-up Action Plan</Label>
                <Input defaultValue="Call Jane Smith directly 3 days after submission. Emphasize the BMS integration." className="bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500" />
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-[#E2E8F0] pt-6 bg-[#F8FAFC]">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <EyeOff className="h-3.5 w-3.5" />
                Data securely isolated.
              </p>
              <Button onClick={handleSave} className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-[#E2E8F0] h-10 px-6 font-semibold">
                <Save className="h-4 w-4 mr-2" />
                Save Memo
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Link href="/package-builder">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-sm h-12 text-md px-8">
              Proceed to Package Builder <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
