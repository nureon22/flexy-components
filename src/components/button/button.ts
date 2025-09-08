import RippleEffect from '@nureon22/ripple-effect';
import { FlexyBaseComponent } from '../base';

export class FlexyButtonComponent extends FlexyBaseComponent {
  constructor(host: HTMLElement) {
    super(host);

    const ripple = RippleEffect.attachTo(host, {
      duration: 200,
      exitdelay: 100,
      hoveredOpacity: 0.12,
      focusedOpacity: 0,
      pressedOpacity: 0.12,
      keydown: true,
    });
    this.addDestroyTasks(() => ripple.destroy());

    this.host.addEventListener('keydown', e => console.log(e.type));
    this.host.addEventListener('keyup', e => console.log(e.type));
  }
}
