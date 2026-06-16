import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function NewBid() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Bid Analysis</h2>
          <p className="text-muted-foreground">Input opportunity details to generate a preliminary scope analysis.</p>
        </div>

        {!analyzed ? (
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opportunity Name</Label>
                  <Input placeholder="e.g. Terminal B HVAC Retrofit" />
                </div>
                <div className="space-y-2">
                  <Label>Recipient / Client</Label>
                  <Input placeholder="e.g. Port Authority" />
                </div>
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Input placeholder="e.g. HVAC, Electrical..." />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="City, State" />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label>Scope Summary</Label>
                <Textarea placeholder="Paste high-level scope or link to plan room..." className="h-32" />
              </div>
              <div className="p-4 border border-dashed rounded-md bg-muted/20 text-center text-sm text-muted-foreground">
                Drop specification documents here (PDF, DOCX) - Prototype only
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">Decision-support guidance only.</p>
              <Button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {analyzing ? "Analyzing Scope..." : "Analyze Scope"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-primary">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-primary">Scope Analyzer Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h4 className="font-semibold mb-2">Scope Complexity</h4>
                <div className="flex gap-2">
                  <div className="h-2 flex-1 rounded bg-red-500" />
                  <div className="h-2 flex-1 rounded bg-yellow-500" />
                  <div className="h-2 flex-1 rounded bg-muted" />
                </div>
                <p className="text-sm mt-2 text-muted-foreground">Moderate-High. Custom equipment ordering required.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Required Clarification Questions</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Is there an approved staging area for the chiller delivery?</li>
                  <li>Confirm prevailing wage requirements for this specific site.</li>
                  <li>Are we responsible for structural pad modifications?</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Risk Level</h4>
                <p className="text-sm text-muted-foreground">Deadline Risk: High. Submittals due in 4 days.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setAnalyzed(false)}>Edit Inputs</Button>
              <Button>Proceed to Cost Inputs</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
