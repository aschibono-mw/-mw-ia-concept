import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Discover from "./pages/Discover.tsx";

import Analyze from "./pages/Analyze.tsx";
import Monitor from "./pages/Monitor.tsx";
import Distribute from "./pages/Distribute.tsx";
import Newsletters from "./pages/Newsletters.tsx";
import Outreach from "./pages/Outreach.tsx";
import Alerts from "./pages/Alerts.tsx";
import Reports from "./pages/Reports.tsx";
import Digests from "./pages/Digests.tsx";
import MiraStudio from "./pages/MiraStudio.tsx";
import ContentManager from "./pages/ContentManager.tsx";
import ProjectsManager from "./pages/ProjectsManager.tsx";
import Account from "./pages/Account.tsx";
import GenAILens from "./pages/GenAILens.tsx";
import SocialTrends from "./pages/SocialTrends.tsx";
import SearchLanding from "./pages/SearchLanding.tsx";
import SearchPlus from "./pages/SearchPlus.tsx";
import SearchPlusHub from "./pages/SearchPlusHub.tsx";
import SocialAccounts from "./pages/SocialAccounts.tsx";
import MonitorLanding from "./pages/MonitorLanding.tsx";
import AnalyzeLanding from "./pages/AnalyzeLanding.tsx";
import ExecuteLanding from "./pages/ExecuteLanding.tsx";
import OutreachLanding from "./pages/OutreachLanding.tsx";
import GenAILensLanding from "./pages/GenAILensLanding.tsx";
import SocialTrendsLanding from "./pages/SocialTrendsLanding.tsx";
import ReportsLanding from "./pages/ReportsLanding.tsx";
import Home2 from "./pages/Home2.tsx";
import Home2Dashboard from "./pages/Home2Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home2" replace />} />
          <Route path="/old-home" element={<Index />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/home2-dashboard" element={<Home2Dashboard />} />
          <Route path="/discover" element={<SearchLanding />} />
          <Route path="/search-plus" element={<SearchPlus />} />
          <Route path="/search-plus-hub" element={<SearchPlusHub />} />
          <Route path="/search-landing" element={<SearchLanding />} />
          <Route path="/analyze" element={<AnalyzeLanding />} />
          <Route path="/analyze-dashboard" element={<Analyze />} />
          <Route path="/monitor" element={<MonitorLanding />} />
          <Route path="/monitor-streams" element={<Monitor />} />
          <Route path="/newsletters" element={<Newsletters />} />
          <Route path="/outreach" element={<OutreachLanding />} />
          <Route path="/outreach-campaigns" element={<Outreach />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<ReportsLanding />} />
          <Route path="/reports-library" element={<Reports />} />
          <Route path="/digests" element={<Digests />} />
          <Route path="/mira" element={<MiraStudio />} />
          <Route path="/content-manager" element={<ContentManager />} />
          <Route path="/projects-manager" element={<ProjectsManager />} />
          <Route path="/account" element={<Account />} />
          <Route path="/genai-lens" element={<GenAILensLanding />} />
          <Route path="/genai-lens-explore" element={<GenAILens />} />
          <Route path="/social-trends" element={<SocialTrendsLanding />} />
          <Route path="/social-trends-explore" element={<SocialTrends />} />
          <Route path="/social-accounts" element={<SocialAccounts />} />
          <Route path="/search" element={<Discover />} />
          <Route path="/monitor-landing" element={<MonitorLanding />} />
          <Route path="/execute" element={<ExecuteLanding />} />
          <Route path="/outreach-landing" element={<OutreachLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
