import { BarChart3, Eye, Users, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useMyProperties } from "@/hooks/useProperties";
import { useSellerOffers } from "@/hooks/useOffers";
import property1 from "@/assets/property-1.jpg";

export default function SellerAnalytics() {
  const { data: properties = [], isLoading } = useMyProperties();
  const { data: offers = [] } = useSellerOffers();

  const totalViews = properties.reduce((s, p) => s + p.views, 0);
  const totalOfferValue = offers.reduce((s, o) => s + o.offer_price, 0);

  const topListings = [...properties].sort((a, b) => b.views - a.views);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Performance analytics for your listings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} trend="up" />
        <StatsCard title="Total Listings" value={properties.length} icon={Users} trend="up" />
        <StatsCard title="Total Offers" value={offers.length} icon={TrendingUp} trend="up" />
        <StatsCard title="Offer Value" value={`$${(totalOfferValue / 1000).toFixed(0)}K`} icon={DollarSign} />
      </div>

      <div className="rounded-xl bg-card border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4">Top Performing Listings</h2>
        <div className="space-y-3">
          {topListings.map((listing, i) => (
            <div key={listing.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
              <img src={listing.property_images?.[0]?.url || property1} alt="" className="w-12 h-9 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{listing.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{listing.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
          {topListings.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No listings yet</p>}
        </div>
      </div>
    </div>
  );
}
