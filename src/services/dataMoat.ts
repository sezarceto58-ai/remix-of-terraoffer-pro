// Data Moat — structured event logging for platform intelligence

interface DataMoatEvent {
  event_type: string;
  entity_id?: string;
  entity_type?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

const eventBuffer: DataMoatEvent[] = [];

export function trackEvent(
  eventType: string,
  entityId?: string,
  entityType?: string,
  metadata?: Record<string, unknown>
) {
  eventBuffer.push({
    event_type: eventType,
    entity_id: entityId,
    entity_type: entityType,
    metadata,
    timestamp: new Date().toISOString(),
  });

  // Auto-flush every 10 events
  if (eventBuffer.length >= 10) {
    flushEvents();
  }
}

export function flushEvents() {
  if (eventBuffer.length === 0) return;
  // In production, connect to: supabase.from("data_moat_events").insert(eventBuffer)
  console.debug(`[DataMoat] Flushing ${eventBuffer.length} events`);
  eventBuffer.length = 0;
}

// Convenience helpers
export const trackPropertyView = (id: string) => trackEvent("property_view", id, "property");
export const trackValuationRequest = (id: string) => trackEvent("valuation_requested", id, "property");
export const trackMarketIntelView = (city: string) => trackEvent("market_intel_view", city, "city");
export const trackSyndicationView = (id: string) => trackEvent("syndication_view", id, "deal");
export const trackInvestmentIntent = (id: string, amount: number) =>
  trackEvent("investment_intent", id, "deal", { amount });
