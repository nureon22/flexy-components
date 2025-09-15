import { FlexyBaseComponent } from '../base';

export class FlexyRadioComponent extends FlexyBaseComponent {
  readonly input = this.host.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;

  constructor(host: HTMLElement) {
    super(host);
  }

  get checked() {
    return this.input.checked;
  }

  set checked(value) {
    if (this.input.checked !== value) {
      this.input.checked = value;
    }
  }
}
