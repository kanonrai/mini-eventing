import { EventListener } from './event-listener';
import { EventEmitter } from './event-emitter';
import { FlatEventsConfig, StringKey, Payload, WithoutPayload, EventType, EventDef } from './types';

type EventsOfType<Events extends FlatEventsConfig, Type extends EventType> = {
  [K in StringKey<Events>]: Events[K] extends EventDef<Type> ? Events[K] : never;
};

export class EventRegistry<Events extends FlatEventsConfig> {
  private eventListeners: {
    [K in keyof Events]?: Events[K]['type'] extends 'command'
      ? EventListener<Events[K]['payload']>
      : EventListener<Events[K]['payload']>[];
  } = {};

  private eventEmitters: {
    [K in keyof Events]?: Events[K]['type'] extends 'event'
      ? EventEmitter<Payload<Events[K]>>
      : EventEmitter<Payload<Events[K]>>[];
  } = {};

  private constructor(private readonly config: WithoutPayload<Events>) {}

  static create<T extends FlatEventsConfig>(config: WithoutPayload<T>) {
    return new EventRegistry<T>(config);
  }

  private addCommandListener<T extends keyof EventsOfType<Events, 'command'>>(
    eventName: T,
    listener: EventListener<Payload<EventsOfType<Events, 'command'>[T]>>
  ) {
    const existingListener = this.eventListeners[eventName];

    if (existingListener) {
      throw new Error(`Only one listener allowed for command ${eventName}`);
    }

    this.eventListeners[eventName] = listener as any;
  }

  private addEventListener<T extends StringKey<Events>>(
    eventName: T,
    listener: EventListener<Payload<Events[T]>>
  ) {
    const listeners: EventListener<Payload<Events[T]>>[] =
      (this.eventListeners[eventName] as EventListener<Payload<Events[T]>>[]) ?? [];

    (this.eventListeners[eventName] as EventListener<Payload<Events[T]>>[] | undefined) = [
      ...listeners,
      listener,
    ];
  }

  private listenerAdditionFuncMap = {
    event: this.addEventListener,
    command: this.addCommandListener,
  };

  addListener<T extends StringKey<Events>>(
    eventName: T,
    eventType: Events[T]['type'],
    listener: EventListener<Payload<Events[T]>>
  ) {
    this.listenerAdditionFuncMap[eventType].call(this, eventName, listener);
  }

  private addCommandEmitter<T extends StringKey<Events>>(
    eventName: T,
    emitter: EventEmitter<Payload<Events[T]>>
  ) {
    const emitters: EventEmitter<Payload<Events[T]>>[] =
      (this.eventEmitters[eventName] as EventEmitter<Payload<Events[T]>>[]) ?? [];

    this.eventEmitters[eventName] = [...emitters, emitter] as any;
  }

  private addEventEmitter<T extends StringKey<Events>>(
    eventName: T,
    emitter: EventEmitter<Payload<Events[T]>>
  ) {
    if (this.eventEmitters[eventName]) {
      throw new Error(`Only one emitter allowed for event ${eventName}`);
    }

    this.eventEmitters[eventName] = emitter as any;
  }

  private emitterAdditionFuncMap = {
    event: this.addEventEmitter,
    command: this.addCommandEmitter,
  };

  addEmitter<T extends StringKey<Events>>(
    eventName: T,
    eventType: Events[T]['type'],
    emitter: EventEmitter<Payload<Events[T]>>
  ) {
    this.emitterAdditionFuncMap[eventType].call(this, eventName, emitter);
  }

  emit<T extends StringKey<Events>>(eventName: T, payload: Payload<Events[T]>) {
    const emitterOrEmitters = this.eventEmitters[eventName];
    if (!emitterOrEmitters) return;

    if (Array.isArray(emitterOrEmitters)) {
      emitterOrEmitters.forEach(emitter => emitter.emit(payload));
    } else {
      emitterOrEmitters.emit(payload);
    }
  }
}
