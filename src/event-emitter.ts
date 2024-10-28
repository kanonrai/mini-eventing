export class EventEmitter<PayloadType> {
  constructor(
    public readonly eventName: PropertyKey,
    private readonly emitted: (payload: PayloadType) => void
  ) {}

  static create<T>(name: PropertyKey, emitted: (payload: T) => void) {
    return new EventEmitter<T>(name, emitted);
  }

  emit(payload: PayloadType) {
    this.emitted(payload);
  }
}
