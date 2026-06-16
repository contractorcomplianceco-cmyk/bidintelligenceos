import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, DollarSign, AlertCircle } from "lucide-react";
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
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cost Inputs & Pricing</h2>
          <p className="text-muted-foreground">Contractor-entered calculations. Demo guidance only.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Costs</CardTitle>
                <CardDescription>Enter base costs for the project execution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Materials</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={costs.materials} 
                        onChange={(e) => handleInputChange("materials", e.target.value)} 
                        className="pl-8" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Internal Labor</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={costs.internalLabor} 
                        onChange={(e) => handleInputChange("internalLabor", e.target.value)} 
                        className="pl-8" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcontractor Labor</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={costs.subcontractor} 
                        onChange={(e) => handleInputChange("subcontractor", e.target.value)} 
                        className="pl-8" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Equipment / Rentals</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={costs.equipment} 
                        onChange={(e) => handleInputChange("equipment", e.target.value)} 
                        className="pl-8" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indirect Costs & Margins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mobilization / Logistics</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={costs.mobilization} 
                        onChange={(e) => handleInputChange("mobilization", e.target.value)} 
                        className="pl-8" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance & Bonding Impact</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={costs.insurance} 
                        onChange={(e) => handleInputChange("insurance", e.target.value)} 
                        className="pl-8" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Overhead (%)</Label>
                    <Input 
                      type="number" 
                      value={costs.overhead} 
                      onChange={(e) => handleInputChange("overhead", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contingency (%)</Label>
                    <Input 
                      type="number" 
                      value={costs.contingency} 
                      onChange={(e) => handleInputChange("contingency", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-primary font-medium">Target Margin (%)</Label>
                    <Input 
                      type="number" 
                      value={costs.targetMargin} 
                      onChange={(e) => handleInputChange("targetMargin", e.target.value)} 
                      className="border-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20 sticky top-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Live Calculations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Cost</span>
                    <span>${baseCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overhead ({costs.overhead}%)</span>
                    <span>${overheadAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contingency ({costs.contingency}%)</span>
                    <span>${contingencyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Cost</span>
                    <span>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="p-4 bg-background border border-border rounded-lg space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Target Bid</p>
                  <p className="text-3xl font-bold text-primary">${targetBid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <div className="flex justify-between text-sm mt-2 pt-2 border-t border-border">
                    <span className="text-muted-foreground">Projected Profit</span>
                    <span className="text-accent font-medium">${marginAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Margin Pressure Detected</p>
                      <p className="text-xs text-muted-foreground">Historical winning bids for this client average 15-18% margin.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs mb-2">Suggested Pricing Posture</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-background">Aggressive</Badge>
                    <Badge variant="default" className="bg-primary hover:bg-primary">Balanced</Badge>
                    <Badge variant="outline" className="bg-background">Premium</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 border-t border-border pt-4">
                <Link href="/bid-fit" className="w-full">
                  <Button className="w-full">
                    View Bid Fit Score <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-muted-foreground">
                  Internal calculation tool. Does not reference proprietary platform pricing formulas.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
