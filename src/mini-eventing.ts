import { EventEmitter } from './event-emitter';
import { EventListener, EventListenerFn } from './event-listener';
import { EventRegistry } from './event-orchestrator';
import type {
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
  private registry: EventRegistry<Events>;

  private handlers: { [K in StringKey<Events>]?: EventListenerFn<Events[K]['payload']>[] } = {};

  private constructor(private readonly config: WithoutPayload<Events>) {
    this.registry = EventRegistry.create(config);
  }
  static create<T extends EventsConfig>(config: WithoutPayload<CreateFlatEventsConfig<T>>) {
    return new MiniEventing<T>(config);
  }

  emitter<T extends StringKey<Events>>(eventName: T) {
    const type = this.config[eventName].type;
    const emitter = EventEmitter.create(eventName, payload => this.emitted(eventName, payload));
    this.registry.addEmitter(eventName, type, emitter);
    return emitter;
  }

  listener<T extends StringKey<Events>>(
    eventName: T,
    handler: EventListenerFn<Events[T]['payload']>
  ) {
    const { type } = this.config[eventName];

    const listener = EventListener.create(
      handler,
      fn => this.listenerFulfilled(eventName, fn),
      fn => this.registerHandle(eventName, fn)
    );

    this.registry.addListener(eventName, type, listener);

    return listener;
  }

  private listenerFulfilled<T extends StringKey<Events>>(
    eventName: T,
    handleFn: EventListenerFn<unknown>
  ) {
    const handlers = this.handlers[eventName];
    handlers?.splice(handlers?.indexOf(handleFn), 1);
  }

  private registerHandle<T extends StringKey<Events>>(
    eventName: T,
    handleFn: EventListenerFn<unknown>
  ) {
    this.handlers[eventName] = [...(this.handlers[eventName] ?? []), handleFn];
  }

  private emitted<T extends StringKey<Events>>(eventName: T, payload: Events[T]['payload']) {
    const handlers = this.handlers[eventName] ?? [];
    handlers.forEach(handler => handler(payload));
  }
}
