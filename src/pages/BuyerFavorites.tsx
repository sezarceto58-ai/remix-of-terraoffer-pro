import { Heart, Trash2, Bell, Loader2 } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

export default function BuyerFavorites() {
  const { toast } = useToast();
  const { data: favorites = [], isLoading } = useFavorites();
  const toggleFav = useToggleFavorite();

  const removeFavorite = (id: string) => {
    toggleFav.mutate(id);
    toast({ title: "Removed from favorites" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 text-destructive" /> Saved Properties
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{favorites.length} properties saved</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="text-xl font-bold text-foreground mt-1">{favorites.length}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Avg Price</p>
          <p className="text-xl font-bold text-foreground mt-1">
            ${favorites.length ? Math.round(favorites.reduce((s, p) => s + p.price, 0) / favorites.length / 1000) : 0}K
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Avg TerraScore</p>
          <p className="text-xl font-bold text-success mt-1">
            {favorites.length ? Math.round(favorites.reduce((s, p) => s + p.terra_score, 0) / favorites.length) : 0}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : favorites.length === 0 ? (
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
                <button onClick={(e) => { e.preventDefault(); removeFavorite(property.id); }}
                  className="p-2 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors" title="Remove">
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
