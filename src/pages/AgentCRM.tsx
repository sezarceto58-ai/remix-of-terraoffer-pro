import { useState } from "react";
import { Users, Phone, Mail, Plus, Search } from "lucide-react";
import { mockContacts, mockLeads } from "@/data/mockData";

const stageColors: Record<string, string> = {
  new: "bg-info/10 text-info",
  contacted: "bg-primary/10 text-primary",
  qualified: "bg-success/10 text-success",
  closed: "bg-success/20 text-success",
  lost: "bg-destructive/10 text-destructive",
};

export default function AgentCRM() {
  const [tab, setTab] = useState<"leads" | "contacts">("leads");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your leads and contacts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-gold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1">
        {(["leads", "contacts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "leads" && (
        <div className="space-y-6">
          {/* Pipeline */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {(["new", "contacted", "qualified", "closed", "lost"] as const).map((stage) => {
              const count = mockLeads.filter((l) => l.stage === stage).length;
              return (
                <div key={stage} className="rounded-xl bg-card border border-border p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${stageColors[stage]}`}>
                    {stage}
                  </span>
                  <p className="text-2xl font-bold text-foreground mt-2">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Lead list */}
          <div className="space-y-3">
            {mockLeads.map((lead) => (
              <div key={lead.id} className="rounded-xl bg-card border border-border p-4 flex items-center justify-between animate-fade-in hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.propertyTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${stageColors[lead.stage]}`}>
                    {lead.stage}
                  </span>
                  <span className="text-xs text-muted-foreground">{lead.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-3">
          {mockContacts.map((contact) => (
            <div key={contact.id} className="rounded-xl bg-card border border-border p-5 animate-fade-in hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{contact.type}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{contact.totalDeals} deals</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground italic">{contact.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
