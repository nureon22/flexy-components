import { FlexyBaseComponent } from '../base';

const initedCheckboxes = new Map<Element, FlexyCheckboxComponent>();

export class FlexyCheckboxComponent extends FlexyBaseComponent {
  readonly input = this.host.querySelector(
    'input[type="checkbox"]',
  ) as HTMLInputElement;

  constructor(host: HTMLElement) {
    super(host);

    initedCheckboxes.set(host, this);
    initedCheckboxes.set(this.input, this);

    this.addMarkIcon();
    this.updateAria();
    this.syncParentState();

    this.input.addEventListener('change', () => {
      this.updateAria();
      this.syncParentState();
      this.syncChildrenState();
    });
  }

  get checked() {
    return this.input.checked;
  }

  set checked(value) {
    if (this.input.checked !== value) {
      this.input.checked = value;
      this.updateAria();
    }
  }

  get indeterminate() {
    return this.input.indeterminate;
  }

  set indeterminate(value) {
    if (this.input.indeterminate !== value) {
      this.input.indeterminate = value;
      this.updateAria();
    }
  }

  syncParentState() {
    const parent = this.getParent();

    if (parent) {
      const children = parent.getChildren();
      const isAllChecked = children.every((c) => c.checked);
      const isSomeChecked = !isAllChecked && children.some((c) => c.checked);

      parent.checked = isAllChecked;
      parent.indeterminate = isSomeChecked;
    }
  }

  syncChildrenState() {
    this.getChildren().forEach((child) => {
      child.checked = this.input.checked;
      child.indeterminate = false;
    });
  }

  getParent(): FlexyCheckboxComponent | null {
    if (!this.input.id) return null;

    const selector = `input[aria-controls~="${this.input.id}"]`;
    const parentInput = this.host.ownerDocument.querySelector(selector);
    return parentInput ? initedCheckboxes.get(parentInput) || null : null;
  }

  getChildren(): FlexyCheckboxComponent[] {
    return (this.input.ariaControlsElements || [])
      .map((child) => initedCheckboxes.get(child))
      .filter((child) => !!child);
  }

  getSiblings(): FlexyCheckboxComponent[] {
    return this.getParent()?.getChildren() || [];
  }

  /** update aria attributes to match current checkbox state */
  updateAria() {
    this.input.ariaChecked = this.indeterminate ? 'mixed' : null;
  }

  /** add svg mark icons, do not call this function more than once */
  addMarkIcon() {
    const box = this.host.querySelector('.flexy-checkbox__box');

    if (box) {
      box.innerHTML += [
        '<svg viewBox="0 0 100 100" aria-hidden="true" class="flexy-checkbox__mark-icon">',
        '<path class="flexy-checkbox__check-mark" d="M15,55 40,85 85,20"></path>',
        '<path class="flexy-checkbox__indeterminate-mark" d="M15,50 50,50 85,50"></path>',
        '</svg>',
      ].join('');
    }
  }
}
