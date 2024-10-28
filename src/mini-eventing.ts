import { EventEmitter } from './event-emitter';
import { EventListener } from './event-listener';

type EventsConfig = {
  [key: PropertyKey]: any;
};
type EventName<T extends EventsConfig> = keyof T extends PropertyKey ? keyof T : never;
type EventPayload<T extends EventsConfig, K extends EventName<T>> = T[K];
export class MiniEventing<Events extends EventsConfig> {
  private static EventEmitter = EventEmitter;

  private eventListeners = {} as {
    [K in EventName<Events>]?: EventListener<EventPayload<Events, K>>[];
  };

  private constructor() {}
  static create<T extends EventsConfig>() {
    return new MiniEventing<T>();
  }

  private emitted<T extends EventName<Events>>(eventName: T, payload: EventPayload<Events, T>) {
    const listeners = this.eventListeners[eventName] ?? [];

    listeners.forEach(listener => listener.listen(payload));
  }

  emitter<T extends EventName<Events>>(eventName: T) {
    return new MiniEventing.EventEmitter<EventPayload<Events, T>>(eventName, payload =>
      this.emitted(eventName, payload)
    );
  }

  listen<T extends EventName<Events>>(
    eventName: T,
    listener: EventListener<EventPayload<Events, T>>
  ) {
    const listeners = this.eventListeners[eventName] ?? [];
    this.eventListeners[eventName] = [...listeners, listener];
  }
}
