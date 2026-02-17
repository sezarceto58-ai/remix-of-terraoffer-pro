import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";

// Buyer pages
import BuyerDashboard from "@/pages/BuyerDashboard";
import BuyerOffers from "@/pages/BuyerOffers";
import BuyerFavorites from "@/pages/BuyerFavorites";
import Marketplace from "@/pages/Marketplace";
import PropertyDetail from "@/pages/PropertyDetail";
import CompareListings from "@/pages/CompareListings";
import Alerts from "@/pages/Alerts";
import InvestorTools from "@/pages/InvestorTools";

// Seller pages
import SellerDashboard from "@/pages/SellerDashboard";
import SellerListings from "@/pages/SellerListings";
import SellerOffers from "@/pages/SellerOffers";
import SellerAnalytics from "@/pages/SellerAnalytics";
import CreateProperty from "@/pages/CreateProperty";
import AgentCRM from "@/pages/AgentCRM";

// Shared pages
import Messaging from "@/pages/Messaging";
import AdminDashboard from "@/pages/AdminDashboard";
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
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/buyer" replace />} />

            {/* Buyer routes */}
            <Route path="/buyer" element={<BuyerDashboard />} />
            <Route path="/buyer/discover" element={<Marketplace />} />
            <Route path="/buyer/compare" element={<CompareListings />} />
            <Route path="/buyer/favorites" element={<BuyerFavorites />} />
            <Route path="/buyer/alerts" element={<Alerts />} />
            <Route path="/buyer/offers" element={<BuyerOffers />} />
            <Route path="/buyer/messages" element={<Messaging />} />
            <Route path="/buyer/investor" element={<InvestorTools />} />
            <Route path="/property/:id" element={<PropertyDetail />} />

            {/* Seller routes */}
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/listings" element={<SellerListings />} />
            <Route path="/seller/create" element={<CreateProperty />} />
            <Route path="/seller/offers" element={<SellerOffers />} />
            <Route path="/seller/crm" element={<AgentCRM />} />
            <Route path="/seller/messages" element={<Messaging />} />
            <Route path="/seller/analytics" element={<SellerAnalytics />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
