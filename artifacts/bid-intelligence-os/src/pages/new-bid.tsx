import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileSearch, Upload, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

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
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <FileSearch className="h-8 w-8 text-teal-500" />
             New Bid Analysis
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Input opportunity details to generate a preliminary scope analysis.</p>
        </div>

        <div className="relative">
          {/* Progress Connector line (visual only) */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800 z-0"></div>

          {/* STEP 1 */}
          <div className="relative z-10 flex gap-6 mb-8 opacity-100 transition-opacity">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors shadow-lg
              ${analyzed ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white'}
            `}>
              {analyzed ? <CheckCircle2 className="w-6 h-6" /> : "1"}
            </div>
            
            <Card className={`flex-1 bg-slate-900/80 border-slate-800 shadow-md transition-all duration-300 ${analyzed ? 'opacity-60 grayscale-[30%] pointer-events-none' : ''}`}>
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-white">Opportunity Details</CardTitle>
                <CardDescription className="text-slate-400">Basic metadata and specification documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opportunity Name</Label>
                    <Input placeholder="e.g. Terminal B HVAC Retrofit" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client / Recipient</Label>
                    <Input placeholder="e.g. Port Authority" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trade / Type</Label>
                    <Input placeholder="e.g. HVAC, Electrical..." className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</Label>
                    <Input placeholder="City, State" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-blue-400">Due Date</Label>
                    <Input type="date" className="bg-slate-950/50 border-blue-900/50 text-slate-200 focus-visible:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scope Summary / Narrative</Label>
                  <Textarea placeholder="Paste high-level scope or link to plan room..." className="h-24 bg-slate-950/50 border-slate-700 text-slate-300 resize-none focus-visible:ring-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specification Documents</Label>
                  <div className="p-8 border-2 border-dashed border-slate-700 rounded-lg bg-slate-950/30 hover:bg-slate-950/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">Drop specification documents here</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX, Plan sets</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-800 p-4 bg-slate-900">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">AI Extraction takes ~15 seconds</p>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={analyzing || analyzed}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg px-6 h-11"
                >
                  {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
                  {analyzing ? "Analyzing Documents..." : "Extract Scope Details"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* STEP 2 */}
          {analyzed && (
            <div className="relative z-10 flex gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 bg-teal-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                2
              </div>
              
              <Card className="flex-1 bg-slate-900/90 border-teal-900/50 shadow-2xl overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-blue-500"></div>
                <CardHeader className="border-b border-slate-800 pb-4 bg-slate-900">
                  <CardTitle className="text-lg text-teal-400 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" />
                     Extraction Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detected Scope Complexity</h4>
                    <div className="flex gap-2">
                      <div className="h-2 flex-1 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <div className="h-2 flex-1 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                      <div className="h-2 flex-1 rounded-full bg-slate-800" />
                    </div>
                    <p className="text-sm mt-3 text-slate-300 font-medium">Moderate-High <span className="text-slate-500 font-normal ml-2">Custom equipment ordering and tight schedule detected.</span></p>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4 text-yellow-500" /> Key Risk Factors
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-slate-200 font-medium block">Timeline Constraint</span>
                          <span className="text-slate-500">Submittals due in 4 days. Night-shift only access limits productivity.</span>
                        </div>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-slate-200 font-medium block">Missing Information</span>
                          <span className="text-slate-500">BMS integration specs are incomplete. Staging area not defined.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 border-t border-slate-800 p-4 bg-slate-900">
                  <Button variant="ghost" onClick={() => setAnalyzed(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">Review Inputs</Button>
                  <Link href="/scope-analyzer">
                    <Button className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg font-semibold px-6">
                      View Full Analysis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
