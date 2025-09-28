export function afterPageLoad() {
  return new Promise<void>((resolve) => {
    if (document.readyState == 'complete') {
      resolve();
    } else {
      window.addEventListener('load', () => resolve());
    }
  });
}

export function subscribeEvent<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap,
>(
  target: T,
  type: K,
  listener: (this: T, event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): () => void;

export function subscribeEvent<
  T extends SVGElement,
  K extends keyof SVGElementEventMap,
>(
  target: T,
  type: K,
  listener: (this: T, event: SVGElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): () => void;

export function subscribeEvent<T extends EventTarget, K extends string>(
  target: T,
  type: K,
  listener: (this: T, event: Event) => void,
  options?: boolean | AddEventListenerOptions,
): () => void {
  target.addEventListener(type, listener, options);

  return () => {
    target.removeEventListener(type, listener, options);
  };
}

/** Generate unique identifiers in very performant way */
export function uniqueId(prefix: string = '') {
  return prefix + Math.floor(uniqueId._counter++).toString(36);
}

uniqueId._counter = 0;


export function clamp(min: number, now: number, max: number): number {
  return Math.min(Math.max(min, now), max);
}
