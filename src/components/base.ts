export class FlexyBaseComponent {
  private destroyTasks = new Set<() => void>();

  constructor(readonly host: HTMLElement) {}

  addDestroyTasks(...tasks: (() => void)[]) {
    for (const task of tasks) this.destroyTasks.add(task);
  }

  destroy() {
    for (const task of this.destroyTasks) task();
    this.destroyTasks.clear();
  }

  static attach<T extends FlexyBaseComponent>(host: HTMLElement): T {
    if (!this.instances.has(host)) this.instances.set(host, new this(host));
    return this.instances.get(host) as T;
  }

  private static readonly instances = new Map<HTMLElement, unknown>();
}
