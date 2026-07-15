import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileSearch, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useCreateBid, useRequestScopeAnalysis } from "@/hooks/use-bids";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useToast } from "@/hooks/use-toast";
import { BidIntelligencePanel } from "@/components/bid-intelligence-panel";
import { BidDocumentsPanel } from "@/components/bid-documents-panel";
import { BIDOS_OPTIONAL_TRADES, tradeLabelForId } from "@/lib/trade-options";
import { US_STATES, composeBidLocation } from "@/lib/us-states";

export default function NewBid() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const createBid = useCreateBid();
  const analyze = useRequestScopeAnalysis();

  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tradeId, setTradeId] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zip, setZip] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [scopeSummary, setScopeSummary] = useState("");
  const [savedBidId, setSavedBidId] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [saving, setSaving] = useState(false);

  const location = useMemo(
    () => composeBidLocation(city, stateCode, zip),
    [city, stateCode, zip],
  );

  const handleSaveDraft = async (): Promise<string | null> => {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Enter an opportunity name.", variant: "destructive" });
      return null;
    }
    if (!tradeId) {
      toast({ title: "Trade required", description: "Select a trade for this bid.", variant: "destructive" });
      return null;
    }
    if (!live) {
      toast({
        title: "Demo mode",
        description: "Sign in to save live bid drafts to your workspace.",
      });
      return null;
    }
    setSaving(true);
    try {
      const result = await createBid.mutateAsync({
        name,
        recipient,
        type: tradeId ? tradeLabelForId(tradeId) : "",
        location,
        date: dueDate || new Date().toISOString().slice(0, 10),
        scopeSummary,
        status: "Draft",
      });
      setSavedBidId(result.bid.id);
      toast({ title: "Draft saved", description: "Bid opportunity saved to your pipeline." });
      return result.bid.id;
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Could not save bid",
        variant: "destructive",
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!live) {
      toast({
        title: "Demo mode",
        description: "Sign in to queue scope analysis on a saved bid.",
      });
      return;
    }
    setSaving(true);
    try {
      let bidId = savedBidId;
      if (!bidId) {
        bidId = await handleSaveDraft();
      }
      if (!bidId) return;
      await analyze.mutateAsync({ bidId, scopeSummary });
      setAnalyzed(true);
      toast({
        title: "Analysis queued",
        description: "Preliminary scope analysis complete — human review required.",
      });
    } catch (e) {
      toast({
        title: "Analysis failed",
        description: e instanceof Error ? e.message : "Could not run analysis",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <FileSearch className="h-8 w-8 text-teal-600" />
             New Bid Analysis
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Save a draft opportunity, then queue scope analysis for reviewer approval.</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#E2E8F0] z-0"></div>

          <div className="relative z-10 flex gap-6 mb-8 opacity-100 transition-opacity">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors shadow-sm
              ${analyzed ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white'}
            `}>
              {analyzed ? <CheckCircle2 className="w-6 h-6" /> : "1"}
            </div>
            
            <Card className={`flex-1 bg-white border-[#E2E8F0] shadow-sm transition-all duration-300 ${analyzed ? 'opacity-60 grayscale-[30%]' : ''}`}>
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900">Opportunity Details</CardTitle>
                <CardDescription className="text-slate-500">Basic metadata and specification documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opportunity Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Terminal B HVAC Retrofit" className="bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Client / Recipient</Label>
                    <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Port Authority" className="bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trade / Type</Label>
                    <Select value={tradeId || undefined} onValueChange={setTradeId}>
                      <SelectTrigger className="bg-white border-[#E2E8F0] text-slate-700 focus:ring-blue-500">
                        <SelectValue placeholder="Select trade" />
                      </SelectTrigger>
                      <SelectContent>
                        {BIDOS_OPTIONAL_TRADES.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Due Date</Label>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-white border-blue-200 text-slate-700 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                      <div className="sm:col-span-3 space-y-1">
                        <Label className="text-[11px] text-slate-500">City</Label>
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Sarasota"
                          className="bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-blue-500"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-[11px] text-slate-500">State</Label>
                        <Select value={stateCode || undefined} onValueChange={setStateCode}>
                          <SelectTrigger className="bg-white border-[#E2E8F0] text-slate-700 focus:ring-blue-500">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((s) => (
                              <SelectItem key={s.code} value={s.code}>
                                {s.code} — {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-1 space-y-1">
                        <Label className="text-[11px] text-slate-500">ZIP</Label>
                        <Input
                          value={zip}
                          onChange={(e) => setZip(e.target.value.replace(/[^\d-]/g, "").slice(0, 10))}
                          placeholder="34236"
                          inputMode="numeric"
                          className="bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>
                    {location ? (
                      <p className="text-[11px] text-slate-500 pt-1">Saved as: {location}</p>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scope Summary / Narrative</Label>
                  <Textarea value={scopeSummary} onChange={(e) => setScopeSummary(e.target.value)} placeholder="Paste high-level scope or link to plan room..." className="h-24 bg-white border-[#E2E8F0] text-slate-700 resize-none focus-visible:ring-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specification Documents</Label>
                  <BidDocumentsPanel bidId={savedBidId} live={live} />
                </div>
              </CardContent>
              {location.trim() && (
                <div className="px-6 pb-2">
                  <BidIntelligencePanel mode="state" location={location} />
                </div>
              )}
              <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Human review required on all AI output</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving || analyzed}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save draft
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleAnalyze} 
                    disabled={saving || analyzed}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm px-6 h-11"
                  >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
                    Queue scope analysis
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {analyzed && (
            <div className="relative z-10 flex gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 bg-teal-600 text-white shadow-sm">
                2
              </div>
              
              <Card className="flex-1 bg-white border-teal-200 shadow-sm overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-blue-500"></div>
                <CardHeader className="border-b border-[#E2E8F0] pb-4 bg-[#F8FAFC]">
                  <CardTitle className="text-lg text-[#0A8A8F] flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" />
                     Draft saved — analysis queued
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>Preliminary scores are decision-support only. A reviewer must approve before client distribution.</p>
                  </div>
                  {savedBidId && (
                    <Link href={`/scope-analyzer?bidId=${savedBidId}`} className="inline-flex items-center gap-2 text-[#0284C7] font-semibold hover:underline">
                      Open scope analyzer <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {savedBidId && (
                    <Link href={`/bids/${savedBidId}`} className="inline-flex items-center gap-2 text-slate-600 text-sm hover:underline">
                      View bid record
                    </Link>
                  )}
                  {savedBidId && live && (
                    <BidIntelligencePanel mode="bid" bidId={savedBidId} location={location} live={live} />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
