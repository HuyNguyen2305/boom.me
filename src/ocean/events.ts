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
/** Screen y of the main fish, so the page can tell which project card it is next to. */
export const fishYBus = createBus(0);
/** Screen x of the main fish centre (pairs with fishYBus). */
export const fishXBus = createBus(0);
