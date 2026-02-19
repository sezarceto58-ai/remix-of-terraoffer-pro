import { useState } from "react";
import { Heart, Trash2, Bell } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function BuyerFavorites() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState(mockProperties);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const removeFavorite = (id: string) => {
    const property = favorites.find((p) => p.id === id);
    setFavorites(favorites.filter((p) => p.id !== id));
    toast({ title: "Removed from favorites", description: property?.title });
  };

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    toast({
      title: alertsEnabled ? "Alerts disabled" : "Alerts enabled",
      description: alertsEnabled ? "You will no longer receive price drop alerts." : "You'll be notified when prices drop on your saved properties.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 text-destructive" /> Saved Properties
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {favorites.length} properties saved • Get price drop alerts on your favorites.
          </p>
        </div>
        <button
          onClick={toggleAlerts}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            alertsEnabled ? "bg-success/10 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          <Bell className="w-4 h-4" /> {alertsEnabled ? "Alerts On" : "Enable Alerts"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="text-xl font-bold text-foreground mt-1">{favorites.length}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Avg Price</p>
          <p className="text-xl font-bold text-foreground mt-1">
            ${Math.round(favorites.reduce((s, p) => s + p.price, 0) / (favorites.length || 1) / 1000)}K
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Avg TerraScore</p>
          <p className="text-xl font-bold text-success mt-1">
            {Math.round(favorites.reduce((s, p) => s + p.terraScore, 0) / (favorites.length || 1))}
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Price Drops</p>
          <p className="text-xl font-bold text-primary mt-1">2</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 rounded-xl bg-card border border-border">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No saved properties yet.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Browse the marketplace and save properties you like.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map((property) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={property} />
              <div className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(property.id);
                  }}
                  className="p-2 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
