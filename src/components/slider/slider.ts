import RippleEffect from '@nureon22/ripple-effect';
import { FlexyBaseComponent } from '../base';

export class FlexySliderComponent extends FlexyBaseComponent {
  readonly input: HTMLInputElement | null = this.host.querySelector('input');

  readonly _children = {
    inactiveTrack: this.getChild('inactive-track'),
    inactiveTicks: this.getChild('inactive-ticks'),
    activeTrack: this.getChild('active-track'),
    activeTicks: this.getChild('active-ticks'),
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

      const thumbRipple = this.getChild('thumb-ripple');

      if (thumbRipple) {
        RippleEffect.attachTo(thumbRipple, {
          centered: true,
          duration: 200,
          exitdelay: 100,
          focusedOpacity: 0.12,
          hoveredOpacity: 0.08,
          keydown: false,
          pressedOpacity: 0.2,
          rounded: true,
          trigger: this.input,
        });
      }
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
    const interval = Number(this.host.dataset.ticksInterval);
    return interval > 0 && Number.isSafeInteger(interval) ? interval : 1;
  }

  set ticksInterval(interval: number) {
    if (interval > 0 && Number.isSafeInteger(interval)) {
      this.host.dataset.ticksInterval = String(interval);
      this.updateTicks();
    }
  }

  update() {
    if (!this.input) return;

    const { activeTrack, activeTicks, thumb, valueIndicator } = this._children;

    const min = Number(this.input.min || '0');
    const max = Number(this.input.max || '100');
    const value = Number(this.input.value || '0');
    const progress = (value - min) / (max - min);

    if (activeTicks) {
      activeTicks.style.clipPath = `inset(0% ${Math.max(0, 100 - progress * 100)}% 0% 0%)`;
    }
    if (activeTrack) {
      activeTrack.style.transform = `scaleX(${progress})`;
    }
    if (thumb) {
      thumb.style.transform = `translateX(${progress * 100 - 100}%)`;
    }
    if (valueIndicator) {
      valueIndicator.textContent = this.valueIndicatorDisplayer(value);
    }
  }

  updateTicks() {
    if (!this.input) return;

    const { activeTicks, inactiveTicks } = this._children;
    const interval =
      100 / (this.ticksInterval * Number(this.input.step || '1'));
    const marks = Array.from({ length: interval - 1 }, () => '<span></span>');

    if (inactiveTicks) {
      inactiveTicks.innerHTML = marks.join('');
    }
    if (activeTicks) {
      activeTicks.innerHTML = marks.join('');
    }
  }
}
