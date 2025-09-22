import { subscribeEvent, uniqueId } from '../../utils';
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
        document.activeElement == this.anchor ? this.show() : this.hide();
      };

      const onKeydown = (e: KeyboardEvent) => {
        if (e.key == 'Escape') {
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
    const placement = this.host.getAttribute('data-flexy-tooltip-placement');

    switch (placement) {
      case 'above':
      case 'right':
      case 'below':
      case 'left':
        return placement;
      default:
        return 'below';
    }
  }

  set placement(placement) {
    this.host.setAttribute('data-flexy-tooltip-placement', placement);
  }

  get hideDelay(): number {
    return Number(this.host.getAttribute('data-flexy-tooltip-hidedelay')) || 0;
  }

  set hideDelay(delay) {
    this.host.setAttribute('data-flexy-tooltip-hidedelay', String(delay));
  }

  get showDelay(): number {
    return Number(this.host.getAttribute('data-flexy-tooltip-showdelay')) || 0;
  }

  set showDelay(delay) {
    this.host.setAttribute('data-flexy-tooltip-showdelay', String(delay));
  }

  /**
   * Update tooltip position.
   * Always call this method before showing the tooltip.
   */
  updatePosition() {
    if (!this.anchor) return;

    const anchorRect = this.anchor.getBoundingClientRect();
    const tooltipRect = this.host.getBoundingClientRect();

    const viewportWidth = this.host.ownerDocument.documentElement.clientWidth;
    const viewportHeight = this.host.ownerDocument.documentElement.clientHeight;

    const pos = { x: 0, y: 0 };

    let placement = this.placement;

    // check if there is an enough space to render the tooltip within viewport
    const canBeLeft = anchorRect.left - tooltipRect.width >= 0;
    const canBeRight = anchorRect.right + tooltipRect.width <= viewportWidth;
    const canBeAbove = anchorRect.top - tooltipRect.height >= 0;
    const canBeBelow = anchorRect.bottom + tooltipRect.height <= viewportHeight;

    // flip placement if necessary
    switch (placement) {
      case 'left':
        if (!canBeLeft && canBeRight) {
          placement = 'right';
        } else if (!canBeLeft && !canBeRight) {
          placement = 'below';
        }
        break;
      case 'right':
        if (!canBeRight && canBeLeft) {
          placement = 'left';
        } else if (!canBeLeft && !canBeRight) {
          placement = 'below';
        }
        break;
      case 'above':
        if (!canBeAbove && canBeBelow) {
          placement = 'below';
        }
        break;
      case 'below':
        if (!canBeBelow && canBeAbove) {
          placement = 'above';
        }
        break;
    }

    switch (placement) {
      case 'above':
        pos.x = anchorRect.x + anchorRect.width / 2 - tooltipRect.width / 2;
        pos.y = anchorRect.top - tooltipRect.height;
        break;
      case 'below':
        pos.x = anchorRect.x + anchorRect.width / 2 - tooltipRect.width / 2;
        pos.y = anchorRect.bottom;
        break;
      case 'left':
        pos.x = anchorRect.x - tooltipRect.width;
        pos.y = anchorRect.y + anchorRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        pos.x = anchorRect.right;
        pos.y = anchorRect.y + anchorRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    switch (placement) {
      case 'above':
      case 'below':
        // Prevent tooltip from overflowing the viewport on the horizontal axis
        if (pos.x < 0) {
          pos.x = 0;
        } else if (pos.x + tooltipRect.width > viewportWidth) {
          pos.x = viewportWidth - tooltipRect.width;
        }
        break;
    }

    this.host.style.setProperty('left', pos.x + 'px');
    this.host.style.setProperty('top', pos.y + 'px');

    this.host.classList.remove(
      'flexy-tooltip--above',
      'flexy-tooltip--below',
      'flexy-tooltip--left',
      'flexy-tooltip--right',
    );
    this.host.classList.add('flexy-tooltip--' + placement);
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
