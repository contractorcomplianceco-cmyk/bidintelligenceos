import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CompanyProfile from "@/pages/company-profile";
import BidLibrary from "@/pages/bid-library";
import NewBid from "@/pages/new-bid";
import ScopeAnalyzer from "@/pages/scope-analyzer";
import CostInputs from "@/pages/cost-inputs";
import BidFit from "@/pages/bid-fit";
import StrategyMemo from "@/pages/strategy-memo";
import PackageBuilder from "@/pages/package-builder";
import Monitoring from "@/pages/monitoring";
import Analytics from "@/pages/analytics";
import Addon from "@/pages/addon";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/company-profile" component={CompanyProfile} />
      <Route path="/bid-library" component={BidLibrary} />
      <Route path="/new-bid" component={NewBid} />
      <Route path="/scope-analyzer" component={ScopeAnalyzer} />
      <Route path="/cost-inputs" component={CostInputs} />
      <Route path="/bid-fit" component={BidFit} />
      <Route path="/strategy-memo" component={StrategyMemo} />
      <Route path="/package-builder" component={PackageBuilder} />
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/addon" component={Addon} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
