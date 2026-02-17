import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  Heart,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  BadgeDollarSign,
  GitCompareArrows,
  Plus,
  Eye,
  BarChart3,
  ShoppingBag,
  Store,
  ChevronDown,
} from "lucide-react";

type AccountType = "buyer" | "seller" | "admin";

const buyerNav = [
  {
    label: "Home",
    items: [
      { path: "/buyer", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { path: "/buyer/discover", icon: Search, label: "Discover" },
      { path: "/buyer/compare", icon: GitCompareArrows, label: "Compare" },
      { path: "/buyer/favorites", icon: Heart, label: "Favorites" },
      { path: "/buyer/alerts", icon: Bell, label: "Alerts" },
    ],
  },
  {
    label: "Offers & Deals",
    items: [
      { path: "/buyer/offers", icon: BadgeDollarSign, label: "My Offers" },
      { path: "/buyer/messages", icon: MessageSquare, label: "Messages" },
    ],
  },
  {
    label: "Investor Tools",
    items: [
      { path: "/buyer/investor", icon: TrendingUp, label: "Portfolio" },
    ],
  },
];

const sellerNav = [
  {
    label: "Home",
    items: [
      { path: "/seller", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Listings",
    items: [
      { path: "/seller/listings", icon: Building2, label: "My Listings" },
      { path: "/seller/create", icon: Plus, label: "New Listing" },
    ],
  },
  {
    label: "Sales Pipeline",
    items: [
      { path: "/seller/offers", icon: BadgeDollarSign, label: "Offer Inbox" },
      { path: "/seller/crm", icon: Users, label: "CRM & Leads" },
      { path: "/seller/messages", icon: MessageSquare, label: "Messages" },
    ],
  },
  {
    label: "Performance",
    items: [
      { path: "/seller/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
];

const adminNav = [
  {
    label: "Governance",
    items: [
      { path: "/admin", icon: Shield, label: "Console" },
    ],
  },
];

const accountConfig: Record<AccountType, { nav: typeof buyerNav; label: string; icon: typeof ShoppingBag; color: string }> = {
  buyer: { nav: buyerNav, label: "Buyer", icon: ShoppingBag, color: "bg-info/10 text-info" },
  seller: { nav: sellerNav, label: "Seller", icon: Store, color: "bg-success/10 text-success" },
  admin: { nav: adminNav, label: "Admin", icon: Shield, color: "bg-destructive/10 text-destructive" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("buyer");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const location = useLocation();

  const config = accountConfig[accountType];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <Link to={accountType === "buyer" ? "/buyer" : accountType === "seller" ? "/seller" : "/admin"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-gradient-gold">TerraVista</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Switcher */}
        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${config.color}`}>
                  <config.icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{config.label} Account</p>
                  <p className="text-xs text-muted-foreground">Switch account type</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showAccountMenu ? "rotate-180" : ""}`} />
            </button>

            {showAccountMenu && (
              <div className="absolute left-0 right-0 mt-1 rounded-lg bg-card border border-border shadow-elevated z-10 overflow-hidden">
                {(["buyer", "seller", "admin"] as AccountType[]).map((type) => {
                  const c = accountConfig[type];
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setAccountType(type);
                        setShowAccountMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-secondary transition-colors ${
                        accountType === type ? "bg-secondary" : ""
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${c.color}`}>
                        <c.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{c.label}</span>
                      {accountType === type && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-160px)]">
          {config.nav.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase ${config.color}`}>
              {config.label}
            </span>
            <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse-gold" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
              AK
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
