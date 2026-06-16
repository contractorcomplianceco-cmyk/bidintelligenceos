import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSearch, Target, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Leads() {
  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
               <Target className="h-8 w-8 text-teal-500" />
               Leads & New Opportunities
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Intake and evaluate new RFPs and ITBs.</p>
          </div>
          <Link href="/new-bid">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg h-11 px-6 font-semibold">
              <FileSearch className="w-4 h-4 mr-2" />
              New Bid Analysis
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 shadow-md">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-lg text-white">Lead Inbox</CardTitle>
            <CardDescription className="text-slate-400">Recent opportunities needing triage.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-slate-500 mb-4">No new leads in the inbox.</p>
            <Link href="/new-bid">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                Start Analysis <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
