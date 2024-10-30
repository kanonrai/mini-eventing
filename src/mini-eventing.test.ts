import { MiniEventing } from './mini-eventing';

describe('MiniEventing', () => {
  it('should emit and listen to events', () => {
    const eventing = MiniEventing.create<{
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
    }>({
      foo: { type: 'event' },
      'foo2.inner': { type: 'command' },
    });
    const emitter = eventing.emitter('foo');
    const emitter2 = eventing.emitter('foo2.inner');

    const listener = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();

    eventing.listen('foo', { listen: listener });
    eventing.listen('foo', { listen: listener2 });
    eventing.listen('foo2.inner', { listen: listener3 });

    emitter.emit('bar');
    emitter.emit('baz');
    emitter2.emit(1);

    expect(listener).toHaveBeenCalledWith('bar');
    expect(listener2).toHaveBeenCalledWith('bar');
    expect(listener3).toHaveBeenCalledWith(1);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(2);
    expect(listener3).toHaveBeenCalledTimes(1);
  });
});
