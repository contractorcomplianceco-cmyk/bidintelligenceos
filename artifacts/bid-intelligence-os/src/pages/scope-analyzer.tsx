import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ScopeAnalyzer() {
  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scope Analyzer</h2>
          <p className="text-muted-foreground">AI-assisted extraction and risk analysis of your opportunity's scope.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Extracted Scope Summary</CardTitle>
                <CardDescription>Synthesized from 4 uploaded specification documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  <strong>Project:</strong> Terminal B HVAC Retrofit & Piping Upgrade<br />
                  <strong>Core Deliverables:</strong> Replacement of 3 rooftop RTUs, modification of existing ductwork to support new layout, integration into existing Building Management System (BMS), and replacement of associated chilled water piping.
                </p>
                <p>
                  <strong>Timeline:</strong> Phased delivery over 8 weeks, strictly restricted to night shifts (10 PM - 5 AM) due to airport operations.
                </p>
                <div className="p-3 bg-muted/30 rounded-md border border-border">
                  <div className="flex gap-2 items-start">
                    <Info className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <span className="font-semibold text-primary">Key Complexity Indicator</span>
                      <p className="text-muted-foreground mt-1">Requires specialized rigging for rooftop units and strict adherence to TSA security protocols for all site personnel.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Clarification Questions (RFIs)</CardTitle>
                <CardDescription>Items missing or ambiguous in the provided scope.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">BMS Integration Specs</p>
                      <p className="text-xs text-muted-foreground">Is the existing BMS BACnet compatible, or will gateways be required? (Missing from Sec 23 09 00)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Staging Area</p>
                      <p className="text-xs text-muted-foreground">No defined staging area for crane rigging and equipment delivery in the logistics plan.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Document Checklist</CardTitle>
                <CardDescription>Ensure all forms are completed before export.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Bid Form 00410",
                    "List of Proposed Subcontractors",
                    "Non-Collusion Affidavit",
                    "Bid Bond (5%)",
                    "Safety Record / EMR Documentation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox id={`doc-${i}`} defaultChecked={i < 2} />
                      <label htmlFor={`doc-${i}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-destructive/50">
              <CardHeader className="bg-destructive/5 pb-4">
                <CardTitle className="text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Overall Risk Level</span>
                    <span className="text-xs text-destructive font-bold">HIGH</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="destructive" className="w-full justify-start">Deadline Risk: High</Badge>
                  <p className="text-xs text-muted-foreground pl-1">Bids due in 3 days. Submittals missing.</p>
                  
                  <Badge variant="secondary" className="w-full justify-start text-yellow-500 border-yellow-500/30">Schedule Risk: Moderate</Badge>
                  <p className="text-xs text-muted-foreground pl-1">Night shift only operations.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Scope Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="h-2 flex-1 rounded bg-destructive" />
                  <div className="h-2 flex-1 rounded bg-yellow-500" />
                  <div className="h-2 flex-1 rounded bg-muted" />
                  <div className="h-2 flex-1 rounded bg-muted" />
                </div>
                <p className="text-xs mt-3 text-muted-foreground">Moderate-High. Specialized rigging and phasing coordination required.</p>
              </CardContent>
            </Card>
            
            <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-4">
              <p className="text-xs text-muted-foreground text-center">
                Review extracted data carefully. Decision-support guidance only.
              </p>
              <Link href="/cost-inputs">
                <Button className="w-full">
                  Proceed to Cost Inputs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
