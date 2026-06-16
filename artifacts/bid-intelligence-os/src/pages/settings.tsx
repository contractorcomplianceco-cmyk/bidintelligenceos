import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Bell, DownloadCloud } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <SettingsIcon className="h-8 w-8 text-teal-500" />
             Settings
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Manage your application preferences and account details.</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                 <User className="h-5 w-5 text-slate-400" />
                 Account Information
              </CardTitle>
              <CardDescription className="text-slate-400">Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First Name</Label>
                  <Input defaultValue="John" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Name</Label>
                  <Input defaultValue="Smith" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</Label>
                  <Input defaultValue="jsmith@acmetrades.com" type="email" className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500 font-medium" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-800 pt-4 bg-slate-950/30">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Bell className="h-5 w-5 text-slate-400" />
                 Notification Preferences
              </CardTitle>
              <CardDescription className="text-slate-400">Control when and how you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-200">Bid Follow-Up Reminders</Label>
                  <p className="text-sm text-slate-500 leading-relaxed">Receive alerts when submitted bids require follow-up.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-teal-500" />
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-200">Missing Information Alerts</Label>
                  <p className="text-sm text-slate-500 leading-relaxed">Notify me when scope analysis detects high-risk missing info.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-teal-500" />
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-200">Weekly Analytics Digest</Label>
                  <p className="text-sm text-slate-500 leading-relaxed">Receive a summary of win/loss metrics every Monday.</p>
                </div>
                <Switch className="data-[state=checked]:bg-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                 <DownloadCloud className="h-5 w-5 text-slate-400" />
                 Export & Defaults
              </CardTitle>
              <CardDescription className="text-slate-400">Configure package builder outputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Export Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="pdf" className="focus:bg-slate-800 focus:text-white cursor-pointer">PDF Document (.pdf)</SelectItem>
                    <SelectItem value="docx" className="focus:bg-slate-800 focus:text-white cursor-pointer">Word Document (.docx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Validity Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-teal-500">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="15" className="focus:bg-slate-800 focus:text-white cursor-pointer">15 Days</SelectItem>
                    <SelectItem value="30" className="focus:bg-slate-800 focus:text-white cursor-pointer">30 Days</SelectItem>
                    <SelectItem value="60" className="focus:bg-slate-800 focus:text-white cursor-pointer">60 Days</SelectItem>
                    <SelectItem value="90" className="focus:bg-slate-800 focus:text-white cursor-pointer">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
