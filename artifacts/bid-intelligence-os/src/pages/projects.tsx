import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function Projects() {
  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <Target className="h-8 w-8 text-teal-600" />
             Projects
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Awarded bids and active project tracking.</p>
        </div>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">Project handoff and execution tracking features are currently under development.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
