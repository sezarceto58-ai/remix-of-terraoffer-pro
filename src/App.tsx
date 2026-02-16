import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Marketplace from "@/pages/Marketplace";
import PropertyDetail from "@/pages/PropertyDetail";
import AgentDashboard from "@/pages/AgentDashboard";
import AgentCRM from "@/pages/AgentCRM";
import InvestorTools from "@/pages/InvestorTools";
import AdminDashboard from "@/pages/AdminDashboard";
import CompareListings from "@/pages/CompareListings";
import Messaging from "@/pages/Messaging";
import Alerts from "@/pages/Alerts";
import CreateProperty from "@/pages/CreateProperty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/compare" element={<CompareListings />} />
            <Route path="/favorites" element={<Marketplace />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/listings" element={<AgentDashboard />} />
            <Route path="/agent/create" element={<CreateProperty />} />
            <Route path="/agent/crm" element={<AgentCRM />} />
            <Route path="/agent/messages" element={<Messaging />} />
            <Route path="/agent/offers" element={<AgentDashboard />} />
            <Route path="/investor" element={<InvestorTools />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
