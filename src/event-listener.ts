export type EventListenerFn<PayloadType> = (payload: PayloadType) => void;

type HandleFn<PayloadType> = (handleFn: EventListenerFn<PayloadType>) => void;

export class EventListener<PayloadType> {
  private once: boolean = false;
  private active: boolean = false;

  private constructor(
    private readonly handler: EventListenerFn<PayloadType>,
    private readonly fulfilled: (handler: EventListenerFn<PayloadType>) => void,
    registerHandle: HandleFn<PayloadType>
  ) {
    registerHandle(payload => this.handle(payload));
  }

  static create<T>(
    handler: EventListenerFn<T>,
    fulfilled: (handler: EventListenerFn<T>) => void,
    registerHandle: HandleFn<T>
  ) {
    return new EventListener<T>(handler, fulfilled, registerHandle);
  }

  private handle(payload: PayloadType) {
    if (!this.active) {
      return;
    }
    this.handler(payload);
    if (this.once) {
      this.destroy();
    }
  }

  listen() {
    this.active = true;
  }

  listenOnce() {
    this.active = true;
    this.once = true;
  }

  deafen() {
    this.active = false;
    this.once = true;
  }

  destroy() {
    this.deafen();
    this.fulfilled(payload => this.handle(payload));
  }
}
