import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeOff, AlertTriangle, ArrowRight, Save } from "lucide-react";
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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Strategy Memo</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-full border border-destructive/20">
              <EyeOff className="h-3.5 w-3.5" />
              Internal Only
            </div>
          </div>
          <p className="text-muted-foreground mt-1">Compile your tactical approach. This is strictly hidden from vendor-facing exports.</p>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">Internal Strategy - Hidden From Vendor-Facing Export</p>
            <p className="text-xs text-destructive/80">
              Notes entered on this page remain in BidIntelligenceOS and will never be included in the Package Builder exports.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Positioning</CardTitle>
              <CardDescription>High-level approach and pricing strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Recommended Bid Posture</Label>
                <Input defaultValue="Balanced - Emphasize past reliability over lowest price" className="font-medium" />
              </div>
              <div className="space-y-2">
                <Label>Pricing Strategy Notes</Label>
                <Textarea 
                  className="min-h-[100px]"
                  defaultValue="Holding margin at 20% due to night shift complexities. Competitors usually struggle with Port Authority compliance, so we don't need to be the cheapest, just the most reliable." 
                />
              </div>
              <div className="space-y-2">
                <Label>Key Differentiators to Highlight</Label>
                <Textarea 
                  className="min-h-[80px]"
                  defaultValue="- Flawless safety record on previous Terminal A project
- Existing security badges for 80% of our crew
- Guaranteed 8-week timeline utilizing our dedicated logistics partner" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tactics & Risks</CardTitle>
              <CardDescription>Negotiation leverage and internal awareness items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Negotiation Points</Label>
                <Textarea 
                  className="min-h-[80px]"
                  defaultValue="If they push back on price, offer to reduce the contingency by 2% IF they can provide a dedicated staging area inside the secure zone." 
                />
              </div>
              <div className="space-y-2">
                <Label>Internal Risk Items to Monitor</Label>
                <Textarea 
                  className="min-h-[80px]"
                  defaultValue="- Lead times on the custom RTU units are volatile right now.
- Need to verify Bob's crew has enough night-shift availability in October." 
                />
              </div>
              <div className="space-y-2">
                <Label>Follow-up Strategy</Label>
                <Input defaultValue="Call Jane Smith directly 3 days after submission. Emphasize the BMS integration." />
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                Internal notes hidden from vendor-facing package.
              </p>
              <Button onClick={handleSave} variant="secondary">
                <Save className="h-4 w-4 mr-2" />
                Save Memo
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Link href="/package-builder">
            <Button size="lg">
              Proceed to Package Builder <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
