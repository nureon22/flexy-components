export function afterPageLoad() {
  return new Promise<void>((resolve) => {
    if (document.readyState == 'complete') {
      resolve();
    } else {
      window.addEventListener('load', () => resolve());
    }
  });
}

/** Generate unique identifiers in very performant way */
export function uniqueId(prefix: string = '') {
  return prefix + Math.floor(uniqueId._counter++).toString(36);
}

uniqueId._counter = 0;
