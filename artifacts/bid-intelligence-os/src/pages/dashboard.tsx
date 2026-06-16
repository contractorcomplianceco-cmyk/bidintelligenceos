import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { seedBids, followUpQueue, competitorSignals, documentReadiness, analyticsData } from "@/lib/data";
import { 
  FolderKanban, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Target, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function Dashboard() {
  const activeBids = seedBids.filter(b => b.status === "In Progress" || b.status === "Review");

  return (
    <Layout>
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <FolderKanban className="w-10 h-10 text-[#38BDF8]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <FolderKanban className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">Active Bids</span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">28</div>
              <p className="text-[10px] text-[#22C55E] mt-1 font-medium tracking-wide">↑ 6 vs last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">Follow-Ups Due</span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">7</div>
              <p className="text-[10px] text-yellow-500 mt-1 font-medium tracking-wide">3 due today</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign className="w-10 h-10 text-[#22C55E]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">Open Bid Value</span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">$18.74M</div>
              <p className="text-[10px] text-[#22C55E] mt-1 font-medium tracking-wide">↑ $2.31M vs last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-10 h-10 text-[#38BDF8]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">Win Rate</span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">63%</div>
              <p className="text-[10px] text-[#22C55E] mt-1 font-medium tracking-wide">↑ 7pp vs last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-10 h-10 text-purple-400" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">Average Confidence</span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">74%</div>
              <p className="text-[10px] text-[#22C55E] mt-1 font-medium tracking-wide">↑ 6pp vs last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row: Active Bids & Follow-Ups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                ACTIVE BIDS
              </CardTitle>
              <Link href="/bids" className="text-xs text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-medium">
                View All Bids <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#151D2E] border-b border-[#1C253B]">
                  <tr>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap">Project</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap">Recipient</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap">Due Date</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap text-right">Bid Value</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap text-center">Fit</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap text-center">Confidence</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest whitespace-nowrap">Next Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C253B]">
                  {activeBids.map(bid => (
                    <tr key={bid.id} className="hover:bg-[#151D2E] transition-colors cursor-pointer">
                      <td className="px-2.5 py-3">
                        <div className="font-semibold text-white text-xs">{bid.name}</div>
                        <div className="text-[10px] text-[#8A96B0] mt-0.5">{bid.location}</div>
                      </td>
                      <td className="px-2.5 py-3">
                        <div className="text-xs text-white">{bid.recipient}</div>
                        <div className={`inline-block mt-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded ${bid.publicPrivate === 'Public' ? 'bg-[#38BDF8]/10 text-[#38BDF8]' : 'bg-purple-500/10 text-purple-400'}`}>
                          {bid.publicPrivate}
                        </div>
                      </td>
                      <td className="px-2.5 py-3">
                        <div className="text-xs text-white">{bid.date}</div>
                        <div className="text-[10px] text-yellow-500 mt-0.5">{bid.daysRemaining} days remaining</div>
                      </td>
                      <td className="px-2.5 py-3 text-right font-medium text-white text-xs">
                        ${(bid.amount / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-2.5 py-3 text-center">
                        <div className="relative inline-flex items-center justify-center w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90">
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-[#1C253B]" />
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={88} strokeDashoffset={88 - (88 * (bid.fit || 0)) / 100} className="text-[#38BDF8]" strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-[9px] font-bold text-white">{bid.fit}%</span>
                        </div>
                      </td>
                      <td className="px-2.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ShieldCheck className={`w-3.5 h-3.5 ${bid.confidence && bid.confidence > 75 ? 'text-[#22C55E]' : 'text-yellow-500'}`} />
                          <span className="text-xs font-bold text-white">{bid.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-2.5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${bid.status === 'In Progress' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                          {bid.status}
                        </span>
                      </td>
                      <td className="px-2.5 py-3">
                        <div className="text-xs text-white">{bid.nextAction}</div>
                        <div className="text-[10px] text-[#8A96B0] mt-0.5">by {bid.nextActionDate}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#151D2E] border-t border-[#1C253B]">
                  <tr>
                    <td colSpan={3} className="px-2.5 py-3 text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest">Total Open Bid Value</td>
                    <td className="px-2.5 py-3 text-right font-bold text-[#38BDF8] text-xs">$18.74M</td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                FOLLOW-UP QUEUE
              </CardTitle>
              <Link href="/leads" className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium">
                View All (7)
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-[#1C253B] flex-1 overflow-y-auto">
                {followUpQueue.map(item => (
                  <div key={item.id} className="p-4 hover:bg-[#151D2E] transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-white text-xs group-hover:text-[#38BDF8] transition-colors">{item.client}</div>
                      <div className="bg-[#1C253B] text-[#8A96B0] text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {item.date}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-[#8A96B0]">{item.action}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${item.priority === 'High' ? 'text-red-400 bg-red-400/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                        {item.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#1C253B] mt-auto">
                <Link href="/leads" className="w-full">
                  <button className="w-full py-2 bg-[#1C253B] hover:bg-[#2A3756] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2">
                    Open Follow-Up Queue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: 4 Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide">BID OUTCOME TIMELINE</CardTitle>
              <select className="bg-[#1C253B] border border-[#2A3756] text-[#8A96B0] text-[10px] font-bold uppercase tracking-widest rounded px-2 py-1 outline-none">
                <option>Last 12 Months</option>
              </select>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-[#22C55E]"><span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>Won ($14.2M)</div>
                <div className="flex items-center gap-1.5 text-[#EF4444]"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Lost ($6.7M)</div>
                <div className="flex items-center gap-1.5 text-[#8A96B0]"><span className="w-2 h-2 rounded-full bg-[#8A96B0]"></span>No Decision ($2.1M)</div>
              </div>
              <div className="h-40 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.bidOutcomeTimeline} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C253B" vertical={false} />
                    <XAxis dataKey="month" stroke="#8A96B0" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8A96B0" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0F1830', borderColor: '#1C253B', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="won" stackId="1" stroke="#22C55E" fill="url(#colorWon)" />
                    <Area type="monotone" dataKey="noDecision" stackId="2" stroke="#8A96B0" fill="transparent" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="lost" stackId="3" stroke="#EF4444" fill="url(#colorLost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide">COMPETITOR SIGNALS</CardTitle>
              <Link href="/competitors" className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-[#1C253B]">
                {competitorSignals.map(signal => (
                  <div key={signal.id} className="p-4 flex items-center justify-between hover:bg-[#151D2E] transition-colors cursor-pointer">
                    <div>
                      <div className="font-semibold text-white text-xs">{signal.name}</div>
                      <div className="text-[11px] text-[#8A96B0] mt-0.5">{signal.activity}</div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      signal.threat === 'High' ? 'text-red-400 bg-red-400/10' : 
                      signal.threat === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' : 
                      'text-slate-400 bg-slate-400/10'
                    }`}>
                      {signal.threat} {signal.trend === 'up' ? '↑' : signal.trend === 'down' ? '↓' : '—'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 mt-auto">
                <Link href="/competitors" className="text-xs text-[#8A96B0] hover:text-[#38BDF8] transition-colors flex items-center gap-1 font-medium">
                  See full competitor intelligence <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B]">
              <CardTitle className="text-sm font-bold text-white tracking-wide">DOCUMENT READINESS</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#1C253B]" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.92)} className="text-[#38BDF8]" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-sm font-bold text-white">92%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide">Package Completeness</h4>
                  <p className="text-[11px] text-[#8A96B0] leading-snug">Most core documents are verified. W-9 requires attention.</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {documentReadiness.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {doc.status === 'complete' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-yellow-500" />
                      )}
                      <span className={`text-[11px] ${doc.status === 'complete' ? 'text-[#8A96B0]' : 'text-white font-medium'}`}>{doc.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                 <Link href="/documents" className="text-xs text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-medium">
                  View Document Checklist <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide">WIN / LOSS LEARNING</CardTitle>
              <Link href="/insights" className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium">
                View Insights
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 16 }, { value: 8 }, { value: 2 }]}
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#22C55E" />
                        <Cell fill="#EF4444" />
                        <Cell fill="#8A96B0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white mb-2">26 Total Outcomes</div>
                  <div className="space-y-1 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex justify-between text-[#22C55E]"><span>Won (16)</span><span>62%</span></div>
                    <div className="flex justify-between text-[#EF4444]"><span>Lost (8)</span><span>31%</span></div>
                    <div className="flex justify-between text-[#8A96B0]"><span>No Decision (2)</span><span>7%</span></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-5 p-3 bg-[#151D2E] rounded border border-[#1C253B]">
                <div>
                  <span className="text-[10px] text-[#8A96B0] uppercase tracking-widest block mb-0.5">Top Win Factor</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white">Responsiveness</span>
                    <span className="text-xs font-bold text-[#22C55E]">85%</span>
                  </div>
                </div>
                <div className="h-px w-full bg-[#1C253B]"></div>
                <div>
                  <span className="text-[10px] text-[#8A96B0] uppercase tracking-widest block mb-0.5">Top Loss Factor</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white">Competitor Price</span>
                    <span className="text-xs font-bold text-[#EF4444]">62%</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest">Margin Trend</span>
                  <span className="text-xs font-bold text-[#38BDF8]">18.6%</span>
                </div>
                <div className="h-8 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.marginTrend}>
                      <Line type="monotone" dataKey="margin" stroke="#38BDF8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
