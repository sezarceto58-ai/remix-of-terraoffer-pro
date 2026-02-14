import {
  Shield, Building2, Users, BadgeDollarSign, AlertTriangle,
  FileCheck, Activity, Eye,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import OfferCard from "@/components/OfferCard";
import { adminStats, mockOffers } from "@/data/mockData";
import { useState } from "react";

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "offers", label: "Offers Center", icon: BadgeDollarSign },
  { id: "verification", label: "Verification", icon: FileCheck },
  { id: "fraud", label: "Fraud & Risk", icon: AlertTriangle },
];

const verificationQueue = [
  { id: "V1", type: "Property", name: "Villa #4521 - Erbil", status: "pending", submitted: "2026-02-12" },
  { id: "V2", type: "Agent", name: "Ahmed Al-Kurdi", status: "under_review", submitted: "2026-02-10" },
  { id: "V3", type: "Developer", name: "Sara Development Co.", status: "pending", submitted: "2026-02-08" },
];

const fraudAlerts = [
  { id: "F1", type: "Duplicate Listing", description: "Property #3201 matches #3198 (92% text similarity)", severity: "high", date: "2026-02-13" },
  { id: "F2", type: "Price Anomaly", description: "Listing priced 340% above neighborhood average", severity: "medium", date: "2026-02-12" },
  { id: "F3", type: "Spam Offers", description: "Buyer 'test_user' submitted 47 offers in 24h", severity: "high", date: "2026-02-11" },
];

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-info/10 text-info",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Governance Console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Admin monitoring, verification, and fraud detection.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Listings" value={adminStats.totalListings.toLocaleString()} change="+124 this month" icon={Building2} trend="up" />
            <StatsCard title="Active Offers" value={adminStats.activeOffers} change="+38 this week" icon={BadgeDollarSign} trend="up" />
            <StatsCard title="Pending Verifications" value={adminStats.pendingVerifications} icon={FileCheck} />
            <StatsCard title="Flagged Listings" value={adminStats.flaggedListings} change="3 new" icon={AlertTriangle} trend="down" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Users" value={adminStats.totalUsers.toLocaleString()} change="+420 this month" icon={Users} trend="up" />
            <StatsCard title="Monthly Revenue" value={`$${adminStats.monthlyRevenue.toLocaleString()}`} change="+12%" icon={BadgeDollarSign} trend="up" />
            <StatsCard title="Conversion Rate" value={`${adminStats.conversionRate}%`} icon={Activity} />
            <StatsCard title="Avg TerraScore" value={adminStats.avgTerraScore} icon={Eye} />
          </div>
        </>
      )}

      {activeTab === "offers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Offer Monitoring Center</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                Freeze Offer
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-medium">
                Flag Buyer
              </button>
            </div>
          </div>
          {mockOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      {activeTab === "verification" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground">Verification Queue</h2>
          {verificationQueue.map((item) => (
            <div key={item.id} className="rounded-xl bg-card border border-border p-5 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.type} • Submitted {item.submitted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning capitalize">
                  {item.status.replace("_", " ")}
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium">
                  Approve
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "fraud" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground">Fraud & Risk Alerts</h2>
          {fraudAlerts.map((alert) => (
            <div key={alert.id} className="rounded-xl bg-card border border-border p-5 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{alert.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${severityColors[alert.severity]}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                  Investigate
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
