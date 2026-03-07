import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Heart,
  BadgeDollarSign,
  MessageSquare,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const buyerTabs = [
  { path: "/buyer", icon: LayoutDashboard, label: "Home" },
  { path: "/buyer/discover", icon: Search, label: "Discover" },
  { path: "/buyer/favorites", icon: Heart, label: "Favorites" },
  { path: "/buyer/offers", icon: BadgeDollarSign, label: "Offers" },
  { path: "/buyer/messages", icon: MessageSquare, label: "Messages" },
];

const sellerTabs = [
  { path: "/seller", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/seller/listings", icon: Building2, label: "Listings" },
  { path: "/seller/offers", icon: BadgeDollarSign, label: "Offers" },
  { path: "/seller/crm", icon: Users, label: "CRM" },
  { path: "/seller/messages", icon: MessageSquare, label: "Messages" },
];

const developerTabs = [
  { path: "/developer", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/developer/analyze", icon: Search, label: "Analyze" },
  { path: "/developer/plans", icon: Building2, label: "Plans" },
  { path: "/developer/opportunities", icon: Briefcase, label: "Feed" },
  { path: "/developer/portfolio", icon: TrendingUp, label: "Portfolio" },
];

function getTabsForPath(pathname: string) {
  if (pathname.startsWith("/developer")) return developerTabs;
  if (pathname.startsWith("/seller")) return sellerTabs;
  return buyerTabs;
}

export default function MobileBottomNav() {
  const location = useLocation();
  const tabs = getTabsForPath(location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[56px] transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
