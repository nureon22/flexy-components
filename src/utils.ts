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

export function subscribeEvent<
  T extends Window,
  K extends keyof WindowEventMap,
>(
  target: T,
  type: K,
  listener: (this: T, event: WindowEventMap[K]) => void,
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

export interface ElementCreationConfig {
  attributes?: Record<string, string>;
  children?: Array<Node | string>;
  id?: string;
}

export function configureElement<T extends Element>(
  element: T,
  config?: ElementCreationConfig,
): T {
  const { attributes, children, id } = config || {};

  for (const name in attributes) {
    if (attributes[name]) {
      element.setAttribute(name, attributes[name]);
    }
  }

  if (children) {
    const safeChildren = children.filter((child) => {
      return (child && (typeof child == 'string' || child instanceof Node));
    });
    element.append(...safeChildren);
  }

  if (id) {
    element.id ||= id;
  }

  return element;
}

export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  config?: ElementCreationConfig,
): HTMLElementTagNameMap[K] {
  return configureElement(document.createElement(tagName), config);
}

export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  qualifiedName: K,
  config?: ElementCreationConfig,
): SVGElementTagNameMap[K] {
  return configureElement(
    document.createElementNS('http://www.w3.org/2000/svg', qualifiedName),
    config,
  );
}
