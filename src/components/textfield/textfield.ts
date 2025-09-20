import { FlexyBaseComponent } from '../base';

export class FlexyTextfieldComponent extends FlexyBaseComponent {
  readonly input = this.host.querySelector('input') as HTMLInputElement;

  constructor(host: HTMLElement) {
    super(host);

    this.host.addEventListener('click', (event) => {
      if (!this.input.isSameNode(event.target as Node)) this.input.focus();
    });
    this.input.placeholder ||= ' ';
  }
}
