import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context";
import {
  LayoutDashboard,
  Radar,
  PackageOpen,
  Trophy,
  Rocket,
  CalendarRange,
  HardHat,
  FileCheck2,
  CloudSun,
  DollarSign,
  Sunrise,
  AudioLines,
  BellRing,
  BarChart3,
  Building2,
  Settings,
  Menu,
  ShieldCheck,
  Bell,
  HelpCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { VERTICALS } from "@/lib/verticals";
import { VoiceConnectCommandBar } from "@/components/voice-connect/command-bar";
import logo from "@/assets/bidintelligence-logo.png";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Operations",
    items: [
      { href: "/", label: "Command Center", icon: LayoutDashboard },
      { href: "/briefings", label: "Daily Briefings", icon: Sunrise },
      { href: "/alerts", label: "Alerts", icon: BellRing },
    ],
  },
  {
    title: "Bid Lifecycle",
    items: [
      { href: "/bids", label: "Bid Intelligence", icon: Radar },
      { href: "/package-builder", label: "Bid Package Builder", icon: PackageOpen },
      { href: "/won-jobs", label: "Won Jobs", icon: Trophy },
    ],
  },
  {
    title: "Job Execution",
    items: [
      { href: "/deployment", label: "Job Deployment", icon: Rocket },
      { href: "/scheduling", label: "Scheduling", icon: CalendarRange },
      { href: "/labor", label: "Labor & Subs", icon: HardHat },
      { href: "/permits", label: "Permits & Documents", icon: FileCheck2 },
      { href: "/weather", label: "Weather Watch", icon: CloudSun },
      { href: "/cost-roi", label: "Cost & ROI", icon: DollarSign },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/voice-connect", label: "VoiceConnect", icon: AudioLines },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/business-profile", label: "Business Profile", icon: Building2 },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function VerticalSelector() {
  const { vertical, setVertical, verticalConfig } = useAppContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1C253B] bg-[#0F1830] hover:border-[#2A3756] transition-colors"
      >
        <Building2 className="w-4 h-4 text-[#38BDF8]" />
        <div className="text-left leading-tight">
          <p className="text-[9px] uppercase tracking-widest text-[#8A96B0]">Business Type</p>
          <p className="text-xs font-semibold text-white">{verticalConfig.name}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8A96B0] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-64 rounded-xl border border-[#1C253B] bg-[#0F1830] shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
            Select vertical
          </p>
          {VERTICALS.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setVertical(v.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                v.id === vertical ? "bg-[#1C253B] text-white" : "text-[#c3ccdd] hover:bg-[#151D2E]"
              }`}
            >
              <div>
                <p className="text-sm font-medium">{v.name}</p>
                <p className="text-[10px] text-[#8A96B0] leading-tight mt-0.5">{v.tagline}</p>
              </div>
              {v.id === vertical && <Check className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { mode, setMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0A0E1A] border-r border-[#1C253B]">
      <div className="px-5 py-5 border-b border-[#1C253B]">
        <img src={logo} alt="BidIntelligenceOS" className="h-14 w-auto object-contain" />
        <p className="text-[10px] text-[#8A96B0] tracking-wider mt-2 pl-0.5">
          A product of Contractor Connect
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#5b6680]">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                        isActive
                          ? "bg-[#1C253B] text-white border border-[#2A3756]"
                          : "text-[#8A96B0] hover:text-white hover:bg-[#151D2E] border border-transparent"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#38BDF8] rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                      )}
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? "text-[#38BDF8]" : "text-[#8A96B0] group-hover:text-white"
                        }`}
                      />
                      <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-[#1C253B]">
        <div
          className={`rounded-lg p-3 border flex items-center gap-2 transition-colors ${
            mode === "addon" ? "bg-[#38BDF8]/10 border-[#38BDF8]/30" : "bg-[#0F1830] border-[#1C253B]"
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-[#38BDF8] flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-[#8A96B0] tracking-widest uppercase">
              Contractor Connect
            </p>
            <p className="text-[9px] text-[#8A96B0]/70 tracking-wider mt-0.5">
              {mode === "addon" ? "Add-On Connected" : "Standalone Mode"}
            </p>
          </div>
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

          <div className="flex items-center gap-3 relative z-10">
            <button className="lg:hidden text-[#8A96B0]" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <VerticalSelector />
            <button
              onClick={() => setMode(mode === "standalone" ? "addon" : "standalone")}
              title="Switch product mode"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1C253B] bg-[#0F1830] text-[10px] font-bold uppercase tracking-widest text-[#8A96B0] hover:text-white hover:border-[#2A3756] transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mode === "addon" ? "bg-[#38BDF8]" : "bg-[#22C55E]"}`}></span>
              {mode === "addon" ? "Add-On" : "Standalone"}
            </button>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="hidden md:block">
              <p className="text-sm text-[#38BDF8] font-medium tracking-wide">Research Less, Win More</p>
            </div>
            <div className="flex items-center gap-4 text-[#8A96B0]">
              <Link href="/alerts" className="relative cursor-pointer hover:text-white transition-colors" aria-label="Alerts">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  6
                </span>
              </Link>
              <button
                onClick={() =>
                  toast({
                    title: "Help & support",
                    description: "Browse guides or reach the BidIntelligenceOS team for assistance.",
                  })
                }
                className="cursor-pointer hover:text-white transition-colors"
                aria-label="Help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-px bg-[#1C253B]"></div>

            <Link href="/settings" className="flex flex-col items-end cursor-pointer group">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-md border border-[#1C253B]">
                  <AvatarFallback className="bg-[#0F1830] text-[#38BDF8] text-xs font-bold rounded-md">
                    JP
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    Jordan P. <span className="text-[#8A96B0]">/ Estimator</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#8A96B0] group-hover:text-white" />
                </div>
              </div>
              <span className="hidden sm:block text-[10px] text-[#8A96B0] mt-0.5 tracking-wider">
                Data as of Jul 1, 2025 9:41 AM
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin relative bg-[#0A0E1A]">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1C253B] bg-[#0A0E1A] py-3 px-6 flex flex-wrap gap-3 justify-between items-center text-[#8A96B0] text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0F1830] border border-[#1C253B] px-2 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-semibold uppercase tracking-widest text-[10px]">Decision Support</span>
            </div>
            <span>Weather, permit, cost, and ROI projections require user verification.</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <span>BidIntelligenceOS is a product of Contractor Connect</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
        </footer>
      </main>

      {/* Persistent VoiceConnect command bar */}
      <VoiceConnectCommandBar />
    </div>
  );
}
