import RippleEffect from '@nureon22/ripple-effect';
import { subscribeEvent, uniqueId } from '../../utils';
import { FlexyBaseComponent } from '../base';

export class FlexyTabsComponent extends FlexyBaseComponent {
  selectedTab = 0;

  readonly tablist = this.host.querySelector(
    '.flexy-tablist',
  ) as HTMLElement | null;
  readonly tabpanels = this.host.querySelector(
    '.flexy-tab-panels',
  ) as HTMLElement | null;
  readonly tabIndicator = this.tablist?.querySelector(
    '.flexy-tab-indicator',
  ) as HTMLElement | null;

  readonly tabs = Array.from(this.tablist?.children || []).filter((tab) =>
    tab.matches('.flexy-tab'),
  ) as HTMLElement[];

  readonly panels = Array.from(this.tabpanels?.children || []).filter((panel) =>
    panel.matches('.flexy-tab-panel'),
  ) as HTMLElement[];

  constructor(host: HTMLElement) {
    super(host);

    if (this.tabs.length != this.panels.length) {
      throw new Error('There are some missing tabs or panels');
    }

    for (let index = 0; index < this.tabs.length; index++) {
      this.addTab(this.tabs[index]!, this.panels[index]!);
    }

    if (this.tablist && this.tabIndicator) {
      // make sure tab indicator is the last child of the tablist
      this.tablist.appendChild(this.tabIndicator);

      this.addDestroyTasks(
        subscribeEvent(window, 'resize', () => this.updateTabIndicator()),
      );
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
    this.updateTabIndicator(true);
  }

  addTab(tab: HTMLElement, panel: HTMLElement) {
    tab.id ||= uniqueId('flexy-tab-');
    panel.id ||= uniqueId('flexy-tab-panel-');

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

  updateTabIndicator(animation: boolean = false) {
    if (!this.tabIndicator || !this.tablist) {
      return;
    }

    const tab = this.tabs[this.selectedTab]!;

    const position = {
      prevLeft: parseInt(this.tabIndicator.style.left),
      prevRight: parseInt(this.tabIndicator.style.right),
      nextLeft: tab.offsetLeft,
      nextRight: this.tablist.offsetWidth - (tab.offsetLeft + tab.offsetWidth),
    };

    const easeIn = 'cubic-bezier(0.47,0,0.75,0.72)';
    const easeOut = 'cubic-bezier(0.39,0.57,0.56,1)';

    if (position.nextLeft > position.prevLeft) {
      this.tabIndicator.style.transitionTimingFunction = `${easeIn}, ${easeOut}`;
    } else {
      this.tabIndicator.style.transitionTimingFunction = `${easeOut}, ${easeIn}`;
    }

    this.tabIndicator.style.transitionDuration = animation ? '' : '0ms';
    this.tabIndicator.style.left = position.nextLeft + 'px';
    this.tabIndicator.style.right = position.nextRight + 'px';
  }
}
