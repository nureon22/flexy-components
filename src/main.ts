import { FlexyButtonComponent } from './components/button';
import { FlexyCheckboxComponent } from './components/checkbox';
import { FlexyProgressbarComponent } from './components/progressbar';
import { FlexyRadioComponent } from './components/radio';
import { FlexySliderComponent } from './components/slider';
import { FlexySwitchComponent } from './components/switch';
import { FlexyTabsComponent } from './components/tabs';
import { FlexyTextfieldComponent } from './components/textfield';
import { FlexyTooltipComponent } from './components/tooltip';
import { afterPageLoad } from './utils';

afterPageLoad().then(() => {
  document.querySelectorAll('.flexy-button').forEach((el) => {
    if (el instanceof HTMLElement) FlexyButtonComponent.attach(el);
  });
  document.querySelectorAll('.flexy-checkbox').forEach((el) => {
    if (el instanceof HTMLElement) FlexyCheckboxComponent.attach(el);
  });
  document.querySelectorAll('.flexy-progressbar').forEach((el) => {
    if (el instanceof HTMLElement) FlexyProgressbarComponent.attach(el);
  });
  document.querySelectorAll('.flexy-radio').forEach((el) => {
    if (el instanceof HTMLElement) FlexyRadioComponent.attach(el);
  });
  document.querySelectorAll('.flexy-switch').forEach((el) => {
    if (el instanceof HTMLElement) FlexySwitchComponent.attach(el);
  });
  document.querySelectorAll('.flexy-slider').forEach((el) => {
    if (el instanceof HTMLElement) FlexySliderComponent.attach(el);
  });
  document.querySelectorAll('.flexy-tabs').forEach((el) => {
    if (el instanceof HTMLElement) FlexyTabsComponent.attach(el);
  });
  document.querySelectorAll('.flexy-textfield').forEach((el) => {
    if (el instanceof HTMLElement) FlexyTextfieldComponent.attach(el);
  });
  document.querySelectorAll('.flexy-tooltip').forEach((el) => {
    if (el instanceof HTMLElement) FlexyTooltipComponent.attach(el);
  });
});

export {
  FlexyButtonComponent,
  FlexyCheckboxComponent,
  FlexyProgressbarComponent,
  FlexyRadioComponent,
  FlexySliderComponent,
  FlexySwitchComponent,
  FlexyTabsComponent,
  FlexyTextfieldComponent,
  FlexyTooltipComponent,
};
