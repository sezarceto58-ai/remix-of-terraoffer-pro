import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Heart, Bell, TrendingUp, DollarSign, Eye, Home,
  GitCompareArrows, BadgeDollarSign, Star, ArrowRight,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties, mockOffers } from "@/data/mockData";

const recentActivity = [
  { id: "1", type: "offer_sent", text: "You sent an offer on Luxury Villa with Pool", time: "2 hours ago", icon: BadgeDollarSign },
  { id: "2", type: "price_drop", text: "Price dropped on Commercial Tower Office — now $450K", time: "5 hours ago", icon: TrendingUp },
  { id: "3", type: "favorite", text: "You saved Penthouse - Panoramic Views", time: "1 day ago", icon: Heart },
  { id: "4", type: "offer_update", text: "Your offer on Modern Apartment was viewed by seller", time: "2 days ago", icon: Eye },
  { id: "5", type: "match", text: "New property matches your search: 3BR Villa in Erbil", time: "3 days ago", icon: Home },
];

const activityColors: Record<string, string> = {
  offer_sent: "bg-primary/10 text-primary",
  price_drop: "bg-success/10 text-success",
  favorite: "bg-destructive/10 text-destructive",
  offer_update: "bg-info/10 text-info",
  match: "bg-warning/10 text-warning",
};

export default function BuyerDashboard() {
  const myOffers = mockOffers.filter((o) => o.status !== "REJECTED" && o.status !== "EXPIRED");
  const savedCount = 4;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Buyer Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your real estate activity overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/buyer/discover" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Discover</span>
        </Link>
        <Link to="/buyer/favorites" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
            <Heart className="w-5 h-5 text-destructive" />
          </div>
          <span className="text-sm font-medium text-foreground">Favorites</span>
        </Link>
        <Link to="/buyer/offers" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
            <BadgeDollarSign className="w-5 h-5 text-success" />
          </div>
          <span className="text-sm font-medium text-foreground">My Offers</span>
        </Link>
        <Link to="/buyer/compare" className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group">
          <div className="p-3 rounded-xl bg-info/10 group-hover:bg-info/20 transition-colors">
            <GitCompareArrows className="w-5 h-5 text-info" />
          </div>
          <span className="text-sm font-medium text-foreground">Compare</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Properties Viewed" value="24" change="+8 this week" icon={Eye} trend="up" />
        <StatsCard title="Saved Properties" value={savedCount} change="+2 new" icon={Heart} trend="up" />
        <StatsCard title="Active Offers" value={myOffers.length} change="3 pending" icon={BadgeDollarSign} trend="up" />
        <StatsCard title="Price Alerts" value="6" change="2 triggered" icon={Bell} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Link to="/buyer/alerts" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="rounded-xl bg-card border border-border p-4 flex items-start gap-3 animate-fade-in hover:border-primary/20 transition-colors">
                <div className={`p-2 rounded-lg ${activityColors[item.type]}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Status Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">My Offers</h2>
            <Link to="/buyer/offers" className="text-xs text-primary hover:underline flex items-center gap-1">
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {myOffers.slice(0, 3).map((offer) => {
              const pricePercent = Math.round((offer.offerPrice / offer.askingPrice) * 100);
              const statusColors: Record<string, string> = {
                SUBMITTED: "bg-info/10 text-info",
                VIEWED: "bg-primary/10 text-primary",
                ACCEPTED: "bg-success/10 text-success",
                COUNTERED: "bg-warning/10 text-warning",
                WITHDRAWN: "bg-secondary text-muted-foreground",
              };
              return (
                <div key={offer.id} className="rounded-xl bg-card border border-border p-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-mono">{offer.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[offer.status] || "bg-secondary text-muted-foreground"}`}>
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{offer.propertyTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${offer.offerPrice.toLocaleString()} ({pricePercent}% of asking)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Recommended For You
          </h2>
          <Link to="/buyer/discover" className="text-xs text-primary hover:underline flex items-center gap-1">
            Browse all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockProperties.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}
