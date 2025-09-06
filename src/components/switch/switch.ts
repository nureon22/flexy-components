import { FlexyBaseComponent } from '../base';

export class FlexySwitchComponent extends FlexyBaseComponent {
  readonly input: HTMLInputElement | null = this.host.querySelector('input');

  constructor(host: HTMLElement) {
    super(host);
  }
}
