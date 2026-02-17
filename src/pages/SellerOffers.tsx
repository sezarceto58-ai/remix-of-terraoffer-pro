import { useState } from "react";
import { DollarSign, ArrowUpDown, Filter } from "lucide-react";
import OfferCard from "@/components/OfferCard";
import StatsCard from "@/components/StatsCard";
import { mockOffers } from "@/data/mockData";
import { BadgeDollarSign, TrendingUp, Users, Clock } from "lucide-react";

export default function SellerOffers() {
  const [sortBy, setSortBy] = useState<"score" | "price" | "date">("score");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const allStatuses = ["all", "SUBMITTED", "VIEWED", "ACCEPTED", "REJECTED", "COUNTERED"];

  const filtered = mockOffers
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "score") return b.seriousnessScore - a.seriousnessScore;
      if (sortBy === "price") return b.offerPrice - a.offerPrice;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const highIntent = mockOffers.filter((o) => o.seriousnessScore >= 80).length;
  const totalValue = mockOffers.reduce((s, o) => s + o.offerPrice, 0);
  const avgScore = Math.round(mockOffers.reduce((s, o) => s + o.seriousnessScore, 0) / mockOffers.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" /> Offer Inbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All incoming offers sorted by seriousness — Accept, Counter, or Reject.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Offers" value={mockOffers.length} change="+3 this week" icon={BadgeDollarSign} trend="up" />
        <StatsCard title="High Intent Buyers" value={highIntent} change="serious buyers" icon={Users} trend="up" />
        <StatsCard title="Avg Seriousness" value={avgScore} change="out of 100" icon={TrendingUp} trend="up" />
        <StatsCard title="Total Offer Value" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={DollarSign} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-secondary rounded-xl p-1 overflow-x-auto">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
                statusFilter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs"
          >
            <option value="score">Seriousness Score</option>
            <option value="price">Offer Price</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      {/* Seriousness Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" /> 🟢 High Intent (80–100)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-warning" /> 🟡 Medium (50–79)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-destructive" /> 🔴 Low (0–49)
        </span>
      </div>

      {/* Offer List */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-card border border-border">
            <DollarSign className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No offers match this filter.</p>
          </div>
        ) : (
          filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} showActions />
          ))
        )}
      </div>
    </div>
  );
}
