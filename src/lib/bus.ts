// tiny app-wide event bus so Feed, Orb, and App can coordinate
type Handler = (payload?: any) => void;

class Bus {
  private map = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: Handler) {
    this.map.get(event)?.delete(handler);
  }

  emit<T = any>(event: string, payload?: T) {
    this.map.get(event)?.forEach((fn) => fn(payload));
  }
}

const bus = new Bus();
export default bus;
