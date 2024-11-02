import { EventsConfig } from './types';

type Expect<T extends true> = T;
type ExpectNot<T extends false> = T;
type ExtendsType<T, U> = T extends U ? true : false;

describe('Types', () => {
  describe('EventsConfig', () => {
    it('allows nesting', () => {
      type test = Expect<
        ExtendsType<
          {
            foo: {
              inner: {
                inner2: {
                  type: 'command';
                  payload: number;
                };
              };
            };
          },
          EventsConfig
        >
      >;
    });
    it('allows flat structure', () => {
      type test = Expect<
        ExtendsType<
          {
            foo: {
              type: 'event';
              payload: string;
            };
            foo2: {
              type: 'command';
              payload: number;
            };
          },
          EventsConfig
        >
      >;
    });
    it('allows mixed structure', () => {
      type test = Expect<
        ExtendsType<
          {
            foo: {
              type: 'event';
              payload: string;
            };
            foo2: {
              inner: {
                type: 'command';
                payload: number;
              };
            };
          },
          EventsConfig
        >
      >;
    });
    it('does not allow more than three layers of nesting', () => {
      type test = ExpectNot<
        ExtendsType<
          {
            foo: {
              inner: {
                inner2: {
                  inner3: {
                    type: 'event';
                    payload: string;
                  };
                };
              };
            };
          },
          EventsConfig
        >
      >;
    });
  });
});
