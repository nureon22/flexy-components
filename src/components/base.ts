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

  static readonly privateKey = Math.random().toString().slice(2);

  static attach<T extends FlexyBaseComponent>(host: HTMLElement): T {
    const key = `__${this.privateKey}__${this.name}` as keyof HTMLElement;
    return ((host as any)[key] ||= new this(host)) as T;
  }
}
