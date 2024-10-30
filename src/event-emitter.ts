export class EventEmitter<PayloadType> {
  constructor(
    public readonly eventName: string,
    private readonly emitted: (payload: PayloadType) => void
  ) {}

  static create<T>(name: string, emitted: (payload: T) => void) {
    return new EventEmitter<T>(name, emitted);
  }

  emit(payload: PayloadType) {
    this.emitted(payload);
  }
}
