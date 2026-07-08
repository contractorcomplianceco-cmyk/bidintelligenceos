import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activateOnKey } from "@shared/a11y";
import { Search, Plus, UploadCloud, FolderKanban, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBids } from "@/hooks/use-bids";

export default function Bids() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");

  const handleImport = () => {
    toast({
      title: "Importing...",
      description: "Processing CSV data into your bids database.",
    });
  };

  const handleAdd = () => {
    toast({
      title: "New bid record",
      description: "Opening the guided new-bid analysis.",
    });
    navigate("/new-bid");
  };

  const { data: bids = [], isLoading } = useBids();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bids;
    return bids.filter((b) =>
      [b.name, b.recipient, b.type, b.location, b.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, bids]);

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-[#0A8A8F]" />
              Bids Workspace
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Manage active pipeline and historical bid data.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleImport} className="bg-white border-[#E2E8F0] hover:bg-slate-50 text-slate-700 h-10 px-5">
              <UploadCloud className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={handleAdd} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm h-10 px-5 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Bid Record
            </Button>
          </div>
        </div>

        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="p-5 bg-white border-b border-[#E2E8F0] flex flex-row items-center justify-between sticky top-0 z-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bids, clients, or tags..."
                className="pl-9 bg-white border-[#E2E8F0] text-slate-900 focus-visible:ring-[#2563EB] h-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-[#E2E8F0] hover:bg-transparent">
                    <TableHead className="text-slate-500 font-semibold uppercase tracking-wider text-xs h-12">Opportunity</TableHead>
                    <TableHead className="text-slate-500 font-semibold uppercase tracking-wider text-xs h-12">Client</TableHead>
                    <TableHead className="text-slate-500 font-semibold uppercase tracking-wider text-xs h-12 text-right">Value</TableHead>
                    <TableHead className="text-slate-500 font-semibold uppercase tracking-wider text-xs h-12">Status</TableHead>
                    <TableHead className="text-slate-500 font-semibold uppercase tracking-wider text-xs h-12">Next Action</TableHead>
                    <TableHead className="text-slate-500 font-semibold uppercase tracking-wider text-xs h-12 w-10"></TableHead>
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
                      className="cursor-pointer hover:bg-slate-50 border-[#E2E8F0] transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB]"
                    >
                      <TableCell className="font-semibold text-slate-900 py-4 group-hover:text-[#2563EB] transition-colors">{bid.name}</TableCell>
                      <TableCell className="text-slate-500">{bid.recipient}</TableCell>
                      <TableCell className="text-right font-medium text-slate-700">${bid.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            px-2.5 py-0.5 font-medium
                            ${bid.status === "Won" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                            ${bid.status === "Lost" ? "bg-red-50 text-red-700 border-red-200" : ""}
                            ${bid.status === "In Progress" || bid.status === "Review" ? "bg-sky-50 text-sky-700 border-sky-200" : ""}
                            ${!["Won", "Lost", "In Progress", "Review"].includes(bid.status) ? "bg-slate-100 text-slate-600 border-slate-200" : ""}
                          `}
                        >
                          {bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {bid.nextAction || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow className="hover:bg-transparent border-[#E2E8F0]">
                      <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                        No bids match "{query}".
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
