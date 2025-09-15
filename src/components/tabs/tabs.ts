import RippleEffect from '@nureon22/ripple-effect';
import { FlexyBaseComponent } from '../base';

let tabsCount = 0;
let panelsCount = 0;

export class FlexyTabsComponent extends FlexyBaseComponent {
  selectedTab = 0;

  readonly tabs = Array.from(
    this.host.querySelector('.flexy-tablist')?.children || [],
  ).filter((tab) => tab.matches('.flexy-tab')) as HTMLElement[];

  readonly panels = Array.from(
    this.host.querySelector('.flexy-tab-panels')?.children || [],
  ).filter((panel) => panel.matches('.flexy-tab-panel')) as HTMLElement[];

  constructor(host: HTMLElement) {
    super(host);

    if (this.tabs.length != this.panels.length) {
      throw new Error('There are some missing tabs or panels');
    }

    for (let index = 0; index < this.tabs.length; index++) {
      this.addTab(this.tabs[index]!, this.panels[index]!);
    }

    this.selectTab(this.selectedTab);
  }

  selectNextTab(focus?: boolean) {
    if (this.selectedTab == this.tabs.length - 1) {
      this.selectFirstTab(focus);
    } else {
      this.selectTab(this.selectedTab + 1, focus);
    }
  }

  selectPreviousTab(focus?: boolean) {
    if (this.selectedTab == 0) {
      this.selectLastTab(focus);
    } else {
      this.selectTab(this.selectedTab - 1, focus);
    }
  }

  selectLastTab(focus?: boolean) {
    this.selectTab(this.tabs.length - 1, focus);
  }

  selectFirstTab(focus?: boolean) {
    this.selectTab(0, focus);
  }

  selectTab(selectedIndex: number, focus?: boolean) {
    const selectedTab = this.tabs[selectedIndex]!;

    this.tabs.forEach((tab, index) => {
      const selected = selectedIndex === index;
      tab.tabIndex = selected ? 0 : -1;
      tab.ariaSelected = String(selected);

      if (selected && focus) tab.focus();
    });

    this.panels.forEach((panel) => {
      const selected = panel == selectedTab.ariaControlsElements?.[0];
      panel.hidden = !selected;
    });

    this.selectedTab = selectedIndex;
  }

  addTab(tab: HTMLElement, panel: HTMLElement) {
    tab.id ||= 'flexy-tab-' + (tabsCount++);
    panel.id ||= 'flexy-panel-' + (panelsCount++);

    tab.role = 'tab';
    panel.role = 'tabpanel';

    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('aria-labelledby', tab.id);

    tab.addEventListener('click', () => {
      this.selectTab(this.tabs.indexOf(tab));
    });
    tab.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.selectPreviousTab(true);
          break;
        case 'ArrowRight':
          this.selectNextTab(true);
          break;
      }
    });
    const ripple = RippleEffect.attachTo(tab, {
      duration: 200,
      exitdelay: 100,
      hoveredOpacity: 0.08,
      focusedOpacity: 0,
      pressedOpacity: 0.12,
      keydown: false,
    });
    this.addDestroyTasks(() => ripple.destroy());
  }
}
