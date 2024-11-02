export type EventType = 'command' | 'event';
export interface EventDef<Type extends EventType = EventType, T = unknown> {
  type: Type;
  payload: T;
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
  [key: string]:
    | EventDef
    | {
        [key: string]:
          | EventDef
          | {
              [key: string]: EventDef;
            };
      };
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

export type Payload<T extends { payload: any }> = T['payload'];

export type StringKey<T> = keyof T & string;

export type EventsConfigInput<T extends EventsConfig> = WithoutPayload<CreateFlatEventsConfig<T>>;
