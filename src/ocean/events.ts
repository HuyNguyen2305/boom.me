function createBus<T>(initial: T) {
  const listeners = new Set<(v: T) => void>();
  let value = initial;
  return {
    get: () => value,
    set(v: T) {
      value = v;
      listeners.forEach((l) => l(v));
    },
    subscribe(l: (v: T) => void) {
      listeners.add(l);
      l(value);
      return () => void listeners.delete(l);
    },
  };
}

export const depthBus = createBus(0);
