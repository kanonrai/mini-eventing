type EventType = 'command' | 'event';
interface EventDef {
  type: EventType;
  payload: any;
}
interface ObjectPath {
  path: string;
  def: any;
}

type GetEvents<T, Prefix extends string = ''> = {
  [K in keyof T]: K extends string
    ? T[K] extends EventsConfig
      ? GetEvents<T[K], `${Prefix}${K}.`>
      : {
          path: `${Prefix}${K}`;
          def: T[K];
        }
    : never;
}[keyof T];

type CreateEventsConfig<T extends ObjectPath> = {
  [K in T as K['path']]: K['def'] extends EventDef ? K['def'] : never;
};

export type EventsConfig = {
  [key: string]: EventDef | EventsConfig;
};
export type FlatEventsConfig = {
  [key: string]: EventDef;
};
export type CreateFlatEventsConfig<T extends EventsConfig> = CreateEventsConfig<GetEvents<T>>;

export type WithoutPayload<T extends FlatEventsConfig> = {
  [K in keyof T]: {
    type: T[K]['type'];
  };
};

export type StringKey<T> = keyof T & string;
