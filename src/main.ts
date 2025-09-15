import { FlexyButtonComponent } from './components/button';
import { FlexyCheckboxComponent } from './components/checkbox';
import { FlexyRadioComponent } from './components/radio';
import { FlexySliderComponent } from './components/slider';
import { FlexySwitchComponent } from './components/switch';
import { FlexyTabsComponent } from './components/tabs';
import { afterPageLoad } from './utils';

afterPageLoad().then(() => {
  document.querySelectorAll('.flexy-button').forEach((el) => {
    if (el instanceof HTMLElement) new FlexyButtonComponent(el);
  });
  document.querySelectorAll('.flexy-checkbox').forEach((el) => {
    if (el instanceof HTMLElement) new FlexyCheckboxComponent(el);
  });
  document.querySelectorAll('.flexy-radio').forEach((el) => {
    if (el instanceof HTMLElement) new FlexyRadioComponent(el);
  });
  document.querySelectorAll('.flexy-switch').forEach((el) => {
    if (el instanceof HTMLElement) new FlexySwitchComponent(el);
  });
  document.querySelectorAll('.flexy-slider').forEach((el) => {
    if (el instanceof HTMLElement) new FlexySliderComponent(el);
  });
  document.querySelectorAll('.flexy-tabs').forEach((el) => {
    if (el instanceof HTMLElement) new FlexyTabsComponent(el);
  });
});
