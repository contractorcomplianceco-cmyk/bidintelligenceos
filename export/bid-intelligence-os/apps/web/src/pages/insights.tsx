import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { analyticsData } from "@core/data";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

export default function Insights() {
  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <LineChartIcon className="h-8 w-8 text-teal-600" />
             Win/Loss Analytics
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Historical performance insights to refine future bid strategy.</p>
        </div>

        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden relative">
          <CardHeader className="border-b border-[#E2E8F0] pb-4 bg-[#F8FAFC] relative z-10">
            <CardTitle className="text-lg text-slate-900">Win Rate Trend (TTM)</CardTitle>
            <CardDescription className="text-slate-500">Trailing 12 months success rate percentage</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.winRateOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, color: '#0F172A' }}
                    labelStyle={{ color: '#0F172A' }}
                    itemStyle={{ color: '#0284C7', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" activeDot={{ r: 6, strokeWidth: 0, fill: '#0EA5E9' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
