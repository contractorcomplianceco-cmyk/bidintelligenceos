import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";
import { DemoWalkthrough } from "@/components/demo-walkthrough";
import { shouldShowWalkthrough } from "@/lib/demo-mode";

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

// Legacy screens (kept reachable by route, folded out of the main nav)
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import Leads from "@/pages/leads";
import Competitors from "@/pages/competitors";
import Insights from "@/pages/insights";
import Documents from "@/pages/documents";
import Reports from "@/pages/reports";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Operations */}
      <Route path="/" component={CommandCenter} />
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
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem("cca-demo-entered") === "1"
  );
  const [showWalkthrough, setShowWalkthrough] = useState(
    () => shouldShowWalkthrough()
  );

  const handleLaunch = () => {
    sessionStorage.setItem("cca-demo-entered", "1");
    setEntered(true);
  };

  const handleWalkthroughEnter = () => {
    setShowWalkthrough(false);
    handleLaunch();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          {showWalkthrough && (
            <DemoWalkthrough
              onEnterPlatform={handleWalkthroughEnter}
              onDismiss={() => setShowWalkthrough(false)}
            />
          )}
          {entered ? (
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          ) : (
            <Marketing onLaunchDemo={handleLaunch} />
          )}
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
