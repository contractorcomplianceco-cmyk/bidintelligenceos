import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";

import Marketing from "@/pages/marketing";
import DemoLanding from "@/pages/demo-landing";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Bids from "@/pages/bids";
import Projects from "@/pages/projects";
import Leads from "@/pages/leads";
import Competitors from "@/pages/competitors";
import Insights from "@/pages/insights";
import VoiceConnect from "@/pages/voice-connect";
import Documents from "@/pages/documents";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";

import NewBid from "@/pages/new-bid";
import ScopeAnalyzer from "@/pages/scope-analyzer";
import CostInputs from "@/pages/cost-inputs";
import BidFit from "@/pages/bid-fit";
import StrategyMemo from "@/pages/strategy-memo";
import PackageBuilder from "@/pages/package-builder";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/bids" component={Bids} />
      <Route path="/projects" component={Projects} />
      <Route path="/leads" component={Leads} />
      <Route path="/competitors" component={Competitors} />
      <Route path="/insights" component={Insights} />
      <Route path="/voice-connect" component={VoiceConnect} />
      <Route path="/documents" component={Documents} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />

      {/* Deep Workflows */}
      <Route path="/new-bid" component={NewBid} />
      <Route path="/scope-analyzer" component={ScopeAnalyzer} />
      <Route path="/cost-inputs" component={CostInputs} />
      <Route path="/bid-fit" component={BidFit} />
      <Route path="/strategy-memo" component={StrategyMemo} />
      <Route path="/package-builder" component={PackageBuilder} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem("cca-demo-entered") === "1"
  );
  const [launched, setLaunched] = useState(
    () => sessionStorage.getItem("cca-demo-launched") === "1"
  );

  const handleLaunch = () => {
    sessionStorage.setItem("cca-demo-launched", "1");
    setLaunched(true);
  };

  const handleEnter = () => {
    sessionStorage.setItem("cca-demo-entered", "1");
    setEntered(true);
  };

  const handleBack = () => {
    sessionStorage.removeItem("cca-demo-launched");
    setLaunched(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          {entered ? (
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          ) : launched ? (
            <DemoLanding onEnter={handleEnter} onBack={handleBack} />
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
