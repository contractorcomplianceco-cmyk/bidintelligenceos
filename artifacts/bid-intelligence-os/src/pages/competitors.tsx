import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck } from "lucide-react";
import { competitorSignals } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function Competitors() {
  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <Users className="h-8 w-8 text-teal-600" />
             Competitor Intelligence
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Market signals derived from lawful public and contractor-provided data.</p>
        </div>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader className="border-b border-[#E2E8F0] pb-4">
            <CardTitle className="text-lg text-slate-900">Known Market Participants</CardTitle>
            <CardDescription className="text-slate-500">Activity tracked across your active pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
             {competitorSignals.map(signal => (
                <div key={signal.id} className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{signal.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{signal.activity}</p>
                  </div>
                  <Badge variant="outline" className={`
                    ${signal.threat === 'High' ? 'text-red-700 border-red-200 bg-red-50' : ''}
                    ${signal.threat === 'Medium' ? 'text-amber-700 border-amber-200 bg-amber-50' : ''}
                    ${signal.threat === 'Low' ? 'text-slate-600 border-[#E2E8F0] bg-slate-100' : ''}
                  `}>
                    Threat Level: {signal.threat}
                  </Badge>
                </div>
             ))}
          </CardContent>
        </Card>

        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] flex items-center gap-3 text-sm text-slate-500">
           <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
           <p>All data is anonymized and aggregated from public plan rooms and voluntary opt-in networks. CCA BidIntelligenceOS does not scrape proprietary pricing.</p>
        </div>
      </div>
    </Layout>
  );
}
