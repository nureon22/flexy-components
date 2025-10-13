import { FlexyRipple } from '../../cdk/ripple';
import { FlexyBaseComponent } from '../base';

export class FlexyButtonComponent extends FlexyBaseComponent {
  constructor(host: HTMLElement) {
    super(host);

    const ripple = FlexyRipple.attachTo(host, {
      className: 'flexy-button__ripple',
    });
    this.addDestroyTasks(() => ripple.destroy());
  }
}
