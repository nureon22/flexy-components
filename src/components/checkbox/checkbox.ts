import { FlexyBaseComponent } from '../base';

const initedCheckboxes = new Map<Element, FlexyCheckboxComponent>();

export class FlexyCheckboxComponent extends FlexyBaseComponent {
  readonly input = this.host.querySelector(
    'input[type="checkbox"]',
  ) as HTMLInputElement;

  private _markIconPath: SVGPathElement | undefined;

  constructor(host: HTMLElement) {
    super(host);

    initedCheckboxes.set(host, this);
    initedCheckboxes.set(this.input, this);

    this.addMarkIcon();
    this.update();
    this.syncParentState();

    this.input.addEventListener('change', () => {
      this.update();
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
      this.update();
    }
  }

  get indeterminate() {
    return this.input.indeterminate;
  }

  set indeterminate(value) {
    if (this.input.indeterminate !== value) {
      this.input.indeterminate = value;
      this.update();
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

  /** same as calling both updateAria() and updateMark() methods */
  update() {
    this.updateAria();
    this.updateMark();
  }

  /** update aria attributes to match current checkbox state */
  updateAria() {
    this.input.ariaChecked = this.indeterminate ? 'mixed' : null;
  }

  /** update mark icon to match current checkbox state */
  updateMark() {
    if (!this._markIconPath) return;

    const mark = this.indeterminate ? 'indeterminate' : 'checked';
    this._markIconPath.setAttribute('d', FlexyCheckboxComponent.marks[mark]);
  }

  /** add svg mark icon, do not call this function more than once */
  addMarkIcon() {
    const box = this.host.querySelector('.flexy-checkbox__box');

    if (box) {
      box.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path></path></svg>`;
      this._markIconPath = box.querySelector('path') || undefined;
    }
  }

  protected static readonly marks = {
    checked: 'M15,55 40,85 85,20',
    indeterminate: 'M15,50 50,50 85,50',
  };
}
