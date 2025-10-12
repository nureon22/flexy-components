import { autoPositioning, subscribeEvent, uniqueId } from '../../utilities';
import { FlexyBaseComponent } from '../base';

type VALID_PLACEMENT = 'above' | 'below' | 'left' | 'right';

export class FlexyMenuComponent extends FlexyBaseComponent {
  items: HTMLElement[] = [];

  submenus = new WeakMap<Element, FlexyMenuComponent>();

  parentMenu: FlexyMenuComponent | undefined;

  anchor: Element | undefined;

  private _ownerDoc = this.host.ownerDocument;
  private _isOpened = false;
  private _cursor: { x: number; y: number } | undefined;

  constructor(host: HTMLElement) {
    super(host);

    this._initHostAttribute();
    this._initAnchor();
    this._initItems();
    this._initSubmenus();
  }

  /** Initialize basic accessibility attributes of the menu's host element */
  private _initHostAttribute() {
    this.host.id ||= uniqueId('flexy-menu-');
    this.host.role ||= 'menu';
    this.host.ariaOrientation ||= 'vertical';
  }

  /** Find the anchor element and bind required events to it */
  private _initAnchor() {
    const anchorId = this.host.getAttribute('aria-labelledby');

    if (anchorId) {
      this.anchor = this._ownerDoc.querySelector(`#${anchorId}`) || undefined;
    }

    if (!this.anchor) return;

    this.anchor.id ||= uniqueId('flexy-menuanchor');
    this.anchor.ariaHasPopup ||= 'menu';

    // Only the root menu handles repositioning
    this.addDestroyTasks(
      subscribeEvent(globalThis, 'scroll', () => {
        if (this._isOpened && !this.parentMenu && !this.isContextMenu()) {
          this.updatePosition();
        }
      }),
      subscribeEvent(globalThis, 'resize', () => {
        if (this._isOpened) this.updatePosition();
      }),
      subscribeEvent(globalThis, 'click', this.globalClickHandler.bind(this)),
      subscribeEvent(this.anchor, 'click', () => {
        void (this.isContextMenu() ? this.close() : this.toggle());
      }),
      subscribeEvent(this.anchor, 'contextmenu', (event: MouseEvent) => {
        if (!this.isContextMenu()) return;
        this._cursor = { x: event.x, y: event.y };
        event.preventDefault();
        this.toggle();
      }),
    );
  }

  /** Collect valid menu items and bind events to them */
  private _initItems() {
    for (const item of this.host.children) {
      if (!(item instanceof HTMLElement && item.matches('.flexy-menuitem'))) {
        continue;
      }

      this.items.push(item);

      item.id ||= uniqueId('flexy-menuitem-');
      item.role ||= 'menuitem';
      item.tabIndex = -1;

      // Click + keyboard handlers for each item
      this.addDestroyTasks(
        subscribeEvent(item, 'click', this.onItemClick.bind(this)),
        subscribeEvent(item, 'keydown', this.onItemKeyDown.bind(this)),
      );
    }
  }

  private _initSubmenus() {
    for (const item of this.items) {
      const selector = `.flexy-menu[aria-labelledby="${item.id}"]`;
      const element = this._ownerDoc.querySelector(selector);

      if (element instanceof HTMLElement) {
        const submenu = FlexyMenuComponent.attach<FlexyMenuComponent>(element);
        submenu.parentMenu = this;
        this.submenus.set(item, submenu);
      }
    }

    // unlink when the submenu get destroy
    this.addDestroyTasks(() => {
      if (this.anchor && this.parentMenu) {
        this.parentMenu.submenus.delete(this.anchor);
        this.parentMenu = undefined;
      }
    });
  }

  get placement(): VALID_PLACEMENT {
    const placement = this.host.dataset.flexyMenuPlacement;

    if (placement && /^(above|below|left|right)$/.test(placement)) {
      return placement as VALID_PLACEMENT;
    }
    return 'below';
  }

  set placement(placement) {
    this.host.dataset.flexyMenuPlacement = placement;
  }

  /** Reset all items' tabIndex so none are focusable. */
  resetItemsTabIndex() {
    for (const item of this.items) item.tabIndex = -1;
  }

  /**
   * Focus the item at the given index, wrapping around if needed.
   * Used for arrow-key navigation.
   */
  focusItem(index: number) {
    if (this.items.length === 0) return;

    const total = this.items.length;

    // prettier-ignore
    index = index < 0 ? total - 1 : (index >= total ? 0 : index);

    this.resetItemsTabIndex();

    const item = this.items[index]!;
    item.tabIndex = 0;
    item.focus();
  }

  /** Return focus to the menu's trigger element. */
  focusAnchor() {
    this.resetItemsTabIndex();
    if (this.anchor instanceof HTMLElement) this.anchor.focus();
  }

  // --------------------
  // Positioning
  // --------------------

  /**
   * Compute the position of the menu relative to its anchor.
   * Can be overridden to customize layout behavior.
   */
  getPosition(options: {
    anchor: Element;
    anchorRect: DOMRect;
    container: Element;
    containerRect: DOMRect;
    cursor?: { x: number; y: number } | undefined;
    margin: number;
    placement: 'above' | 'below' | 'left' | 'right';
    viewportWidth: number;
    viewportHeight: number;
  }): { x: number; y: number } {
    const { placement, containerRect, cursor, margin } = options;
    const { top, right, bottom, left } = options.anchorRect;

    if (this.isContextMenu() && cursor) {
      return { x: cursor.x + margin, y: cursor.y + margin };
    }

    switch (placement) {
      case 'above': {
        return { x: left, y: top - containerRect.height - margin };
      }
      case 'below': {
        return { x: left, y: bottom + margin };
      }
      case 'left': {
        return { x: left - containerRect.width - margin, y: top };
      }
      case 'right': {
        return { x: right + margin, y: top };
      }
    }
  }

