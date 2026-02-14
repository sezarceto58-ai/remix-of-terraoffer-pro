import { Building2, Eye, Users, TrendingUp, DollarSign } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import OfferCard from "@/components/OfferCard";
import { mockOffers, mockProperties } from "@/data/mockData";

export default function AgentDashboard() {
  const sellerOffers = mockOffers.filter((o) => o.status === "SUBMITTED" || o.status === "VIEWED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Agent Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your listings, leads, and offers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Listings" value={mockProperties.length} change="+2 this month" icon={Building2} trend="up" />
        <StatsCard title="Total Views" value="4,776" change="+18%" icon={Eye} trend="up" />
        <StatsCard title="Active Leads" value="87" change="+12 this week" icon={Users} trend="up" />
        <StatsCard title="Conversion Rate" value="3.2%" change="+0.4%" icon={TrendingUp} trend="up" />
      </div>

      {/* Offer Inbox */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Offer Inbox
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {sellerOffers.length}
            </span>
          </h2>
        </div>
        <div className="grid gap-4">
          {sellerOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} showActions />
          ))}
        </div>
      </div>
    </div>
  );
}
