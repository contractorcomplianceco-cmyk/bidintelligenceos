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
  ExternalLink,
  Factory,
  Crosshair,
  ShieldAlert,
  ClipboardCheck,
  Dna,
  Video,
  Blocks,
  Globe,
  Network,
  Landmark,
  Compass,
  Database,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { VERTICALS } from "@core/verticals";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useOrgProfile } from "@/hooks/use-org";
import { parseBrandColor, parseStringField, parseUrlField } from "@/lib/org-profile";
import { VoiceConnectCommandBar } from "@/components/voice-connect/command-bar";
import logo from "@/assets/bidintelligence-logo.png";

const ECOSYSTEM_LINKS = [
  {
    label: "ComplianceConnect",
    note: "Licensing & compliance",
    href: "https://demo.ccacomplianceconnect.com/",
    color: "#A855F7",
  },
  {
    label: "CCA Website",
    note: "Contractor Compliance Authority",
    href: "https://www.contractor-compliance-authority.com/",
    color: "#38BDF8",
  },
  {
    label: "Compliance Authority Group",
    note: "Parent company",
    href: "https://complianceauthoritygroup.com/",
    color: "#5eead4",
  },
];

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; badge?: string };
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
      { href: "/bid-library", label: "Bid Library", icon: Database },
      { href: "/monitoring", label: "Bid Monitoring", icon: Activity },
      { href: "/package-builder", label: "Bid Package Builder", icon: PackageOpen },
      { href: "/won-jobs", label: "Won Jobs", icon: Trophy },
      { href: "/government", label: "Government Contracting", icon: Landmark, badge: "GOV" },
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
      { href: "/risk", label: "Risk & Change Orders", icon: ShieldAlert },
      { href: "/closeout", label: "Job Closeout", icon: ClipboardCheck },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/roseos", label: "ROSEOS Intelligence", icon: Compass, badge: "AI" },
      { href: "/bid-dna", label: "Bid DNA", icon: Dna },
      { href: "/industry-use-cases", label: "Industry Use Cases", icon: Factory },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Add-Ons",
    items: [
      { href: "/add-ons", label: "Add-On Marketplace", icon: Blocks },
      { href: "/voice-connect", label: "VoiceConnect", icon: AudioLines },
      { href: "/video-connect", label: "VideoConnect", icon: Video },
      { href: "/build-connect", label: "BuildConnect", icon: Network },
      { href: "/compliance-connect", label: "ComplianceConnect", icon: ShieldCheck },
      { href: "/market-watch", label: "MarketWatchOS", icon: Globe },
      { href: "/competitor-watch", label: "CompetitorWatchOS", icon: Crosshair, badge: "Soon" },
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E293B] bg-[#111827] hover:border-[#334155] transition-colors"
      >
        <Building2 className="w-4 h-4 text-[#38BDF8]" />
        <div className="text-left leading-tight">
          <p className="text-[9px] uppercase tracking-widest text-[#8A96B0]">Business Type</p>
          <p className="text-xs font-semibold text-white">{verticalConfig.name}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8A96B0] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-64 rounded-xl border border-[#1E293B] bg-[#111827] shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[70vh] overflow-y-auto scrollbar-thin">
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
                v.id === vertical ? "bg-[#1E293B] text-white" : "text-[#c3ccdd] hover:bg-[#111827]"
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
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: org } = useOrgProfile();
  const brandName = live ? parseStringField(org?.profile?.brandName) : "";
  const productName = live ? parseStringField(org?.profile?.productName) : "";
  const logoUrl = live ? parseUrlField(org?.profile?.logoUrl) : "";
  const brandColor = live ? parseBrandColor(org?.profile?.brandColor, "#38BDF8") : "#38BDF8";
  const workspaceTitle = productName || brandName || "BidIntelligenceOS";

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0B1220] border-r border-[#1E293B]">
      <div className="px-5 py-5 border-b border-[#1E293B]">
        {logoUrl ? (
          <img src={logoUrl} alt={workspaceTitle} className="h-14 w-auto max-w-full object-contain" />
        ) : (
          <img src={logo} alt="BidIntelligenceOS" className="h-14 w-auto object-contain" />
        )}
        <p className="text-sm font-semibold text-white mt-2 tracking-tight" style={{ color: live && (brandName || productName) ? brandColor : undefined }}>
          {workspaceTitle}
        </p>
        <p className="text-[10px] text-[#8A96B0] tracking-wider mt-1 pl-0.5">
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
                          ? "bg-[#1E293B] text-white border border-[#334155]"
                          : "text-[#8A96B0] hover:text-white hover:bg-[#111827] border border-transparent"
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
                      {item.badge && (
                        <span className="ml-auto text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#A855F7]/15 text-[#c084fc] border border-[#A855F7]/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-[#1E293B] space-y-3">
        <div>
          <p className="px-1 mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#5b6680]">
            CCA Ecosystem
          </p>
          <div className="space-y-0.5">
            {ECOSYSTEM_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#8A96B0] hover:text-white hover:bg-[#111827] transition-colors group"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: link.color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium leading-tight truncate">
                    {link.label}
                  </span>
                  <span className="block text-[9px] text-[#5b6680] leading-tight truncate">
                    {link.note}
                  </span>
                </span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
        <div
          className={`rounded-lg p-3 border flex items-center gap-2 transition-colors ${
            mode === "addon" ? "bg-[#38BDF8]/10 border-[#38BDF8]/30" : "bg-[#111827] border-[#1E293B]"
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
    <div className="min-h-[100dvh] bg-[#0B1220] text-slate-200 flex relative overflow-hidden font-sans">
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
      <main className="flex-1 flex flex-col min-w-0 z-10 relative bg-[#0B1220]">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1E293B] bg-[#0B1220] flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30 relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 blueprint-texture opacity-30 pointer-events-none mix-blend-screen"></div>

          <div className="flex items-center gap-3 relative z-10">
            <button className="lg:hidden text-[#8A96B0]" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <VerticalSelector />
            <button
              onClick={() => setMode(mode === "standalone" ? "addon" : "standalone")}
              title="Switch product mode"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E293B] bg-[#111827] text-[10px] font-bold uppercase tracking-widest text-[#8A96B0] hover:text-white hover:border-[#334155] transition-colors"
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

            <div className="h-8 w-px bg-[#1E293B]"></div>

            <Link href="/settings" className="flex flex-col items-end cursor-pointer group">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-md border border-[#1E293B]">
                  <AvatarFallback className="bg-[#111827] text-[#38BDF8] text-xs font-bold rounded-md">
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

        {/* Page Content — light workspace */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin relative bg-[#F8FAFC] text-slate-900">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1E293B] bg-[#0B1220] py-3 px-6 flex flex-wrap gap-3 justify-between items-center text-[#8A96B0] text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#111827] border border-[#1E293B] px-2 py-1 rounded">
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

      {/* VoiceConnect command bar — demo sessions only */}
      {!live && <VoiceConnectCommandBar />}
    </div>
  );
}
