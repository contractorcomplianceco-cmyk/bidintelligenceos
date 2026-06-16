import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { analyticsData } from "@/lib/data";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

export default function Analytics() {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))', '#eab308'];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Win/Loss Analytics</h2>
          <p className="text-muted-foreground">Historical performance insights to refine future bid strategy.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Win Rate Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Win Rate Trend (TTM)</CardTitle>
              <CardDescription>Trailing 12 months success rate percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.winRateOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insights Panel */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                Recommended Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
                  <p className="text-sm"><strong className="text-foreground">Lean into HVAC.</strong> Your win rate is exceptionally high (75%) when bidding as prime on HVAC retrofits.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p className="text-sm"><strong className="text-foreground">Price sensitivity.</strong> "Price too high" accounts for 43% of documented losses. Consider reviewing overhead allocation models.</p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
                  <p className="text-sm"><strong className="text-foreground">Follow-up impact.</strong> Bids with at least one documented follow-up call close at a 22% higher rate.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Types */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Performance by Trade</CardTitle>
              <CardDescription>Wins vs Losses across project categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.projectTypes} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="type" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="won" name="Won" stackId="a" fill="hsl(var(--accent))" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="lost" name="Lost" stackId="a" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Loss Reasons */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Common Loss Reasons</CardTitle>
              <CardDescription>Primary factor cited in post-bid debriefs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full flex">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.lossReasons}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {analyticsData.lossReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right" 
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
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
