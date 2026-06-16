import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { seedBids } from "@/lib/data";
import { Search, Plus, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BidLibrary() {
  const { toast } = useToast();

  const handleImport = () => {
    toast({
      title: "Importing...",
      description: "Processing CSV data into your bid library.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bid Library</h2>
            <p className="text-muted-foreground">Historical bid data and outcomes.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleImport}>
              <UploadCloud className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Past Bid
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search bids..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bid Name</TableHead>
                  <TableHead>Recipient / Client</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seedBids.map((bid) => (
                  <TableRow key={bid.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{bid.name}</TableCell>
                    <TableCell>{bid.recipient}</TableCell>
                    <TableCell>{bid.type}</TableCell>
                    <TableCell>${bid.amount.toLocaleString()}</TableCell>
                    <TableCell>{bid.date}</TableCell>
                    <TableCell>
                      <Badge variant={bid.status === "Won" ? "default" : bid.status === "Lost" ? "destructive" : "secondary"}>
                        {bid.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{bid.margin ? `${bid.margin}%` : "-"}</TableCell>
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
