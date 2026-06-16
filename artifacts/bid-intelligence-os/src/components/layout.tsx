import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Target, 
  Users, 
  LineChart, 
  Files, 
  FileBarChart, 
  Settings,
  Menu,
  ShieldCheck,
  Bell,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { CCACrest } from "./cca-crest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Cockpit", icon: LayoutDashboard },
  { href: "/bids", label: "Bids", icon: FolderKanban },
  { href: "/projects", label: "Projects", icon: Target },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/documents", label: "Documents", icon: Files },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { mode, setMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0A0E1A] border-r border-[#1C253B]">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <CCACrest className="w-8 h-8 text-[#38BDF8]" />
          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-none">
              <span className="text-[#38BDF8]">CCA</span> BidIntelligenceOS
            </h1>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              <div 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#1C253B] text-white border border-[#2A3756]' 
                    : 'text-[#8A96B0] hover:text-white hover:bg-[#151D2E] border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#38BDF8] rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                )}
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#38BDF8]' : 'text-[#8A96B0] group-hover:text-white'}`} />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className={`rounded-lg p-3 border flex flex-col items-center text-center transition-colors ${mode === 'addon' ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30' : 'bg-[#0F1830] border-[#1C253B]'}`}>
          <ShieldCheck className="w-6 h-6 text-[#38BDF8] mb-2" />
          <p className="text-[10px] font-bold text-[#8A96B0] tracking-widest uppercase">Contractor Connect</p>
          <p className="text-[9px] text-[#8A96B0]/70 tracking-wider mt-0.5">{mode === 'addon' ? 'Add-On Connected' : 'Standalone Mode'}</p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[#8A96B0]">
           <ShieldCheck className="w-3.5 h-3.5" />
           <span className="text-[10px] uppercase tracking-widest">Data Integrity</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#0A0E1A] text-slate-200 flex relative overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 z-50 animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative bg-[#0A0E1A]">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1C253B] bg-[#0A0E1A] flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30 relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 blueprint-texture opacity-30 pointer-events-none mix-blend-screen"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <button className="lg:hidden text-[#8A96B0]" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm text-[#38BDF8] font-medium tracking-wide">Research Less, Win More</p>
            </div>
            <button
              onClick={() => setMode(mode === "standalone" ? "addon" : "standalone")}
              title="Switch product mode"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1C253B] bg-[#0F1830] text-[10px] font-bold uppercase tracking-widest text-[#8A96B0] hover:text-white hover:border-[#2A3756] transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mode === "addon" ? "bg-[#38BDF8]" : "bg-[#22C55E]"}`}></span>
              {mode === "addon" ? "ContractorConnect Add-On" : "Standalone"}
            </button>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-4 text-[#8A96B0]">
              <div className="relative cursor-pointer hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#38BDF8] text-[#0A0E1A] text-[9px] font-bold rounded-full flex items-center justify-center">12</span>
              </div>
              <HelpCircle className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            </div>
            
            <div className="h-8 w-px bg-[#1C253B]"></div>

            <div className="flex flex-col items-end cursor-pointer group">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-md border border-[#1C253B]">
                  <AvatarFallback className="bg-[#0F1830] text-[#38BDF8] text-xs font-bold rounded-md">JP</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Jordan P. <span className="text-[#8A96B0]">/ Estimator</span></span>
                  <ChevronDown className="w-4 h-4 text-[#8A96B0] group-hover:text-white" />
                </div>
              </div>
              <span className="text-[10px] text-[#8A96B0] mt-0.5 tracking-wider">Data as of May 20, 2025 9:41 AM</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin relative bg-[#0A0E1A]">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1C253B] bg-[#0A0E1A] py-3 px-6 flex justify-between items-center text-[#8A96B0] text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0F1830] border border-[#1C253B] px-2 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-semibold uppercase tracking-widest text-[10px]">Data Integrity</span>
            </div>
            <span>Use lawful public or contractor-provided competitor data only.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Updates every 15 minutes</span>
            <div className="flex items-center gap-2 text-white">
              <span>CCA BidIntelligenceOS is a product of Contractor Connect</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
