import { clamp } from '../../utilities';
import { FlexyBaseComponent } from '../base';

export class FlexyProgresscircleComponent extends FlexyBaseComponent {
  private readonly _activeTrack = this.host.querySelector(
    'circle.flexy-progresscircle__active-track',
  ) as SVGCircleElement | null;

  constructor(host: HTMLElement) {
    super(host);

    this.host.role ||= 'progressbar';
    this.host.ariaValueMin ||= '0';
    this.host.ariaValueMax ||= '100';

    this.update();

    const observer = new MutationObserver(() => this.update());

    observer.observe(this.host, {
      attributeFilter: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    });

    this.addDestroyTasks(() => {
      observer.disconnect();
    });
  }

  update() {
    if (!this._activeTrack) {
      return;
    }

    if (this.host.ariaValueNow) {
      const value = Number(this.host.ariaValueNow || '50');
      const min = Number(this.host.ariaValueMin || '0');
      const max = Number(this.host.ariaValueMax || '100');
      const progress = clamp(0, (value - min) / (max - min), 1);

      this.host.style.setProperty('--progress', progress + '');
    } else {
      this.host.style.removeProperty('--progress');
    }
  }
}
