import { clamp } from '../../utilities';
import { FlexyBaseComponent } from '../base';

export class FlexyProgressbarComponent extends FlexyBaseComponent {
  private readonly _activeTrack = this.host.querySelector(
    '.flexy-progressbar__active-track',
  ) as HTMLElement | null;

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
      const progress = clamp(0, (value - min) / (max - min), 1) * 100;

      this._activeTrack.style.transform = `translateX(${progress - 100}%)`;
    } else {
      this._activeTrack.style.transform = '';
    }
  }
}
