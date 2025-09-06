import { FlexyButtonComponent } from './components/button';
import { FlexySliderComponent } from './components/slider';
import { FlexySwitchComponent } from './components/switch';
import { afterPageLoad } from './utils';

afterPageLoad().then(() => {
  document.querySelectorAll('.flexy-button').forEach((el) => {
    if (el instanceof HTMLElement) new FlexyButtonComponent(el);
  });
  document.querySelectorAll('.flexy-switch').forEach((el) => {
    if (el instanceof HTMLElement) new FlexySwitchComponent(el);
  });
  document.querySelectorAll('.flexy-slider').forEach((el) => {
    if (el instanceof HTMLElement) new FlexySliderComponent(el);
  });
});
