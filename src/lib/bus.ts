// src/lib/bus.ts
// Event names centralised here for type safety
export enum Events {
  ChatAdd = "chat:add",
  OrbPortal = "orb:portal",
  UiLeave = "ui:leave",
  WorldUpdate = "world:update",
  FeedHover = "feed:hover",
  NavGoto = "nav:goto",
  IdentityUpdate = "identity:update",
  SearchUpdate = "search:update",
  BackendUpdate = "backend:update",
}

type Handler<T = any> = (payload: T) => void;

const map = new Map<Events, Set<Handler>>();

export type Unsubscribe = () => void;

export function on<T = any>(name: Events, fn: Handler<T>): Unsubscribe {
  let set = map.get(name);
  if (!set) {
    set = new Set();
    map.set(name, set);
  }
  set.add(fn as Handler);
  // IMPORTANT: return void, not boolean
  return () => {
    const s = map.get(name);
    if (s) s.delete(fn as Handler);
  };
}

export function emit<T = any>(name: Events, payload: T): void {
  const listeners = map.get(name);
  if (!listeners || listeners.size === 0) {
    if (import.meta.env.DEV) {
      console.warn(`[bus] no listeners for event "${name}"`, payload);
    }
    return;
  }
  listeners.forEach((fn) => {
    try {
      fn(payload);
    } catch {
      // swallow listener errors
    }
  });
}

export default { on, emit };
