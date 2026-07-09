import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activateOnKey } from "@shared/a11y";
import { Search, Plus, UploadCloud, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBids } from "@/hooks/use-bids";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";

export default function BidLibrary() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: bids = [] } = useBids();

  const handleImport = () => {
    toast({
      title: "Importing...",
      description: "Processing CSV data into your bid library.",
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bids;
    return bids.filter((b) =>
      [b.name, b.recipient, b.type, b.location, b.status, b.outcome ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, bids]);

  if (live && bids.length === 0) {
    return (
      <Layout>
        <div className="space-y-8 max-w-[1600px] mx-auto">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-teal-500" />
              Bid Library
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Historical bid data and outcomes.</p>
          </div>
          <OpsModuleEmpty
            module="Bid Library"
            description="Record bids and outcomes in Bid Intelligence to build your historical library."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-teal-500" />
              Bid Library
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Historical bid data and outcomes.</p>
            {!live && <div className="mt-2"><DemoDataBadge /></div>}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleImport} className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300 h-10 px-5">
              <UploadCloud className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button
              onClick={() => navigate("/new-bid")}
              className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg h-10 px-5 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Past Bid
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="p-5 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between sticky top-0 z-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bids, clients, or tags..."
                className="pl-9 bg-slate-950 border-slate-700 text-slate-200 focus-visible:ring-teal-500 h-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Bid Name</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Client</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Trade</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12 text-right">Value</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Date</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Outcome</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12 text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((bid) => (
                    <TableRow
                      key={bid.id}
                      onClick={() => navigate(`/bids/${bid.id}`)}
                      onKeyDown={activateOnKey(() => navigate(`/bids/${bid.id}`))}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open bid ${bid.name} details`}
                      className="cursor-pointer hover:bg-slate-800/60 border-slate-800/50 transition-colors group"
                    >
                      <TableCell className="font-semibold text-slate-200 py-4">{bid.name}</TableCell>
                      <TableCell className="text-slate-400">{bid.recipient}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                          {bid.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-300">${bid.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{bid.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            px-2.5 py-0.5 font-medium
                            ${bid.status === "Won" ? "bg-teal-950/40 text-teal-400 border-teal-900/50 shadow-[0_0_10px_rgba(20,184,166,0.1)]" : ""}
                            ${bid.status === "Lost" ? "bg-red-950/40 text-red-400 border-red-900/50" : ""}
                            ${!["Won", "Lost"].includes(bid.status) ? "bg-slate-800/50 text-slate-300 border-slate-700/50" : ""}
                          `}
                        >
                          {bid.outcome ?? bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-400">
                        {bid.margin ? <span className="text-slate-300">{bid.margin}%</span> : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow className="hover:bg-transparent border-slate-800/50">
                      <TableCell colSpan={7} className="text-center text-slate-500 py-12">
                        No bids match &ldquo;{query}&rdquo;.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
