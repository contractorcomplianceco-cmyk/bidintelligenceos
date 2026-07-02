import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none z-0"></div>

      <Card className="w-full max-w-md mx-auto bg-slate-900/90 border-slate-800 shadow-2xl relative z-10">
        <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-red-950/30 rounded-full flex items-center justify-center mb-6 border border-red-900/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">404</h1>
          <h2 className="text-lg font-medium text-slate-300 mb-4">Signal Lost</h2>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-[250px]">
            The system could not locate the requested coordinates. The page may have been moved or deleted.
          </p>

          <Link href="/">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 h-11 w-full sm:w-auto shadow-lg">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
