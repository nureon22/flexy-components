export function afterPageLoad(callback?: () => void) {
  return new Promise<void>((resolve) => {
    if (document.readyState == 'complete') {
      callback?.();
      resolve();
    } else {
      window.addEventListener('load', () => {
        callback?.();
        resolve();
      });
    }
  });
}

export function subscribeEvent<T extends EventTarget, E extends Event>(
  target: T,
  type: string,
  listener: (this: T, event: E) => void,
  options?: boolean | AddEventListenerOptions,
): () => void {
  target.addEventListener(type, listener as () => void, options);

  return () => {
    target.removeEventListener(type, listener as () => void, options);
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
  classList?: string[];
  style?: Record<string, string>;
  children?: Array<Node | string>;
  id?: string;
}

export function configureElement<T extends HTMLElement | SVGElement>(
  element: T,
  config?: ElementCreationConfig,
): T {
  const { attributes, classList, children, id, style } = config || {};

  for (const name in attributes) {
    if (attributes[name]) {
      element.setAttribute(name, attributes[name]);
    }
  }

  if (classList) {
    element.classList.add(...classList.filter((className) => !!className));
  }

  if (style) {
    Object.assign(element.style, style);
  }

  if (children) {
    const safeChildren = children.filter((child) => {
      return child && (typeof child == 'string' || child instanceof Node);
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

export function animateNumber(options: {
  start: number;
  stop: number;
  duration: number;
  callback: (value: {
    start: number;
    stop: number;
    previousValue: number;
    currentValue: number;
  }) => void;
}) {
  const { start, stop, duration, callback } = options;

  const change = stop - start;
  const startedTimestamp = performance.now();

  let previousValue = start;
  let currentValue = start;

  function step(currentTimestamp: number) {
    const elapsed = currentTimestamp - startedTimestamp;
    const progress = Math.min(elapsed / duration, 1);

    currentValue = start + change * progress;

    callback({ start, stop, previousValue, currentValue });

    previousValue = currentValue;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/** Set the attribute if it isn't defined or it is a empty string */
export function setDefaultAttribute(
  element: Element,
  name: string,
  value: string,
) {
  if (!element.getAttribute(name)) element.setAttribute(name, value);
}

export function autoPositioning<A extends Element, B extends Element>(options: {
  anchor: A;
  container: B;
  margin?: number;
  placement: 'above' | 'below' | 'left' | 'right';
  fixed?: boolean;
  cursor?: { x: number; y: number } | undefined;
  getPosition: (options: {
    anchor: A;
    anchorRect: DOMRect;
    container: B;
    containerRect: DOMRect;
    cursor?: { x: number; y: number } | undefined;
    fixed: boolean;
    margin: number;
    placement: 'above' | 'below' | 'left' | 'right';
    viewportHeight: number;
    viewportWidth: number;
  }) => { x: number; y: number };
}) {
  const { anchor, container, fixed = false, getPosition, margin = 0 } = options;
  const { cursor } = options;
  let { placement } = options;

  const viewportWidth = anchor.ownerDocument.documentElement.clientWidth;
  const viewportHeight = anchor.ownerDocument.documentElement.clientHeight;

  const anchorRect = anchor.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  const anchorLeft = cursor ? cursor.x : anchorRect.left;
  const anchorRight = cursor ? cursor.x : anchorRect.right;
  const anchorTop = cursor ? cursor.y : anchorRect.top;
  const anchorBottom = cursor ? cursor.y : anchorRect.bottom;

  if (!fixed) {
    // check if there is an enough space to render the container within viewport
    const canBeLeft = anchorLeft - containerWidth - margin >= 0;
    const canBeRight = anchorRight + containerWidth + margin <= viewportWidth;
    const canBeAbove = anchorTop - containerHeight - margin >= 0;
    const canBeBelow =
      anchorBottom + containerHeight + margin <= viewportHeight;

    // flip placement if necessary
    switch (placement) {
      case 'left': {
        if (!canBeLeft && canBeRight) {
          placement = 'right';
        } else if (!canBeLeft && !canBeRight && canBeBelow) {
          placement = 'below';
        } else if (!canBeLeft && !canBeRight && !canBeBelow && canBeAbove) {
          placement = 'above';
        }
        break;
      }
      case 'right': {
        if (!canBeRight && canBeLeft) {
          placement = 'left';
        } else if (!canBeRight && !canBeLeft && canBeBelow) {
          placement = 'below';
        } else if (!canBeRight && !canBeLeft && !canBeBelow && canBeAbove) {
          placement = 'above';
        }
        break;
      }
      case 'above': {
        if (!canBeAbove && canBeBelow) {
          placement = 'below';
        }
        break;
      }
      case 'below': {
        if (!canBeBelow && canBeAbove) {
          placement = 'above';
        }
        break;
      }
    }
  }

  const pos = { x: 0, y: 0, shiftX: 0, shiftY: 0, placement };

  Object.assign(
    pos,
    getPosition({
      anchor,
      anchorRect,
      container,
      containerRect,
      cursor: options.cursor,
      fixed,
      margin,
      placement,
      viewportHeight,
      viewportWidth,
    }),
  );

  // Prevent container from overflowing the viewport on the horizontal axis
  if (pos.x < margin) {
    pos.shiftX = margin - pos.x;
  } else if (pos.x + margin + containerWidth > viewportWidth) {
    pos.shiftX = viewportWidth - containerWidth - pos.x - margin;
  }
  if (pos.y < margin) {
    pos.shiftY = margin - pos.y;
  } else if (pos.y + margin + containerHeight > viewportHeight) {
    pos.shiftY = viewportHeight - containerHeight - pos.y - margin;
  }

  return pos;
}
