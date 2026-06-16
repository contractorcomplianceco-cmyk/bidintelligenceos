import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Check, AlertTriangle, FileCheck } from "lucide-react";

export default function PackageBuilder() {
  const { toast } = useToast();
  const [reviewed, setReviewed] = useState(false);

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${format}`,
      description: "Compiling final vendor-facing document...",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bid Package Builder</h2>
            <p className="text-muted-foreground">Draft and preview the final document sent to the client.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast({ title: "Draft Saved" })}>Save Draft</Button>
            <Button 
              variant={reviewed ? "secondary" : "default"} 
              onClick={() => setReviewed(!reviewed)}
            >
              <Check className="h-4 w-4 mr-2" />
              {reviewed ? "Marked as Reviewed" : "Mark Reviewed"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="builder" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none px-0 bg-transparent h-auto pb-px">
            <TabsTrigger 
              value="builder" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              Document Builder
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              Export Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="flex-1 mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover & Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Document Title</Label>
                      <Input defaultValue="Proposal for Terminal B HVAC Retrofit" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prepared For</Label>
                      <Input defaultValue="Jane Smith, Port Authority Facilities" />
                    </div>
                    <div className="space-y-2">
                      <Label>Executive Summary</Label>
                      <Textarea 
                        className="min-h-[120px]"
                        defaultValue="Acme Commercial Trades is pleased to submit this proposal for the Terminal B HVAC Retrofit. Leveraging our extensive experience in secure facility environments and night-shift logistics, we guarantee minimal operational disruption..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scope & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Scope of Work Description</Label>
                      <Textarea 
                        className="min-h-[100px]"
                        defaultValue="Provide all labor, materials, and equipment to replace three (3) rooftop RTUs, modify existing ductwork, and integrate new systems into the existing BACnet BMS as per specs section 23 09 00."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Base Bid Amount</Label>
                        <Input defaultValue="$320,000.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Timeline / Schedule</Label>
                        <Input defaultValue="8 Weeks from NTP" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assumptions & Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Key Assumptions</Label>
                      <Textarea 
                        className="min-h-[80px]"
                        defaultValue="- Unrestricted access to staging area during night shifts (10PM - 5AM)
- Existing structural pads meet load requirements for new RTUs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exclusions</Label>
                      <Textarea 
                        className="min-h-[80px]"
                        defaultValue="- Hazardous material abatement or testing
- Structural engineering or concrete pad replacement
- Permit fees (to be paid by owner)"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Required Attachments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="h-4 w-4 text-accent" />
                      <span>Bid Form 00410</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="h-4 w-4 text-accent" />
                      <span>Subcontractor List</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="h-4 w-4 text-accent" />
                      <span>Non-Collusion Affidavit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="h-4 w-4 text-accent" />
                      <span>5% Bid Bond</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed rounded p-2 justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                      + Add Custom Attachment
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 p-4 rounded-lg border border-border text-center space-y-3">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Internal strategy notes (margins, risk scores, negotiation tactics) are automatically excluded from this builder and the final export.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 mt-6">
            <div className="max-w-3xl mx-auto bg-white text-black p-12 rounded shadow-sm min-h-[800px] border border-border space-y-8">
              {/* Document Mockup */}
              <div className="border-b-2 border-slate-200 pb-6 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Acme Commercial Trades</h1>
                  <p className="text-slate-500 mt-1">123 Industrial Way, Seattle WA 98101</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-700">PROPOSAL</p>
                  <p className="text-slate-500">Date: Oct 28, 2023</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Project Details</h2>
                  <p><strong>To:</strong> Jane Smith, Port Authority Facilities</p>
                  <p><strong>Project:</strong> Terminal B HVAC Retrofit</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Executive Summary</h2>
                  <p className="text-slate-700 leading-relaxed">
                    Acme Commercial Trades is pleased to submit this proposal for the Terminal B HVAC Retrofit. Leveraging our extensive experience in secure facility environments and night-shift logistics, we guarantee minimal operational disruption to airport activities while delivering premium mechanical upgrades.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Scope & Pricing</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Provide all labor, materials, and equipment to replace three (3) rooftop RTUs, modify existing ductwork, and integrate new systems into the existing BACnet BMS as per specs section 23 09 00.
                  </p>
                  <div className="bg-slate-50 p-4 rounded font-medium flex justify-between">
                    <span>Base Bid Amount:</span>
                    <span className="text-slate-900">$320,000.00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Assumptions</h2>
                    <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                      <li>Unrestricted access to staging area (10PM - 5AM)</li>
                      <li>Existing structural pads meet load requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Exclusions</h2>
                    <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                      <li>Hazardous material abatement</li>
                      <li>Structural engineering</li>
                      <li>Permit fees</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => handleExport("PDF")} className="w-40">
                <FileText className="mr-2 h-4 w-4" /> Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport("DOCX")} className="w-40">
                <Download className="mr-2 h-4 w-4" /> Export DOCX
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
