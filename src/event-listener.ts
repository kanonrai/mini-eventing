export interface EventListener<PayloadType> {
  readonly listen: (payload: PayloadType) => void;
}
