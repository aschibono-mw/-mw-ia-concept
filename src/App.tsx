import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Discover from "./pages/Discover.tsx";
import Analyze from "./pages/Analyze.tsx";
import Monitor from "./pages/Monitor.tsx";
import Distribute from "./pages/Distribute.tsx";
import Outreach from "./pages/Outreach.tsx";
import Alerts from "./pages/Alerts.tsx";
import Reports from "./pages/Reports.tsx";
import Digests from "./pages/Digests.tsx";
import MiraStudio from "./pages/MiraStudio.tsx";
import ContentManager from "./pages/ContentManager.tsx";
import Account from "./pages/Account.tsx";
import GenAILens from "./pages/GenAILens.tsx";
import SocialTrends from "./pages/SocialTrends.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/newsletters" element={<Distribute />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/digests" element={<Digests />} />
          <Route path="/mira" element={<MiraStudio />} />
          <Route path="/content-manager" element={<ContentManager />} />
          <Route path="/account" element={<Account />} />
          <Route path="/genai-lens" element={<GenAILens />} />
          <Route path="/social-trends" element={<SocialTrends />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
