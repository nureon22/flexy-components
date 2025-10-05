import RippleEffect from '@nureon22/ripple-effect';
import { animateNumber, uniqueId } from '../../utils';
import { FlexyBaseComponent } from '../base';

export class FlexyTabsComponent extends FlexyBaseComponent {
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

  selectedTab = this.tabs.findIndex((tab) => tab.ariaSelected == 'true');

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

      const observer = new ResizeObserver(() => {
        this.updateTabIndicator();
      });
      observer.observe(this.tablist);
      this.addDestroyTasks(() => observer.disconnect());
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
    if (!this.isValidIndex(selectedIndex)) {
      return;
    }

    const selectedTab = this.tabs[selectedIndex]!;

    this.tabs.forEach((tab, index) => {
      const selected = selectedIndex === index;
      tab.tabIndex = selected ? 0 : -1;
      tab.ariaSelected = String(selected);

      if (selected && focus) tab.focus();
    });

    this.panels.forEach((panel) => {
      const controls = selectedTab.getAttribute('aria-controls');

      if (controls) {
        const controlElement = document.getElementById(controls.split(',')[0]!);
        panel.hidden = panel != controlElement;
      } else {
        panel.hidden = true;
      }
    });

    this.selectedTab = selectedIndex;
    this.updateTabIndicator(true);
    this.autoScroll(selectedIndex, true);
  }

  /** Get index of the focused tab, if none of the tabs are focused, return -1 */
  getFocusedTab(): number {
    if (this.host.ownerDocument.activeElement instanceof HTMLElement) {
      return this.tabs.indexOf(this.host.ownerDocument.activeElement);
    }
    return -1;
  }

  /** Move the focus to specific tab */
  focusTab(index: number) {
    const focusedTab = this.getFocusedTab();

    if (focusedTab >= 0) {
      this.tabs[focusedTab]!.tabIndex = -1;
    }

    const totalTabs = this.tabs.length;
    index = index < 0 ? totalTabs - 1 : index >= totalTabs ? 0 : index;

    if (this.tabs[index]) {
      this.tabs[index]!.tabIndex = 0;
      this.tabs[index]!.focus();
      this.autoScroll(index, false);
    }
  }

  private _previousKeyDownTimestamp: number = performance.now();

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
    tab.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'Home':
        case 'End':
          // Prevent browser's native scrolling behaviour.
          // Instead, scrolling will be handled manually
          event.preventDefault();
          break;
      }

      // Add a 100ms delay between repeating keydown events
      if (event.timeStamp - this._previousKeyDownTimestamp < 100) {
        return;
      }
      this._previousKeyDownTimestamp = event.timeStamp;

      switch (event.key) {
        case 'ArrowLeft':
          this.focusTab(this.getFocusedTab() - 1);
          break;
        case 'ArrowRight':
          this.focusTab(this.getFocusedTab() + 1);
          break;
        case 'Home':
          this.focusTab(0);
          break;
        case 'End':
          this.focusTab(this.tabs.length - 1);
          break;
        case ' ':
        case 'Enter':
          this.selectTab(this.getFocusedTab());
          break;
        default:
          return;
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
      prevLeft: parseInt(this.tabIndicator.style.left) || 0,
      prevRight: parseInt(this.tabIndicator.style.right) || 0,
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

  // check if the index of the tab is valid
  isValidIndex(index: number) {
    return index >= 0 && index < this.tabs.length;
  }

  /**
   * Scroll the previous or next tab of the provided tab into viewport
   * with an animation or not
   */
  autoScroll(index: number, animate: boolean = false) {
    if (!this.isValidIndex(index)) {
      return;
    }

    if (!this.tablist || this.tablist.scrollWidth <= this.tablist.offsetWidth) {
      return;
    }

    const nextTab = this.tabs[index + 1] || this.tabs[index];
    const prevTab = this.tabs[index - 1] || this.tabs[index];

    const scrollLeft = this.tablist.scrollLeft;

    // Get spacing between tabs to add into scrollTo() method
    let spacing = parseFloat(getComputedStyle(this.tablist).gap);
    let scrollX = 0;

    // check if next tab is beyound the viewport
    if (
      nextTab &&
      nextTab.offsetLeft + nextTab.offsetWidth - scrollLeft >
        this.tablist.clientWidth
    ) {
      scrollX = nextTab.offsetWidth + spacing;
    }

    // check if previous tab is beyound the viewport
    if (prevTab && prevTab.offsetLeft < scrollLeft) {
      scrollX = prevTab.offsetWidth * -1 - spacing;
    }

    if (animate) {
      animateNumber({
        start: scrollLeft,
        stop: scrollLeft + scrollX,
        duration: 200,
        callback: ({ currentValue }) => {
          if (this.tablist) {
            this.tablist.scrollTo(currentValue, 0);
          }
        },
      });
    } else {
      this.tablist.scrollBy(scrollX, 0);
    }
  }
}
