import { createHTMLElement } from '../../utilities';

interface Options {
  autoexit?: boolean;
  centered?: boolean;
  className?: string;
  rounded?: boolean;
  trigger?: HTMLElement;
  unbounded?: boolean;
}

export class FlexyRipple {
  options: Options;
  surface: HTMLElement;
  target: HTMLElement;

  onTouchBinded = this.onTouch.bind(this);

  constructor(target: HTMLElement, options: Options) {
    if (!(target instanceof HTMLElement)) {
      throw new TypeError('Argument 1 must be instanceof HTMLElement');
    }

    this.target = target;

    this.surface = createHTMLElement('span', { classList: ['flexy-ripple'] });
    this.target.prepend(this.surface);

    if (
      !['relative', 'absolute'].includes(getComputedStyle(this.target).position)
    ) {
      this.target.style.position = 'relative';
    }

    this.options = {};

    this.configure({
      autoexit: true,
      centered: false,
      className: '',
      rounded: false,
      trigger: this.target,
      unbounded: false,
      ...options,
    });
  }

  configure(options: Options) {
    const oldOptions = { ...this.options };
    const newOptions = (this.options = { ...oldOptions, ...options });

    if (oldOptions.trigger != newOptions.trigger) {
      const onTouch = this.onTouchBinded;

      if (oldOptions.trigger) {
        oldOptions.trigger.removeEventListener('pointerdown', onTouch);
      }
      if (newOptions.trigger) {
        newOptions.trigger.addEventListener('pointerdown', onTouch);
      }
    }

    if (oldOptions.className != newOptions.className) {
      if (oldOptions.className) {
        this.surface.classList.remove(oldOptions.className);
      }
      if (newOptions.className) {
        this.surface.classList.add(newOptions.className);
      }
    }

    Object.assign(this.surface.style, {
      borderRadius: this.options.rounded ? '50%' : 'inherit',
      overflow: this.options.unbounded ? 'visible' : 'hidden',
    });
  }

  onTouch(event: PointerEvent): void {
    if (event.button !== 0) return;

    let pressing = true;
    let x, y;

    const rect = this.surface.getBoundingClientRect();

    if (this.options.centered) {
      x = rect.width / 2;
      y = rect.height / 2;
    } else {
      x = event.clientX - rect.x;
      y = event.clientY - rect.y;
    }

    if (!this.options.autoexit) return void this.trigger(x, y);

    let exitFunction: () => void;

    this.trigger(x, y, (exit) => {
      exitFunction = exit;
      if (!pressing) exitFunction();
    });
    globalThis.addEventListener(
      'pointerup',
      () => {
        pressing = false;
        exitFunction?.();
      },
      { once: true },
    );
  }

  /**
   * Trigger a new ripple effect
   */
  trigger(x: number, y: number, exitFunction?: (exit: () => void) => void) {
    const radius = Math.hypot(
      Math.max(x, this.surface.clientWidth - x),
      Math.max(y, this.surface.clientHeight - y),
    );

    const effect = createHTMLElement('span', {
      classList: ['flexy-ripple__effect'],
      style: {
        left: x + 'px',
        top: y + 'px',
        width: radius * 2 + 'px',
        height: radius * 2 + 'px',
      },
    });
    this.surface.append(effect);

    const exit = () => {
      effect.classList.add('flexy-ripple__effect--exit');
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      switch (event.animationName) {
        case 'flexy-ripple-enter': {
          if (typeof exitFunction === 'function') {
            exitFunction(exit);
          } else {
            exit();
          }
          break;
        }
        case 'flexy-ripple-exit': {
          effect.removeEventListener('animationend', onAnimationEnd);
          effect.remove();
        }
      }
    };

    effect.addEventListener('animationend', onAnimationEnd);
  }

  destroy() {
    if (this.options.trigger) {
      this.options.trigger.removeEventListener(
        'pointerdown',
        this.onTouchBinded,
      );
    }
    this.surface.remove();
    FlexyRipple.instances.delete(this.target);
  }

  static attachTo(target: HTMLElement, options: Options): FlexyRipple {
    if (!this.instances.has(target)) {
      this.instances.set(target, new FlexyRipple(target, options));
    }
    return this.instances.get(target)!;
  }

  static instances = new WeakMap<HTMLElement, FlexyRipple>();
}
