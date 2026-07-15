import { useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";
import { DemoWalkthrough } from "@/components/demo-walkthrough";
import { DemoChoiceHub } from "@/components/demo-choice-hub";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SsoCallback from "@/pages/sso-callback";
import { AuthProvider } from "@/lib/auth-context";
import { ClerkRootProvider } from "@/lib/clerk-root";
import { enterDemoSession } from "@/lib/data-mode";
import { isDemoModeEnabled } from "@/lib/demo-mode";

import Marketing from "@/pages/marketing";
import NotFound from "@/pages/not-found";

// Primary navigation
import CommandCenter from "@/pages/command-center";
import Briefings from "@/pages/briefings";
import Alerts from "@/pages/alerts";
import Bids from "@/pages/bids";
import BidDetail from "@/pages/bid-detail";
import PackageBuilder from "@/pages/package-builder";
import WonJobs from "@/pages/won-jobs";
import Deployment from "@/pages/deployment";
import Scheduling from "@/pages/scheduling";
import Labor from "@/pages/labor";
import Permits from "@/pages/permits";
import Weather from "@/pages/weather";
import CostRoi from "@/pages/cost-roi";
import VoiceConnect from "@/pages/voice-connect";
import IndustryUseCases from "@/pages/industry-use-cases";
import Analytics from "@/pages/analytics";
import CompetitorWatch from "@/pages/competitor-watch";
import BidDna from "@/pages/bid-dna";
import AddOns from "@/pages/add-ons";
import VideoConnect from "@/pages/video-connect";
import MarketWatch from "@/pages/market-watch";
import BuildConnect from "@/pages/build-connect";
import ComplianceConnect from "@/pages/compliance-connect";
import Government from "@/pages/government";
import Risk from "@/pages/risk";
import RoseOs from "@/pages/roseos";
import Closeout from "@/pages/closeout";
import BusinessProfile from "@/pages/business-profile";
import Settings from "@/pages/settings";

// Deep bid workflows (reached by link, not in main nav)
import NewBid from "@/pages/new-bid";
import ScopeAnalyzer from "@/pages/scope-analyzer";
import CostInputs from "@/pages/cost-inputs";
import BidFit from "@/pages/bid-fit";
import StrategyMemo from "@/pages/strategy-memo";

// Orphan ops pages (reachable by route, not in main nav)
import Monitoring from "@/pages/monitoring";
import BidLibrary from "@/pages/bid-library";

// Legacy screens (kept reachable by route, folded out of the main nav)
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import Leads from "@/pages/leads";
import Competitors from "@/pages/competitors";
import Insights from "@/pages/insights";
import Documents from "@/pages/documents";
import Reports from "@/pages/reports";

const queryClient = new QueryClient();

type DemoView = "landing" | "hub" | "app";
type RosePanel = "promo" | "walkthrough";

function normalizePath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (base && path.startsWith(base)) {
    return path.slice(base.length) || "/";
  }
  return path;
}

function isDemoHubPath(): boolean {
  if (typeof window === "undefined") return false;
  return normalizePath(window.location.pathname) === "/demo";
}

function isRoseDemoLaunch(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.has("rose-demo") || params.get("demo") === "rose";
}

function isDemoDomainLaunch(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  const path = normalizePath(window.location.pathname);
  return host === "demo.ccabidintelligence.com" && (path === "/" || path === "/demo");
}

/** Cold-load paths that must mount the app Router (not marketing lander). */
function isAppEntryPath(): boolean {
  if (typeof window === "undefined") return false;
  const path = normalizePath(window.location.pathname);
  if (path === "/login" || path.startsWith("/login/")) return true;
  if (path === "/register" || path.startsWith("/register/")) return true;
  if (path === "/sso-callback" || path.startsWith("/sso-callback/")) return true;
  if (path === "/bids" || path.startsWith("/bids/")) return true;
  if (path === "/dashboard") return true;
  return false;
}

