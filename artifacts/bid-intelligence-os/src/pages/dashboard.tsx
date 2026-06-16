import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seedBids, analyticsData } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSearch, UploadCloud, Package, Activity, AlertTriangle, TrendingUp, DollarSign, Target, ArrowRight } from "lucide-react";
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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Command Center</h2>
          <p className="text-slate-400 mt-1">Overview of your current bid pipeline and intelligence.</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Bids</CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeBids.length}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">In progress or submitted</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm hover:border-slate-700 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Win Rate (YTD)</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">42.5%</div>
              <p className="text-xs text-teal-400 mt-1 font-medium">+5% from last year</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confidence Avg</CardTitle>
              <Target className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">78<span className="text-sm font-normal text-slate-500">/100</span></div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Across active bids</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm hover:border-slate-700 transition-colors relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">${(openBidValue / 1000).toFixed(0)}k</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Potential revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Follow-Ups</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{followUpsDue}</div>
              <p className="text-xs text-yellow-500/80 mt-1 font-medium">Action required</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-red-400">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-red-400/80 mt-1 font-medium">Missing info</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/new-bid">
            <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-3 bg-slate-900/50 border-slate-800 hover:bg-teal-900/20 hover:text-teal-400 hover:border-teal-800/50 transition-all group shadow-sm">
              <FileSearch className="h-7 w-7 text-slate-400 group-hover:text-teal-400 transition-colors" />
              <span className="font-semibold tracking-wide">Start New Bid Analysis</span>
            </Button>
          </Link>
          <Link href="/bid-library">
            <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-3 bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group shadow-sm">
              <UploadCloud className="h-7 w-7 text-slate-400 group-hover:text-white transition-colors" />
              <span className="font-semibold tracking-wide">Import Bid History</span>
            </Button>
          </Link>
          <Link href="/package-builder">
            <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-3 bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group shadow-sm">
              <Package className="h-7 w-7 text-slate-400 group-hover:text-white transition-colors" />
              <span className="font-semibold tracking-wide">Build Bid Package</span>
            </Button>
          </Link>
          <Link href="/monitoring">
            <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-3 bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group shadow-sm">
              <Activity className="h-7 w-7 text-slate-400 group-hover:text-white transition-colors" />
              <span className="font-semibold tracking-wide">Monitor Submissions</span>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Bids Table - Spans 2 cols */}
          <Card className="md:col-span-2 flex flex-col bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-white">Active Pipeline</CardTitle>
                  <CardDescription className="text-slate-400">Recent bids requiring action or monitoring</CardDescription>
                </div>
                <Link href="/monitoring">
                  <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-teal-950/30">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-medium">Opportunity</TableHead>
                    <TableHead className="text-slate-400 font-medium">Value</TableHead>
                    <TableHead className="text-slate-400 font-medium">Status</TableHead>
                    <TableHead className="text-slate-400 font-medium">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBids.map((bid) => (
                    <TableRow key={bid.id} className="cursor-pointer hover:bg-slate-800/50 border-slate-800 transition-colors">
                      <TableCell className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{bid.name}</span>
                          <span className="text-xs text-slate-500 mt-0.5">{bid.recipient}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 font-medium">
                        ${bid.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`
                            ${bid.status === "Follow-Up Due" ? "bg-red-950/50 text-red-400 border-red-900/50" : ""}
                            ${bid.status === "Submitted" ? "bg-blue-950/50 text-blue-400 border-blue-900/50" : ""}
                            ${bid.status === "Shortlisted" ? "bg-purple-950/50 text-purple-400 border-purple-900/50" : ""}
                            ${bid.status === "Draft" ? "bg-slate-800/50 text-slate-300 border-slate-700/50" : ""}
                          `}
                        >
                          {bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-300 w-8">{bid.confidence ?? 50}%</span>
                          <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${bid.confidence ?? 50}%` }} />
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
            <Card className="bg-slate-900/80 border-slate-800 shadow-md">
              <CardHeader className="pb-2 border-b border-slate-800 mb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">Win Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.winRateOverTime.slice(-6)}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px' }}
                        itemStyle={{ color: '#14b8a6', fontWeight: 600 }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#14b8a6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-900/30 bg-teal-950/10 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-400 text-sm font-bold uppercase tracking-wider">
                  <Target className="h-4 w-4" />
                  Strategy Insights
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">Internal intel</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                    <span className="text-slate-300">Focus on <strong className="text-white font-semibold">Electrical</strong> bids where your win rate is highest (57%).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                    <span className="text-slate-300">Watch margin pressure on <strong className="text-white font-semibold">Terminal B Plumbing Upgrade</strong>.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-800/50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Decision-support guidance only. Outputs do not guarantee outcomes.</p>
        </div>
      </div>
    </Layout>
  );
}
