import { useState } from "react";
import { Users, Phone, Mail, Plus, X } from "lucide-react";
import { mockContacts, mockLeads, type CRMContact, type Lead } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const stageColors: Record<string, string> = {
  new: "bg-info/10 text-info",
  contacted: "bg-primary/10 text-primary",
  qualified: "bg-success/10 text-success",
  closed: "bg-success/20 text-success",
  lost: "bg-destructive/10 text-destructive",
};

export default function AgentCRM() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"leads" | "contacts">("leads");
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [contacts, setContacts] = useState<CRMContact[]>(mockContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", type: "buyer" as CRMContact["type"] });

  const advanceLead = (id: string) => {
    const stages: Lead["stage"][] = ["new", "contacted", "qualified", "closed"];
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const idx = stages.indexOf(l.stage);
        if (idx < stages.length - 1) {
          const next = stages[idx + 1];
          toast({ title: "Lead advanced", description: `${l.name} moved to ${next}.` });
          return { ...l, stage: next };
        }
        return l;
      })
    );
  };

  const markLost = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage: "lost" as Lead["stage"] } : l))
    );
    toast({ title: "Lead marked as lost" });
  };

  const addContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({ title: "Missing fields", description: "Please fill in name and email.", variant: "destructive" });
      return;
    }
    const contact: CRMContact = {
      id: `C${Date.now()}`,
      ...newContact,
      lastContact: new Date().toISOString().split("T")[0],
      notes: "",
      totalDeals: 0,
    };
    setContacts([contact, ...contacts]);
    setNewContact({ name: "", email: "", phone: "", type: "buyer" });
    setShowAddContact(false);
    toast({ title: "Contact added", description: `${contact.name} has been added to your CRM.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your leads and contacts.</p>
        </div>
        <button
          onClick={() => setShowAddContact(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-gold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddContact(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-elevated p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-foreground">Add Contact</h2>
              <button onClick={() => setShowAddContact(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <input value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Full Name *" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="Email *" type="email" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              <select value={newContact.type} onChange={(e) => setNewContact({ ...newContact, type: e.target.value as CRMContact["type"] })} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="investor">Investor</option>
              </select>
              <button onClick={addContact} className="w-full py-2.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Add Contact</button>
            </div>
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {(["new", "contacted", "qualified", "closed", "lost"] as const).map((stage) => {
              const count = leads.filter((l) => l.stage === stage).length;
              return (
                <div key={stage} className="rounded-xl bg-card border border-border p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${stageColors[stage]}`}>{stage}</span>
                  <p className="text-2xl font-bold text-foreground mt-2">{count}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {leads.map((lead) => (
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
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${stageColors[lead.stage]}`}>{lead.stage}</span>
                  <span className="text-xs text-muted-foreground">{lead.source}</span>
                  {lead.stage !== "closed" && lead.stage !== "lost" && (
                    <div className="flex gap-1">
                      <button onClick={() => advanceLead(lead.id)} className="px-2 py-1 rounded text-xs bg-success/10 text-success hover:bg-success/20 transition-colors">Advance</button>
                      <button onClick={() => markLost(lead.id)} className="px-2 py-1 rounded text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Lost</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-3">
          {contacts.map((contact) => (
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
              {contact.notes && <p className="mt-2 text-xs text-muted-foreground italic">{contact.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
