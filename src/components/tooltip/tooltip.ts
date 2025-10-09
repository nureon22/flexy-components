import { autoPositioning, subscribeEvent, uniqueId } from '../../utilities';
import { FlexyBaseComponent } from '../base';

export class FlexyTooltipComponent extends FlexyBaseComponent {
  readonly anchor: Element | null | undefined;

  constructor(host: HTMLElement) {
    super(host);

    // generate tooltip id dynamically
    this.host.id ||= uniqueId('flexy-tooltip-');
    this.host.role ||= 'tooltip';

    this.host.style.setProperty('position', 'fixed');

    // Search for the anchor element that has the tooltip ID in its
    // aria-describedby attribute
    this.anchor = this.host.ownerDocument.querySelector(
      `[aria-describedby~="${this.host.id}"]`,
    );

    if (!this.anchor && this.host.previousElementSibling instanceof Element) {
      this.anchor = this.host.previousElementSibling;
      this.anchor.setAttribute(
        'aria-describedby',
        `${this.anchor.getAttribute('aria-describedby') || ''} ${this.host.id}`,
      );
    }

    if (this.anchor) {
      let showTimeout: number | undefined;
      let hideTimeout: number | undefined;

      const stopTimeouts = () => {
        clearTimeout(showTimeout);
        clearInterval(hideTimeout);
      };

      const onMouseEnter = () => {
        stopTimeouts();
        showTimeout = setTimeout(this.show.bind(this), this.showDelay);
      };

      const onMouseLeave = () => {
        stopTimeouts();
        hideTimeout = setTimeout(this.hide.bind(this), this.hideDelay);
      };

      const onClick = () => {
        stopTimeouts();
        this.hide();
      };

      const onFocusChange = () => {
        stopTimeouts();

        if (document.activeElement == this.anchor) {
          this.show();
        } else {
          this.hide();
        }
      };

      const onKeydown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
          stopTimeouts();
          this.hide();
        }
      };

      this.addDestroyTasks(
        subscribeEvent(this.host, 'mouseenter', onMouseEnter),
      );
      this.addDestroyTasks(
        subscribeEvent(this.host, 'mouseleave', onMouseLeave),
      );
      this.addDestroyTasks(
        subscribeEvent(this.anchor as HTMLElement, 'mouseenter', onMouseEnter),
      );
      this.addDestroyTasks(
        subscribeEvent(this.anchor as HTMLElement, 'mouseleave', onMouseLeave),
      );
      this.addDestroyTasks(
        subscribeEvent(this.anchor as HTMLElement, 'keydown', onKeydown),
      );
      this.addDestroyTasks(
        subscribeEvent(this.anchor as HTMLElement, 'click', onClick),
      );
      this.addDestroyTasks(
        subscribeEvent(this.anchor as HTMLElement, 'focus', onFocusChange),
      );
      this.addDestroyTasks(
        subscribeEvent(this.anchor as HTMLElement, 'blur', onFocusChange),
      );
    }
  }

  get placement(): 'above' | 'right' | 'below' | 'left' {
    const placement = this.host.dataset.flexyTooltipPlacement;

    switch (placement) {
      case 'above':
      case 'right':
      case 'below':
      case 'left': {
        return placement;
      }
      default: {
        return 'below';
      }
    }
  }

  set placement(placement) {
    this.host.dataset.flexyTooltipPlacement = placement;
  }

  get hideDelay(): number {
    return Number(this.host.dataset.flexyTooltipHidedelay) || 0;
  }

  set hideDelay(delay) {
    this.host.dataset.flexyTooltipHidedelay = String(delay);
  }

  get showDelay(): number {
    return Number(this.host.dataset.flexyTooltipShowdelay) || 0;
  }

  set showDelay(delay) {
    this.host.dataset.flexyTooltipShowdelay = String(delay);
  }

  /**
   * Update tooltip position.
   * Always call this method before showing the tooltip.
   */
  updatePosition() {
    if (!(this.anchor instanceof HTMLElement)) return;

    const pos = autoPositioning({
      anchor: this.anchor,
      container: this.host,
      placement: this.placement,
      margin: 0,
      getPosition: ({ anchorRect, containerRect, placement }) => {
        const { left, top, bottom, right, width, height } = anchorRect;
        const { width: containerWidth, height: containerHeight } =
          containerRect;

        switch (placement) {
          case 'above': {
            return {
              x: left + width / 2 - containerWidth / 2,
              y: top - containerHeight,
            };
          }
          case 'below': {
            return {
              x: left + width / 2 - containerWidth / 2,
              y: bottom,
            };
          }
          case 'left': {
            return {
              x: left - containerWidth,
              y: top + height / 2 - containerHeight / 2,
            };
          }
          case 'right': {
            return {
              x: right,
              y: top + height / 2 - containerHeight / 2,
            };
          }
        }
      },
    });

    const arrow = this.host.querySelector('.flexy-tooltip__arrow');

    if (arrow instanceof HTMLElement) {
      arrow.style.marginLeft = `${-pos.shiftX}px`;
    }

    this.host.style.setProperty('left', pos.x + pos.shiftX + 'px');
    this.host.style.setProperty('top', pos.y + pos.shiftY + 'px');

    this.host.classList.remove(
      'flexy-tooltip--above',
      'flexy-tooltip--below',
      'flexy-tooltip--left',
      'flexy-tooltip--right',
    );
    this.host.classList.add('flexy-tooltip--' + pos.placement);
  }

  /** check if currently tooltip is shown */
  isShown() {
    return this.host.classList.contains('flexy-tooltip--shown');
  }

  /** show the tooltip immediately */
  show() {
    if (!this.isShown()) {
      this.updatePosition();
      this.host.classList.add('flexy-tooltip--shown');
    }
  }

  /** hide the tooltip immediately */
  hide() {
    this.host.classList.remove('flexy-tooltip--shown');
  }
}
