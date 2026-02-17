import {
  BarChart3, Eye, Users, TrendingUp, DollarSign, Building2,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { mockProperties, mockOffers } from "@/data/mockData";

const weeklyViews = [
  { day: "Mon", views: 124 },
  { day: "Tue", views: 156 },
  { day: "Wed", views: 189 },
  { day: "Thu", views: 142 },
  { day: "Fri", views: 201 },
  { day: "Sat", views: 278 },
  { day: "Sun", views: 234 },
];

const topListings = mockProperties.map((p) => ({
  ...p,
  conversionRate: ((p.leads / p.views) * 100).toFixed(1),
})).sort((a, b) => b.views - a.views);

const monthlyMetrics = [
  { month: "Sep", views: 2100, leads: 45, offers: 8 },
  { month: "Oct", views: 2800, leads: 62, offers: 12 },
  { month: "Nov", views: 3200, leads: 71, offers: 15 },
  { month: "Dec", views: 3600, leads: 78, offers: 18 },
  { month: "Jan", views: 4200, leads: 85, offers: 22 },
  { month: "Feb", views: 4776, leads: 87, offers: 24 },
];

export default function SellerAnalytics() {
  const maxViews = Math.max(...weeklyViews.map((d) => d.views));
  const totalViews = mockProperties.reduce((s, p) => s + p.views, 0);
  const totalLeads = mockProperties.reduce((s, p) => s + p.leads, 0);
  const avgConversion = ((totalLeads / totalViews) * 100).toFixed(1);
  const totalOfferValue = mockOffers.reduce((s, o) => s + o.offerPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Performance analytics for your listings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Views" value={totalViews.toLocaleString()} change="+18% vs last month" icon={Eye} trend="up" />
        <StatsCard title="Total Leads" value={totalLeads} change="+12 this week" icon={Users} trend="up" />
        <StatsCard title="Conversion Rate" value={`${avgConversion}%`} change="+0.4%" icon={TrendingUp} trend="up" />
        <StatsCard title="Offer Revenue" value={`$${(totalOfferValue / 1000).toFixed(0)}K`} change="total value" icon={DollarSign} />
      </div>

      {/* Weekly Views Chart */}
      <div className="rounded-xl bg-card border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4">Weekly Views</h2>
        <div className="flex items-end gap-2 h-40">
          {weeklyViews.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{d.views}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-gold transition-all hover:opacity-80"
                style={{ height: `${(d.views / maxViews) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="rounded-xl bg-card border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Monthly Trends</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Month</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Views</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Leads</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Offers</th>
                </tr>
              </thead>
              <tbody>
                {monthlyMetrics.map((m, i) => (
                  <tr key={m.month} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium text-foreground">{m.month}</td>
                    <td className="py-2.5 text-right text-foreground">{m.views.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-foreground">{m.leads}</td>
                    <td className="py-2.5 text-right text-foreground">{m.offers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Listings */}
        <div className="rounded-xl bg-card border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Top Performing Listings</h2>
          <div className="space-y-3">
            {topListings.map((listing, i) => (
              <div key={listing.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                <img src={listing.image} alt="" className="w-12 h-9 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{listing.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{listing.views.toLocaleString()} views</span>
                    <span>{listing.leads} leads</span>
                    <span className="text-success">{listing.conversionRate}% conv.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
