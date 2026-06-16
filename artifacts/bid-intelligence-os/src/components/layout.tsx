import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context";
import { 
  LayoutDashboard, 
  Building2, 
  Library, 
  FileSearch, 
  Search, 
  DollarSign, 
  Crosshair, 
  BrainCircuit, 
  Package, 
  Activity, 
  LineChart, 
  Blocks, 
  Settings,
  Menu
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/company-profile", label: "Company Profile", icon: Building2 },
  { href: "/bid-library", label: "Bid Library", icon: Library },
  { href: "/new-bid", label: "New Bid Analysis", icon: FileSearch },
  { href: "/scope-analyzer", label: "Scope Analyzer", icon: Search },
  { href: "/cost-inputs", label: "Cost Inputs", icon: DollarSign },
  { href: "/bid-fit", label: "Bid Fit", icon: Crosshair },
  { href: "/strategy-memo", label: "Strategy Memo", icon: BrainCircuit },
  { href: "/package-builder", label: "Bid Package Builder", icon: Package },
  { href: "/monitoring", label: "Bid Monitoring", icon: Activity },
  { href: "/analytics", label: "Win/Loss Analytics", icon: LineChart },
  { href: "/addon", label: "ContractorConnect Add-On", icon: Blocks },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { mode, setMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <h1 className="font-bold text-lg text-primary tracking-tight">CCA BidIntelligenceOS</h1>
        <p className="text-xs text-muted-foreground mt-1">Research Less, Win More</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-sidebar flex-shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r-border flex flex-col">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Mode:</span>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="mode-switch" 
                  checked={mode === "addon"}
                  onCheckedChange={(checked) => setMode(checked ? "addon" : "standalone")}
                />
                <Label htmlFor="mode-switch" className="text-sm cursor-pointer">
                  {mode === "addon" ? "ContractorConnect Add-On" : "Standalone"}
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
