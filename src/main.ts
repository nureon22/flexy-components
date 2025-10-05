export * from './components';

import * as flexy from './components';
import { afterPageLoad } from './utilities';

afterPageLoad(() => {
  const initializationMap = {
    '.flexy-button': flexy.FlexyButtonComponent,
    '.flexy-checkbox': flexy.FlexyCheckboxComponent,
    '.flexy-progressbar': flexy.FlexyProgressbarComponent,
    '.flexy-progresscircle': flexy.FlexyProgresscircleComponent,
    '.flexy-radio': flexy.FlexyRadioComponent,
    '.flexy-switch': flexy.FlexySwitchComponent,
    '.flexy-slider': flexy.FlexySliderComponent,
    '.flexy-tabs': flexy.FlexyTabsComponent,
    '.flexy-textfield': flexy.FlexyTextfieldComponent,
    '.flexy-tooltip': flexy.FlexyTooltipComponent,
  } as const;

  for (const [selector, Component] of Object.entries(initializationMap)) {
    for (const element of document.querySelectorAll(selector)) {
      if (element instanceof HTMLElement) Component.attach(element);
    }
  }
});
