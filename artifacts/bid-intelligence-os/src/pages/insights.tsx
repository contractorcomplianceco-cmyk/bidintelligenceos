import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { analyticsData } from "@/lib/data";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

export default function Insights() {
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

        <Card className="bg-slate-900/80 border-slate-800 shadow-xl overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none"></div>
          <CardHeader className="border-b border-slate-800 pb-4 bg-slate-950/30 relative z-10">
            <CardTitle className="text-lg text-white">Win Rate Trend (TTM)</CardTitle>
            <CardDescription className="text-slate-400">Trailing 12 months success rate percentage</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.winRateOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C253B" vertical={false} />
                  <XAxis dataKey="month" stroke="#8A96B0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8A96B0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F1830', borderColor: '#1C253B', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#38BDF8', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" activeDot={{ r: 6, strokeWidth: 0, fill: '#38BDF8' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
