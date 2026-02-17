import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, Plus, Eye, Users, BadgeDollarSign, Edit, Trash2,
  MoreVertical, MapPin, BadgeCheck,
} from "lucide-react";
import TerraScore from "@/components/TerraScore";
import { mockProperties } from "@/data/mockData";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  sold: "bg-secondary text-muted-foreground",
};

export default function SellerListings() {
  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" /> My Listings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockProperties.length} active listings
          </p>
        </div>
        <Link
          to="/seller/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-gold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit">
        {(["list", "grid"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {mockProperties.map((property) => (
          <div
            key={property.id}
            className="rounded-xl bg-card border border-border p-4 animate-fade-in hover:border-primary/20 transition-colors"
          >
            <div className="flex gap-4">
              <img
                src={property.image}
                alt={property.title}
                className="w-28 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{property.title}</h3>
                      {property.verified && (
                        <BadgeCheck className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" /> {property.district}, {property.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[property.status]}`}>
                      {property.status}
                    </span>
                    <TerraScore score={property.terraScore} size="sm" showLabel={false} />
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-3">
                  <p className="text-lg font-bold text-foreground">
                    ${property.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {property.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {property.leads} leads
                    </span>
                    <span className="flex items-center gap-1">
                      <BadgeDollarSign className="w-3.5 h-3.5" /> offers
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
