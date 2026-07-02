import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Files, Package, CheckCircle2, ShieldAlert } from "lucide-react";
import { documentReadiness } from "@core/data";
import { Link } from "wouter";

export default function Documents() {
  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
               <Files className="h-8 w-8 text-teal-600" />
               Documents & Packages
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Central hub for compliance docs and proposal generation.</p>
          </div>
          <Link href="/package-builder">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white shadow-sm h-11 px-6 font-semibold">
              <Package className="w-4 h-4 mr-2" />
              Open Package Builder
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] pb-4">
              <CardTitle className="text-lg text-slate-900">Compliance Readiness</CardTitle>
              <CardDescription className="text-slate-500">Global status of your company documents.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {documentReadiness.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="font-medium text-slate-700">{doc.name}</span>
                  {doc.status === 'complete' ? (
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-widest">
                      <ShieldAlert className="w-4 h-4" /> Attention
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] pb-4">
              <CardTitle className="text-lg text-slate-900">Recent Packages</CardTitle>
              <CardDescription className="text-slate-500">Generated bid proposals.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No packages generated recently.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
