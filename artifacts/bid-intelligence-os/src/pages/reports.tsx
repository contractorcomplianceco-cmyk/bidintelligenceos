import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, DownloadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();

  const handleExport = (report: string) => {
    toast({
      title: "Exporting Report",
      description: `Generating ${report}. Review required before distribution.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <FileBarChart className="h-8 w-8 text-teal-500" />
             Reports
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Exportable summaries of pipeline and performance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-slate-900/80 border-slate-800 shadow-md flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-white">Pipeline Summary</CardTitle>
              <CardDescription className="text-slate-400">Active bids and upcoming due dates.</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-6">
              <Button onClick={() => handleExport("Pipeline Summary PDF")} className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                <DownloadCloud className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800 shadow-md flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-white">Win/Loss Report</CardTitle>
              <CardDescription className="text-slate-400">Quarterly outcome analysis and factors.</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-6">
              <Button onClick={() => handleExport("Win/Loss Report DOCX")} className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                <DownloadCloud className="w-4 h-4 mr-2" /> Export DOCX
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800 shadow-md flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-white">Margin Tracking</CardTitle>
              <CardDescription className="text-slate-400">Historical margin performance across trades.</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-6">
              <Button onClick={() => handleExport("Margin Tracking XLS")} className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                <DownloadCloud className="w-4 h-4 mr-2" /> Export XLS
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
