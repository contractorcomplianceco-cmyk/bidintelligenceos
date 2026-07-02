import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, ArrowRight, Search, FileText, CheckSquare } from "lucide-react";
import { Link } from "wouter";

export default function ScopeAnalyzer() {
  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
               <Search className="h-8 w-8 text-teal-600" />
               Scope Analyzer
            </h2>
            <p className="text-slate-500 mt-2 text-lg">AI-assisted extraction and risk analysis of your opportunity's scope.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E2E8F0] shadow-sm">
             <span className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
             </span>
             <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Analysis Complete</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-teal-500"></div>
              <CardHeader className="border-b border-[#E2E8F0] pb-4 bg-[#F8FAFC]">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  Extracted Scope Summary
                </CardTitle>
                <CardDescription className="text-slate-500">Synthesized from 4 uploaded specification documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</span>
                  <p className="text-slate-900 font-medium text-base">Terminal B HVAC Retrofit & Piping Upgrade</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Core Deliverables</span>
                  <p className="text-slate-700 leading-relaxed">
                    Replacement of 3 rooftop RTUs, modification of existing ductwork to support new layout, integration into existing Building Management System (BMS), and replacement of associated chilled water piping.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timeline / Phasing</span>
                  <p className="text-slate-700 leading-relaxed">
                    Phased delivery over 8 weeks, strictly restricted to night shifts (10 PM - 5 AM) due to airport operations.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-3 items-start">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-blue-700">Key Complexity Indicator</span>
                      <p className="text-slate-700 mt-1 leading-relaxed">Requires specialized rigging for rooftop units and strict adherence to TSA security protocols for all site personnel.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900">Required Clarifications (RFIs)</CardTitle>
                <CardDescription className="text-slate-500">Items missing or ambiguous in the provided documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="flex gap-4 p-3 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-[#E2E8F0]">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">BMS Integration Specs</p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">Is the existing BMS BACnet compatible, or will gateways be required? <span className="text-slate-500 text-xs ml-1">(Missing from Sec 23 09 00)</span></p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-[#E2E8F0]">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Staging Area Logistics</p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">No defined staging area for crane rigging and equipment delivery in the logistics plan.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            <Card className="bg-white border-red-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <AlertTriangle className="h-32 w-32 text-red-500" />
              </div>
              <CardHeader className="bg-red-50 pb-4 border-b border-red-200 relative z-10">
                <CardTitle className="text-red-700 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Risk Level</span>
                    <span className="text-xs text-red-700 font-bold uppercase tracking-wider">HIGH</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start bg-red-50 text-red-700 border-red-200 font-semibold py-1">Deadline Risk: High</Badge>
                    <p className="text-xs text-slate-500 pl-1 font-medium">Bids due in 3 days. Submittals missing.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start bg-amber-50 text-amber-700 border-amber-200 font-semibold py-1">Schedule Risk: Moderate</Badge>
                    <p className="text-xs text-slate-500 pl-1 font-medium">Night shift only operations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="pb-3 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Required Forms
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {[
                    "Bid Form 00410",
                    "List of Proposed Subcontractors",
                    "Non-Collusion Affidavit",
                    "Bid Bond (5%)",
                    "Safety Record / EMR"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 group">
                      <Checkbox 
                        id={`doc-${i}`} 
                        defaultChecked={i < 2} 
                        className="border-[#CBD5E1] data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500" 
                      />
                      <label 
                        htmlFor={`doc-${i}`} 
                        className="text-sm font-medium text-slate-700 group-hover:text-slate-900 cursor-pointer transition-colors leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl space-y-5 shadow-sm">
              <p className="text-xs text-slate-500 text-center font-medium uppercase tracking-widest">
                Review data carefully. Guidance only.
              </p>
              <Link href="/cost-inputs">
                <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-sm h-12 text-md">
                  Proceed to Cost Inputs <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
