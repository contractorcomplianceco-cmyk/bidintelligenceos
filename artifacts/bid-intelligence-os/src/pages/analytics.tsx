import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { analyticsData } from "@/lib/data";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Lightbulb, TrendingUp, AlertCircle, LineChart as LineChartIcon } from "lucide-react";

export default function Analytics() {
  const COLORS = ['#14b8a6', '#3b82f6', '#64748b', '#ef4444', '#eab308'];

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <LineChartIcon className="h-8 w-8 text-teal-500" />
             Win/Loss Analytics
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Historical performance insights to refine future bid strategy.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Win Rate Over Time */}
          <Card className="lg:col-span-2 bg-slate-900/80 border-slate-800 shadow-xl overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none"></div>
            <CardHeader className="border-b border-slate-800 pb-4 bg-slate-950/30 relative z-10">
              <CardTitle className="text-lg text-white">Win Rate Trend (TTM)</CardTitle>
              <CardDescription className="text-slate-400">Trailing 12 months success rate percentage</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.winRateOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#14b8a6', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" activeDot={{ r: 6, strokeWidth: 0, fill: '#14b8a6' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insights Panel */}
          <Card className="bg-teal-950/10 border-teal-900/30 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full pointer-events-none"></div>
            <CardHeader className="border-b border-teal-900/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-teal-400 text-sm font-bold uppercase tracking-wider">
                <Lightbulb className="h-4 w-4" />
                Strategic Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-white font-semibold block mb-1">Lean into HVAC.</strong> Your win rate is exceptionally high (75%) when bidding as prime on HVAC retrofits.</p>
                </div>
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-white font-semibold block mb-1">Price sensitivity.</strong> "Price too high" accounts for 43% of documented losses. Consider reviewing overhead allocation models.</p>
                </div>
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-white font-semibold block mb-1">Follow-up impact.</strong> Bids with at least one documented follow-up call close at a 22% higher rate.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Types */}
          <Card className="lg:col-span-1 bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white">Performance by Trade</CardTitle>
              <CardDescription className="text-slate-400">Wins vs Losses across project categories</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.projectTypes} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="type" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                    <Bar dataKey="won" name="Won" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="lost" name="Lost" stackId="a" fill="#475569" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Loss Reasons */}
          <Card className="lg:col-span-2 bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white">Loss Factor Analysis</CardTitle>
              <CardDescription className="text-slate-400">Primary reasons cited in post-bid debriefs</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[280px] w-full flex">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.lossReasons}
                      cx="40%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="count"
                      stroke="none"
                    >
                      {analyticsData.lossReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right" 
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '13px', color: '#e2e8f0', paddingLeft: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
