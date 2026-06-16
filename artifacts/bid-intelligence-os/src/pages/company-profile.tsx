import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/lib/context";

export default function CompanyProfile() {
  const { mode } = useAppContext();

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground">Manage your contractor profile and operational capabilities.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Details</CardTitle>
                <CardDescription>Basic information about your contracting business.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Acme Commercial Trades" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractorType">Contractor Type</Label>
                    <Input id="contractorType" defaultValue="General/Specialty" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services">Trades / Services</Label>
                  <Input id="services" defaultValue="HVAC, Electrical, Facilities Maintenance" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areas">Service Areas</Label>
                  <Input id="areas" defaultValue="Greater Seattle Area, Bellevue, Tacoma" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Capacity</CardTitle>
                <CardDescription>Metrics used to calculate Bid Fit and capacity constraints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobSize">Preferred Job Size ($)</Label>
                    <Input id="jobSize" defaultValue="$50k - $500k" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crew">Crew Capacity</Label>
                    <Input id="crew" defaultValue="15 active field personnel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="margin">Target Margin Range (%)</Label>
                    <Input id="margin" defaultValue="18% - 25%" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overhead">Overhead Assumptions (%)</Label>
                    <Input id="overhead" defaultValue="12%" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {mode === "addon" && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary text-sm">ContractorConnect Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Readiness</span>
                    <span className="font-medium text-green-500">Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Documents on File</span>
                    <span className="font-medium">12/12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Status</span>
                    <span className="font-medium">Active</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Compliance & Insurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bonding">Bonding/Insurance Notes</Label>
                  <Textarea id="bonding" defaultValue="Standard $2M liability. Custom bonding available for municipal projects." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License Notes</Label>
                  <Textarea id="license" defaultValue="WA State L&I fully compliant. Electrical administrator assigned." />
                </div>
                <Button className="w-full mt-2">Save Profile</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
