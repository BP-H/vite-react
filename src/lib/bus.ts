type Handler<T = any> = (payload: T) => void;
const map = new Map<string, Set<Handler>>();

function on<T = any>(name: string, fn: Handler<T>) {
  let set = map.get(name);
  if (!set) { set = new Set(); map.set(name, set); }
  set.add(fn as Handler);
  return () => set!.delete(fn as Handler);
}
function emit<T = any>(name: string, payload: T) {
  map.get(name)?.forEach((fn) => fn(payload));
}
export default { on, emit };
