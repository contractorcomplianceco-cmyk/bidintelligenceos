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
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <Users className="h-8 w-8 text-teal-500" />
             Competitor Intelligence
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Market signals derived from lawful public and contractor-provided data.</p>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 shadow-md">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-lg text-white">Known Market Participants</CardTitle>
            <CardDescription className="text-slate-400">Activity tracked across your active pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
             {competitorSignals.map(signal => (
                <div key={signal.id} className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{signal.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{signal.activity}</p>
                  </div>
                  <Badge variant="outline" className={`
                    ${signal.threat === 'High' ? 'text-red-400 border-red-900/50 bg-red-950/30' : ''}
                    ${signal.threat === 'Medium' ? 'text-yellow-500 border-yellow-900/50 bg-yellow-950/30' : ''}
                    ${signal.threat === 'Low' ? 'text-slate-400 border-slate-700 bg-slate-800/50' : ''}
                  `}>
                    Threat Level: {signal.threat}
                  </Badge>
                </div>
             ))}
          </CardContent>
        </Card>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3 text-sm text-slate-400">
           <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0" />
           <p>All data is anonymized and aggregated from public plan rooms and voluntary opt-in networks. CCA BidIntelligenceOS does not scrape proprietary pricing.</p>
        </div>
      </div>
    </Layout>
  );
}
