import { ReactNode, useState, useEffect } from "react";
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
  Menu,
  ShieldCheck
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

  // Set dark mode explicitly since it's the requested vibe
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-md bg-teal-900/50 flex items-center justify-center border border-teal-800/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 tracking-tight leading-none">BidIntelligenceOS</h1>
            <span className="text-[10px] text-teal-500 font-medium tracking-widest uppercase">CCA Platform</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">Research Less, Win More</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              <div 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-700/50' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                )}
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/60 bg-slate-900/50">
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-slate-700">
                JS
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">John Smith</p>
                <p className="text-xs text-slate-500">Acme Trades</p>
              </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-200 flex relative overflow-hidden">
      {/* Global subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03] pointer-events-none z-0"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl flex-shrink-0 flex-col z-20 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-slate-950 border-r-slate-800 flex flex-col">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden sm:flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mode:</span>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="mode-switch" 
                  checked={mode === "addon"}
                  onCheckedChange={(checked) => setMode(checked ? "addon" : "standalone")}
                  className="data-[state=checked]:bg-teal-600"
                />
                <Label htmlFor="mode-switch" className={`text-xs font-medium cursor-pointer transition-colors ${mode === "addon" ? "text-teal-400" : "text-slate-300"}`}>
                  {mode === "addon" ? "ContractorConnect Add-On" : "Standalone"}
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 mr-2 bg-slate-800/40 rounded-full px-3 py-1.5 border border-slate-700/30">
               <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>
               <span className="text-xs font-medium text-slate-300">System Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin relative">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
