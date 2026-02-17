import { Link } from "react-router-dom";
import {
  Building2, Eye, Users, TrendingUp, DollarSign, Plus, BadgeDollarSign,
  MessageSquare, BarChart3, ArrowRight, UserCheck,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import OfferCard from "@/components/OfferCard";
import { mockOffers, mockProperties, mockLeads } from "@/data/mockData";

const recentActivity = [
  { id: "1", type: "offer", text: "New offer received on Luxury Villa with Pool — $310K", time: "2 hours ago", icon: BadgeDollarSign },
  { id: "2", type: "lead", text: "New lead from Noor Al-Din for Luxury Villa", time: "4 hours ago", icon: Users },
  { id: "3", type: "view", text: "Modern Apartment - City Center reached 900 views", time: "1 day ago", icon: Eye },
  { id: "4", type: "message", text: "New message from Karwan Mohammed about Villa", time: "1 day ago", icon: MessageSquare },
  { id: "5", type: "lead", text: "Lead Aya Mohammed marked as qualified", time: "2 days ago", icon: UserCheck },
];

const activityColors: Record<string, string> = {
  offer: "bg-primary/10 text-primary",
  lead: "bg-success/10 text-success",
  view: "bg-info/10 text-info",
  message: "bg-warning/10 text-warning",
};

export default function SellerDashboard() {
  const sellerOffers = mockOffers.filter((o) => o.status === "SUBMITTED" || o.status === "VIEWED");
  const newLeads = mockLeads.filter((l) => l.stage === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Seller Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your listings, leads, and incoming offers.</p>
        </div>
        <Link
          to="/seller/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-gold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Listings" value={mockProperties.length} change="+2 this month" icon={Building2} trend="up" />
        <StatsCard title="Total Views" value="4,776" change="+18%" icon={Eye} trend="up" />
        <StatsCard title="Active Leads" value="87" change="+12 this week" icon={Users} trend="up" />
        <StatsCard title="Conversion Rate" value="3.2%" change="+0.4%" icon={TrendingUp} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offer Inbox Preview */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Incoming Offers
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {sellerOffers.length}
              </span>
            </h2>
            <Link to="/seller/offers" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid gap-4">
            {sellerOffers.slice(0, 2).map((offer) => (
              <OfferCard key={offer.id} offer={offer} showActions />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="rounded-xl bg-card border border-border p-3 flex items-start gap-3 animate-fade-in">
                <div className={`p-1.5 rounded-lg ${activityColors[item.type]}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/seller/listings" className="rounded-xl bg-card border border-border p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Building2 className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">My Listings</p>
            <p className="text-xs text-muted-foreground">{mockProperties.length} active</p>
          </div>
        </Link>
        <Link to="/seller/crm" className="rounded-xl bg-card border border-border p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Users className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium text-foreground">CRM</p>
            <p className="text-xs text-muted-foreground">{newLeads} new leads</p>
          </div>
        </Link>
        <Link to="/seller/messages" className="rounded-xl bg-card border border-border p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <MessageSquare className="w-5 h-5 text-warning" />
          <div>
            <p className="text-sm font-medium text-foreground">Messages</p>
            <p className="text-xs text-muted-foreground">3 unread</p>
          </div>
        </Link>
        <Link to="/seller/analytics" className="rounded-xl bg-card border border-border p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <BarChart3 className="w-5 h-5 text-info" />
          <div>
            <p className="text-sm font-medium text-foreground">Analytics</p>
            <p className="text-xs text-muted-foreground">View reports</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