function Router() {
  return (
    <Switch>
      {/* Operations */}
      <Route path="/login" component={Login} />
      <Route path="/login/*" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/register/*" component={Register} />
      <Route path="/sso-callback" component={SsoCallback} />
      <Route path="/sso-callback/*" component={SsoCallback} />

      <Route path="/" component={CommandCenter} />
      <Route path="/dashboard" component={CommandCenter} />
      <Route path="/briefings" component={Briefings} />
      <Route path="/alerts" component={Alerts} />

      {/* Bid lifecycle */}
      <Route path="/bids" component={Bids} />
      <Route path="/bids/:id" component={BidDetail} />
      <Route path="/package-builder" component={PackageBuilder} />
      <Route path="/won-jobs" component={WonJobs} />

      {/* Job execution */}
      <Route path="/deployment" component={Deployment} />
      <Route path="/scheduling" component={Scheduling} />
      <Route path="/labor" component={Labor} />
      <Route path="/permits" component={Permits} />
      <Route path="/weather" component={Weather} />
      <Route path="/cost-roi" component={CostRoi} />
      <Route path="/risk" component={Risk} />
      <Route path="/closeout" component={Closeout} />

      {/* Intelligence */}
      <Route path="/roseos" component={RoseOs} />
      <Route path="/voice-connect" component={VoiceConnect} />
      <Route path="/industry-use-cases" component={IndustryUseCases} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/competitor-watch" component={CompetitorWatch} />
      <Route path="/bid-dna" component={BidDna} />

      {/* Add-Ons */}
      <Route path="/add-ons" component={AddOns} />
      <Route path="/video-connect" component={VideoConnect} />
      <Route path="/market-watch" component={MarketWatch} />
      <Route path="/build-connect" component={BuildConnect} />
      <Route path="/compliance-connect" component={ComplianceConnect} />
      <Route path="/government" component={Government} />

      {/* Account */}
      <Route path="/business-profile" component={BusinessProfile} />
      <Route path="/settings" component={Settings} />

      {/* Deep bid workflows */}
      <Route path="/new-bid" component={NewBid} />
      <Route path="/scope-analyzer" component={ScopeAnalyzer} />
      <Route path="/cost-inputs" component={CostInputs} />
      <Route path="/bid-fit" component={BidFit} />
      <Route path="/strategy-memo" component={StrategyMemo} />

      {/* Orphan ops routes (not in main nav) */}
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/bid-library" component={BidLibrary} />

      {/* Legacy routes (not in main nav) */}
      <Route path="/cockpit" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/leads" component={Leads} />
      <Route path="/competitors" component={Competitors} />
      <Route path="/insights" component={Insights} />
      <Route path="/documents" component={Documents} />
      <Route path="/reports" component={Reports} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [view, setView] = useState<DemoView>(() => {
    if (typeof window === "undefined") return "landing";
    if (isDemoDomainLaunch()) return "landing";
    if (isDemoHubPath()) return "hub";
    // Clerk return / deep links must not fall through to marketing (looks like a dead end / 404).
    if (isAppEntryPath()) return "app";
    if (sessionStorage.getItem("cca-demo-entered") === "1") return "app";
    return "landing";
  });
  const [showRoseDemo, setShowRoseDemo] = useState(false);
  const [roseDemoPanel, setRoseDemoPanel] = useState<RosePanel>("promo");
  /** User click → try sound; direct ?rose-demo=1 link → muted until interaction. */
  const [roseDemoAllowSound, setRoseDemoAllowSound] = useState(false);

  const syncUrl = (path: string) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const next = `${base}${path === "/" ? "" : path}` || "/";
    window.history.replaceState({}, "", next);
  };

  const openRoseDemo = (panel: RosePanel = "promo", allowSound = false) => {
    setRoseDemoPanel(panel);
    setRoseDemoAllowSound(allowSound);
    setShowRoseDemo(true);
  };

  const handleRoseDemoLaunch = () => {
    if (!isDemoModeEnabled()) {
      enterDemoSession();
      setView("app");
      syncUrl("/");
      return;
    }
    openRoseDemo("promo", true);
  };

  const handleRoseDemoDismiss = () => {
    setShowRoseDemo(false);
    setRoseDemoAllowSound(false);
    setView("landing");
    syncUrl("/");
  };

  const handleRoseDemoGoToHub = () => {
    setShowRoseDemo(false);
    setRoseDemoAllowSound(false);
    setView("hub");
    syncUrl("/demo");
  };

  const handleRoseDemoEnter = () => {
    enterDemoSession();
    setShowRoseDemo(false);
    setRoseDemoAllowSound(false);
    setView("app");
    syncUrl("/");
  };

  const handleSignIn = () => {
    setShowRoseDemo(false);
    setView("app");
    syncUrl("/login");
    // Full navigation so /login mounts outside any stale lander state.
    window.location.assign("/login");
  };

  useEffect(() => {
    if (!(isRoseDemoLaunch() || isDemoDomainLaunch()) || !isDemoModeEnabled()) return;
    setView("landing");
    openRoseDemo("promo", false);

    const url = new URL(window.location.href);
    url.searchParams.delete("rose-demo");
    if (url.searchParams.get("demo") === "rose") url.searchParams.delete("demo");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    if (view !== "app") return;
    const onPop = () => {
      const path = normalizePath(window.location.pathname);
      if (path === "/demo") {
        setView("hub");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [view]);

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkRootProvider>
        <AuthProvider>
        <AppProvider>
          <TooltipProvider>
          {showRoseDemo && (
            <DemoWalkthrough
              allowSound={roseDemoAllowSound}
              initialPanel={roseDemoPanel}
              onEnterPlatform={handleRoseDemoEnter}
              onDismiss={handleRoseDemoDismiss}
              onReturnToLanding={handleRoseDemoDismiss}
            />
          )}
          {view === "app" ? (
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          ) : view === "hub" ? (
            <DemoChoiceHub
              onEnterDemo={handleRoseDemoEnter}
              onWatchWalkthrough={() => openRoseDemo("walkthrough", true)}
              onWatchPromo={() => openRoseDemo("promo", true)}
              onReturnHome={() => {
                setView("landing");
                syncUrl("/");
              }}
            />
          ) : (
            <Marketing onLaunchRoseDemo={handleRoseDemoLaunch} onSignIn={handleSignIn} />
          )}
          <Toaster />
        </TooltipProvider>
      </AppProvider>
      </AuthProvider>
      </ClerkRootProvider>
    </QueryClientProvider>
  );
}

export default App;
