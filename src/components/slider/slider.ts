import { FlexyBaseComponent } from '../base';

export class FlexySliderComponent extends FlexyBaseComponent {
  readonly input: HTMLInputElement | null = this.host.querySelector('input');

  readonly _children = {
    activeTrack: this.getChild('active-track'),
    inactiveTrack: this.getChild('inactive-track'),
    activeTicks: this.getChild('active-ticks'),
    inactiveTicks: this.getChild('inactive-ticks'),
    thumb: this.getChild('thumb'),
    valueIndicator:
      this.getChild('value-indicator') || this.getChild('value-indicator-m3'),
  };

  constructor(host: HTMLElement) {
    super(host);

    if (this.input) {
      this.input.min ||= '0';
      this.input.max ||= '100';

      this.update();
      this.updateTicks();

      this.input.addEventListener('input', this.handleInputEvent.bind(this));
      this.input.addEventListener('change', this.handleChangeEvent.bind(this));
    }
  }

  private isFirstInputEvent = true;

  handleInputEvent() {
    if (!this.isFirstInputEvent) {
      this.host.classList.add('flexy-slider--sliding');
    }
    this.isFirstInputEvent = false;
    this.update();
  }

  handleChangeEvent() {
    this.host.classList.remove('flexy-slider--sliding');
    this.isFirstInputEvent = true;
  }

  getChild(selector: string): HTMLElement | null {
    return this.host.querySelector('.flexy-slider__' + selector);
  }

  /**
   * Supposed to override to modify how the value is displayed in value indicator
   * By default, this function convert the value into integer string
   */
  valueIndicatorDisplayer(value: number) {
    return value.toFixed(0);
  }

  get ticksInterval() {
    const interval = Number(this.host.getAttribute('data-ticks-interval'));
    return interval > 0 && Number.isSafeInteger(interval) ? interval : 1;
  }

  set ticksInterval(interval: number) {
    if (interval > 0 && Number.isSafeInteger(interval)) {
      this.host.setAttribute('data-ticks-interval', String(interval));
      this.updateTicks();
    }
  }

  update() {
    if (!this.input) return;

    const {
      inactiveTrack,
      inactiveTicks,
      activeTrack,
      activeTicks,
      thumb,
      valueIndicator,
    } = this._children;

    const min = Number(this.input.min || '0');
    const max = Number(this.input.max || '100');
    const value = Number(this.input.value || '0');
    const progress = ((value - min) / (max - min)) * 100;

    if (inactiveTrack) {
      inactiveTrack.style.transform = `translateX(${progress}%)`;
    }
    if (inactiveTicks) {
      inactiveTicks.style.transform = `translateX(${-1 * progress}%)`;
    }
    if (activeTicks) {
      activeTicks.style.transform = `translateX(${100 - progress}%)`;
    }
    if (activeTrack) {
      activeTrack.style.transform = `translateX(${progress - 100}%)`;
    }
    if (thumb) {
      thumb.style.transform = `translateX(${progress - 100}%)`;
    }
    if (valueIndicator) {
      valueIndicator.textContent = this.valueIndicatorDisplayer(value);
    }
  }

  updateTicks() {
    if (!this.input) return;

    const { activeTicks, inactiveTicks } = this._children;
    const backgroundSize = this.ticksInterval * Number(this.input.step);

    if (inactiveTicks) {
      inactiveTicks.style.backgroundSize = `${backgroundSize}% 100%`;
    }
    if (activeTicks) {
      activeTicks.style.backgroundSize = `${backgroundSize}% 100%`;
    }
  }
}
