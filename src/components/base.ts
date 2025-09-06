export class FlexyBaseComponent {
  private destroyTasks = new Set<() => void>();

  constructor(readonly host: HTMLElement) {}

  addDestroyTasks(task: () => void) {
    this.destroyTasks.add(task);
  }

  destroy() {
    this.destroyTasks.forEach((task) => task());
    this.destroyTasks.clear();
  }
}
