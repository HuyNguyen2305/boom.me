type Listener = (depth: number) => void;

const listeners = new Set<Listener>();
let last = 0;

export const depthEvents = {
  emit(depth: number) {
    last = depth;
    listeners.forEach((l) => l(depth));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    l(last);
    return () => void listeners.delete(l);
  },
};