  /**
   * Update the menu's transform position relative to its trigger element.
   * Called on open, scroll, or resize events. If you want to apply custom
   * position, override getPosition() method.
   */
  updatePosition() {
    if (!this._isOpened || !this.anchor || !this.host.isConnected) return;

    const pos = autoPositioning({
      anchor: this.anchor,
      container: this.host,
      placement: this.placement,
      cursor: this.isContextMenu() && !this.parentMenu ? this._cursor : undefined,
      margin: 8,
      getPosition: this.getPosition.bind(this),
    });

    const left = pos.x + pos.shiftX;
    const top = pos.y + pos.shiftY;
    const offsetParent = this.host.offsetParent;

    if (offsetParent && offsetParent != this._ownerDoc.body) {
      const rect = offsetParent.getBoundingClientRect();
      this.host.style.transform = `translate(${left - rect.x}px, ${top - rect.y}px)`;
    } else {
      this.host.style.transform = `translate(${left}px, ${top}px)`;
    }
  }

  /** Update ARIA attributes (`aria-expanded`, `aria-controls`) when toggled. */
  updateAriaAttributes() {
    if (!this.anchor) {
      return;
    }

    if (this._isOpened) {
      this.anchor.setAttribute('aria-controls', this.host.id);
      this.anchor.setAttribute('aria-expanded', 'true');
    } else {
      this.anchor.removeAttribute('aria-controls');
      this.anchor.removeAttribute('aria-expanded');
    }
  }

  isContextMenu() {
    return this.host.classList.contains('flexy-menu--contextmenu');
  }

  isOpened(): boolean {
    return this._isOpened;
  }

  /** Open this menu and dispatch related lifecycle events */
  open() {
    if (this._isOpened) return;

    this._isOpened = true;

    this.host.dispatchEvent(new CustomEvent('flexy-menu-opening'));
    this.host.classList.add('flexy-menu--shown');
    this.updateAriaAttributes();
    this.updatePosition();
    this.focusItem(0);
    this.host.dispatchEvent(new CustomEvent('flexy-menu-opened'));
  }

  /** Close this menu and all of its nested submenus */
  close() {
    this.closeAllSubmenus();

    if (!this._isOpened) return;

    this._isOpened = false;

    this.host.dispatchEvent(new CustomEvent('flexy-menu-closing'));
    this.updateAriaAttributes();
    this.host.classList.remove('flexy-menu--shown');
    this.focusAnchor();

    const unsubscribe = subscribeEvent(this.host, 'transitionend', () => {
      this.host.dispatchEvent(new CustomEvent('flexy-menu-closed'));
      unsubscribe();
    });
  }

  /**
   * Recursively close all child submenus.
   * This method doesn't close the current menu
   */
  closeAllSubmenus() {
    for (const item of this.items) {
      this.submenus.get(item)?.close();
    }
  }

  /** Close all ancestor menus (useful for nested submenu exit). */
  closeAllParentMenus() {
    let parent = this.parentMenu;

    while (parent && parent.parentMenu) {
      parent = parent.parentMenu;
    }
    (parent || this).close();
  }

  toggle() {
    void (this._isOpened ? this.close() : this.open());
  }

  onItemClick(event: Event) {
    if (!(event.target instanceof Element)) return;

    const item = event.target.closest('.flexy-menuitem');

    if (!(item instanceof HTMLElement && this.items.includes(item))) {
      return;
    }

    if (this.submenus.has(item)) {
      this.closeAllSubmenus();
    } else {
      this.close();
      this.closeAllParentMenus();
    }
  }

  /**
   * Handle keyboard navigation and interaction within the menu.
   * Supports Enter/Space for selection, arrows for navigation, and Escape to close.
   */
  onItemKeyDown(event: KeyboardEvent) {
    const item = event.target;

    if (!(item instanceof HTMLElement && this.items.includes(item))) {
      return;
    }

    switch (event.key) {
      case ' ':
      case 'Enter': {
        item.click();
        break;
      }
      case 'Tab':
      case 'Escape': {
        this.close();
        break;
      }
      case 'ArrowLeft': {
        if (this.parentMenu) {
          this.close();
        }
        break;
      }
      case 'ArrowRight': {
        this.submenus.get(item)?.open();
        break;
      }
      case 'ArrowDown': {
        this.focusItem(this.items.indexOf(item) + 1);
        break;
      }
      case 'ArrowUp': {
        this.focusItem(this.items.indexOf(item) - 1);
        break;
      }
      case 'Home': {
        this.focusItem(0);
        break;
      }
      case 'End': {
        this.focusItem(this.items.length - 1);
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();
  }

  /**
   * Global click handler to close the menu when the user clicks outside.
   * Ignores clicks on the anchor or within the menu itself.
   */
  globalClickHandler(event: PointerEvent) {
    if (event.target instanceof Element && this.anchor && this._isOpened) {
      const menu = this.host.closest('.flexy-menu') || this.host;

      if (event.target.closest(`#${this.anchor.id}`)) return;
      if (event.target.closest(`#${menu.id}`)) return;

      this.close();
    }
  }
}
