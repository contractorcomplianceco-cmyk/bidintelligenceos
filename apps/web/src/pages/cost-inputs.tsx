import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, DollarSign, AlertCircle, Percent } from "lucide-react";
import { Link } from "wouter";

export default function CostInputs() {
  const [costs, setCosts] = useState({
    materials: 125000,
    internalLabor: 85000,
    subcontractor: 45000,
    equipment: 32000,
    mobilization: 8000,
    insurance: 12000,
    overhead: 15, // Percentage
    contingency: 10, // Percentage
    targetMargin: 20 // Percentage
  });

  const handleInputChange = (field: keyof typeof costs, value: string) => {
    setCosts(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const baseCost = costs.materials + costs.internalLabor + costs.subcontractor + costs.equipment + costs.mobilization + costs.insurance;
  const overheadAmount = baseCost * (costs.overhead / 100);
  const contingencyAmount = baseCost * (costs.contingency / 100);
  const totalCost = baseCost + overheadAmount + contingencyAmount;
  
  // Calculate Target Bid (Cost / (1 - Margin))
  const targetBid = totalCost / (1 - (costs.targetMargin / 100));
  const marginAmount = targetBid - totalCost;

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-teal-600" />
            Cost Inputs & Pricing
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Contractor-entered calculations forming the basis of the bid package.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900">Direct Costs</CardTitle>
                <CardDescription className="text-slate-500">Enter base costs for the project execution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Materials</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.materials} 
                        onChange={(e) => handleInputChange("materials", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Internal Labor</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.internalLabor} 
                        onChange={(e) => handleInputChange("internalLabor", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subcontractor Labor</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.subcontractor} 
                        onChange={(e) => handleInputChange("subcontractor", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment / Rentals</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.equipment} 
                        onChange={(e) => handleInputChange("equipment", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900">Indirect Costs & Margins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobilization / Logistics</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.mobilization} 
                        onChange={(e) => handleInputChange("mobilization", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Insurance & Bonding Impact</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.insurance} 
                        onChange={(e) => handleInputChange("insurance", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overhead (%)</Label>
                    <div className="relative">
                       <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.overhead} 
                        onChange={(e) => handleInputChange("overhead", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contingency (%)</Label>
                    <div className="relative">
                       <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={costs.contingency} 
                        onChange={(e) => handleInputChange("contingency", e.target.value)} 
                        className="pl-9 bg-white border-[#E2E8F0] text-slate-700 focus-visible:ring-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-bold text-[#0A8A8F] uppercase tracking-wider">Target Margin (%)</Label>
                    <div className="relative">
                       <Percent className="absolute left-3 top-2.5 h-4 w-4 text-teal-600" />
                      <Input 
                        type="number" 
                        value={costs.targetMargin} 
                        onChange={(e) => handleInputChange("targetMargin", e.target.value)} 
                        className="pl-9 bg-teal-50 border-teal-200 text-slate-700 focus-visible:ring-teal-500 font-bold text-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-[#E2E8F0] shadow-sm sticky top-24 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full pointer-events-none"></div>
              <CardHeader className="pb-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-teal-600" />
                  Live Computations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Base Cost</span>
                    <span className="text-slate-700">${baseCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Overhead ({costs.overhead}%)</span>
                    <span className="text-slate-700">${overheadAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Contingency ({costs.contingency}%)</span>
                    <span className="text-slate-700">${contingencyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="h-px bg-[#E2E8F0] my-4" />
                  <div className="flex justify-between items-center font-bold text-base text-slate-700">
                    <span>Total Cost Basis</span>
                    <span>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2 relative">
                   <div className="absolute inset-y-0 left-0 w-1 bg-teal-500 rounded-l-xl"></div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold ml-2">Target Bid Price</p>
                  <p className="text-3xl font-bold text-slate-900 ml-2 tracking-tight">${targetBid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <div className="flex justify-between text-sm mt-4 pt-4 border-t border-[#E2E8F0] ml-2">
                    <span className="text-slate-500 font-medium">Projected Gross Profit</span>
                    <span className="text-[#0A8A8F] font-bold">${marginAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Margin Pressure Detected</p>
                      <p className="text-xs text-slate-500 mt-1">Historical winning bids for this client average 15–18% margin. A 20% target may make this bid harder to win.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Suggested Pricing Posture</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white border-[#E2E8F0] text-slate-500 py-1.5 px-3">Aggressive</Badge>
                    <Badge variant="default" className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-1.5 px-3 border-transparent">Balanced</Badge>
                    <Badge variant="outline" className="bg-white border-[#E2E8F0] text-slate-500 py-1.5 px-3">Premium</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4 border-t border-[#E2E8F0] p-6 bg-[#F8FAFC]">
                <Link href="/bid-fit" className="w-full">
                  <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold h-12 text-md border border-[#E2E8F0]">
                    Evaluate Bid Fit Score <ArrowRight className="ml-2 h-5 w-5 text-teal-600" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest leading-relaxed">
                  Internal calculation tool. Does not expose proprietary models.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
