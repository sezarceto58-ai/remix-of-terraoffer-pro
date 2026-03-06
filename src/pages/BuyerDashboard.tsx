import { Link } from "react-router-dom";
import {
  Search, Heart, Bell, TrendingUp, DollarSign, Eye, Home,
  GitCompareArrows, BadgeDollarSign, Star, ArrowRight, Loader2,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useMyOffers } from "@/hooks/useOffers";
import { useFavorites } from "@/hooks/useFavorites";

export default function BuyerDashboard() {
  const { data: properties = [], isLoading: propsLoading } = useProperties();
  const { data: myOffers = [] } = useMyOffers();
  const { data: favorites = [] } = useFavorites();

  const activeOffers = myOffers.filter((o) => o.status !== "REJECTED" && o.status !== "EXPIRED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Buyer Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your real estate activity overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/buyer/discover" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"><Search className="w-5 h-5 text-primary" /></div>
          <span className="text-sm font-medium text-foreground">Discover</span>
        </Link>
        <Link to="/buyer/favorites" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors"><Heart className="w-5 h-5 text-destructive" /></div>
          <span className="text-sm font-medium text-foreground">Favorites</span>
        </Link>
        <Link to="/buyer/offers" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors"><BadgeDollarSign className="w-5 h-5 text-success" /></div>
          <span className="text-sm font-medium text-foreground">My Offers</span>
        </Link>
        <Link to="/buyer/compare" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-info/10 group-hover:bg-info/20 transition-colors"><GitCompareArrows className="w-5 h-5 text-info" /></div>
          <span className="text-sm font-medium text-foreground">Compare</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Properties Available" value={properties.length} icon={Eye} trend="up" />
        <StatsCard title="Saved Properties" value={favorites.length} icon={Heart} trend="up" />
        <StatsCard title="Active Offers" value={activeOffers.length} icon={BadgeDollarSign} trend="up" />
        <StatsCard title="Price Alerts" value="—" icon={Bell} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Recommended For You
          </h2>
          <Link to="/buyer/discover" className="text-xs text-primary hover:underline flex items-center gap-1">Browse all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {propsLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {properties.slice(0, 4).map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        )}
      </div>
    </div>
  );
}
