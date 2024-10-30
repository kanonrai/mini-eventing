import { EventEmitter } from './event-emitter';
import { EventListener } from './event-listener';
import {
  EventsConfig,
  CreateFlatEventsConfig,
  FlatEventsConfig,
  WithoutPayload,
  StringKey,
} from './types';

export class MiniEventing<
  E extends EventsConfig,
  Events extends FlatEventsConfig = CreateFlatEventsConfig<E>,
> {
  private static EventEmitter = EventEmitter;

  private eventListeners: {
    [K in StringKey<Events>]?: EventListener<Events[K]['payload']>[];
  } = {};
  private eventEmitters: {
    [K in StringKey<Events>]?: EventEmitter<Events[K]['payload']>;
  } = {};

  private constructor(private readonly config: WithoutPayload<Events>) {}
  static create<T extends EventsConfig>(config: WithoutPayload<CreateFlatEventsConfig<T>>) {
    return new MiniEventing<T>(config);
  }

  private emitted<T extends StringKey<Events>>(eventName: T, payload: Events[T]['payload']) {
    const listeners = this.eventListeners[eventName] ?? [];

    listeners.forEach(listener => listener.listen(payload));
  }

  emitter<T extends StringKey<Events>>(eventName: T) {
    if (this.eventEmitters[eventName]) throw new Error(`Emitter for ${eventName} already exists`);

    const emitter = new MiniEventing.EventEmitter<Events[T]['payload']>(eventName, payload =>
      this.emitted(eventName, payload)
    );

    this.eventEmitters[eventName] = emitter;
    return emitter;
  }

  listen<T extends StringKey<Events>>(eventName: T, listener: EventListener<Events[T]['payload']>) {
    const { type } = this.config[eventName];
    const listeners = this.eventListeners[eventName] ?? [];

    if (type === 'command' && listeners.length > 0) {
      throw new Error(`Only one listener allowed for command ${eventName}`);
    }

    this.eventListeners[eventName] = [...listeners, listener];
  }
}
