import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { seedBids } from "@/lib/data";
import { Search, Calendar, Phone, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Monitoring() {
  const activeBids = seedBids.filter(b => ["Submitted", "Shortlisted", "Follow-Up Due"].includes(b.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">{status}</Badge>;
      case "Shortlisted":
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">{status}</Badge>;
      case "Follow-Up Due":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bid Monitoring</h2>
          <p className="text-muted-foreground">Track active submissions and manage client follow-ups.</p>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search active pipeline..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity / Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Expected Decision</TableHead>
                  <TableHead>Next Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeBids.map((bid) => (
                  <TableRow key={bid.id} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{bid.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        {bid.recipient}
                        {bid.clarificationRequested && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-500 text-[10px] ml-2">
                            Clarification Open
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      ${bid.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(bid.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {bid.contactPerson || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {bid.expectedDecisionDate || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {bid.nextAction}
                        <div className="text-xs text-muted-foreground mt-0.5">Last touch: {bid.lastTouch}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
