import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seedBids, analyticsData } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSearch, UploadCloud, Package, Activity, AlertTriangle, TrendingUp, DollarSign, Crosshair, Target } from "lucide-react";
import { Link } from "wouter";
import { useAppContext } from "@/lib/context";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { mode } = useAppContext();
  const activeBids = seedBids.filter(b => b.status === "Submitted" || b.status === "Shortlisted" || b.status === "Draft" || b.status === "Follow-Up Due");
  const openBidValue = activeBids.reduce((acc, bid) => acc + bid.amount, 0);
  const followUpsDue = activeBids.filter(b => b.status === "Follow-Up Due").length;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your current bid pipeline and intelligence.</p>
        </div>

        {/* KPIs - Expanded to 6 */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Active Bids</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{activeBids.length}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress or submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Win Rate (YTD)</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">42.5%</div>
              <p className="text-xs text-muted-foreground mt-1 text-primary">+5% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Bid Confidence Avg</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">78/100</div>
              <p className="text-xs text-muted-foreground mt-1">Across all active bids</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Open Bid Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${(openBidValue / 1000).toFixed(0)}k</div>
              <p className="text-xs text-muted-foreground mt-1">Potential pipeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Follow-Ups Due</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{followUpsDue}</div>
              <p className="text-xs text-muted-foreground mt-1 text-yellow-500">Action required</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-destructive">Missing Info Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground mt-1">Requires your attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/new-bid">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
              <FileSearch className="h-6 w-6" />
              <span>Start New Bid Analysis</span>
            </Button>
          </Link>
          <Link href="/bid-library">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
              <UploadCloud className="h-6 w-6" />
              <span>Import Bid History</span>
            </Button>
          </Link>
          <Link href="/package-builder">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
              <Package className="h-6 w-6" />
              <span>Build Bid Package</span>
            </Button>
          </Link>
          <Link href="/monitoring">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
              <Activity className="h-6 w-6" />
              <span>Monitor Submitted Bids</span>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Bids Table - Spans 2 cols */}
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle>Active Bids & Pipeline</CardTitle>
              <CardDescription>Recent bids requiring action or monitoring</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bid Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBids.map((bid) => (
                    <TableRow key={bid.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{bid.name}</span>
                          <span className="text-xs text-muted-foreground">{bid.recipient}</span>
                        </div>
                      </TableCell>
                      <TableCell>${bid.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={bid.status === "Follow-Up Due" ? "destructive" : "secondary"}>
                          {bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{bid.confidence ?? 50}%</span>
                          <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${bid.confidence ?? 50}%` }} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Insights / Strategy Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Win Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.winRateOverTime.slice(-6)}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Crosshair className="h-4 w-4" />
                  Strategy Insights
                </CardTitle>
                <CardDescription className="text-xs">Internal strategy hidden from vendor-facing package.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5" />
                    <span>Focus on <strong>Electrical</strong> bids where your win rate is highest (57%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5" />
                    <span>Watch margin pressure on <strong>Terminal B Plumbing Upgrade</strong>.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">Decision-support guidance only. Outputs do not guarantee bid outcomes.</p>
        </div>
      </div>
    </Layout>
  );
}
