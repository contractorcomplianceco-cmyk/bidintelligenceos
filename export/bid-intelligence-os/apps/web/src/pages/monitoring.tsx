import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { seedBids } from "@core/data";
import { Search, Calendar, Phone, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Monitoring() {
  const activeBids = seedBids.filter(b => ["Submitted", "Shortlisted", "Follow-Up Due"].includes(b.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Badge variant="outline" className="bg-blue-950/40 text-blue-400 border-blue-900/50 px-2.5 py-0.5">{status}</Badge>;
      case "Shortlisted":
        return <Badge variant="outline" className="bg-purple-950/40 text-purple-400 border-purple-900/50 px-2.5 py-0.5 shadow-[0_0_10px_rgba(168,85,247,0.15)]">{status}</Badge>;
      case "Follow-Up Due":
        return <Badge variant="outline" className="bg-red-950/40 text-red-400 border-red-900/50 px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">{status}</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <Activity className="h-8 w-8 text-teal-500" />
             Bid Monitoring
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Track active submissions and manage client follow-ups.</p>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="p-5 bg-slate-900 border-b border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search active pipeline..." 
                className="pl-9 bg-slate-950 border-slate-700 text-slate-200 focus-visible:ring-teal-500 h-10" 
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Opportunity / Client</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12 text-right">Amount</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Status</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Contact Person</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Expected Decision</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Next Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBids.map((bid) => (
                    <TableRow key={bid.id} className="group cursor-pointer hover:bg-slate-800/60 border-slate-800/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="font-semibold text-slate-200">{bid.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                          {bid.recipient}
                          {bid.clarificationRequested && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-950/30 text-yellow-500 border border-yellow-900/50 text-[10px] font-bold uppercase tracking-widest">
                              Clarification Open
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-300 text-right">
                        ${bid.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(bid.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          {bid.contactPerson || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {bid.expectedDecisionDate || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-200">
                          {bid.nextAction}
                          <div className="text-xs font-normal text-slate-500 mt-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block"></span>
                            Last touch: {bid.lastTouch}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
