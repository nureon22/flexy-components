import { FlexyBaseComponent } from '../base';

export class FlexySliderComponent extends FlexyBaseComponent {
  readonly input: HTMLInputElement | null = this.host.querySelector('input');

  readonly _children = {
    activeTrack: this.getChild('active-track'),
    inactiveTrack: this.getChild('inactive-track'),
    thumb: this.getChild('thumb'),
  };

  constructor(host: HTMLElement) {
    super(host);

    if (this.input) {
      this.input.min ||= "0";
      this.input.max ||= "100";

      this.update();

      this.input.addEventListener('input', this.handleInputEvent.bind(this));
      this.input.addEventListener('change', this.handleInputEvent.bind(this));
    }
  }

  private _inputEventCount = 0;

  handleInputEvent(event: Event) {
    switch (event.type) {
      case 'input':
        if (this._inputEventCount == 1) {
          this.host.classList.add('flexy-slider--sliding');
        }
        this._inputEventCount++;
        break;
      case 'change':
        this.host.classList.remove('flexy-slider--sliding');
        this._inputEventCount = 0;
        break;
    }

    this.update();
  }

  getChild(selector: string): HTMLElement | null {
    return this.host.querySelector('.flexy-slider__' + selector);
  }

  update() {
    if (!this.input) return;

    const { inactiveTrack, activeTrack, thumb } = this._children;

    const min = Number(this.input.min || '0');
    const max = Number(this.input.max || '100');
    const value = Number(this.input.value || '0');
    const progress = ((value - min) / (max - min)) * 100;

    if (inactiveTrack) {
      inactiveTrack.style.transform = `translateX(${progress}%)`;
    }
    if (activeTrack) {
      activeTrack.style.transform = `translateX(${progress - 100}%)`;
    }
    if (thumb) {
      thumb.style.transform = `translateX(${progress - 100}%)`;
    }
  }
}
