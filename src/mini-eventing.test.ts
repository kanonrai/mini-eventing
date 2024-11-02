import { MiniEventing } from './mini-eventing';

type testConfig = {
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
};

describe('MiniEventing', () => {
  it('should emit and listen to events', () => {
    const eventing = MiniEventing.create<testConfig>({
      foo: { type: 'event' },
      'foo2.inner': { type: 'command' },
    });
    const emitter = eventing.emitter('foo');
    const emitter2 = eventing.emitter('foo2.inner');

    const listener = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();

    eventing.listener('foo', listener).listen();
    eventing.listener('foo', listener2).listen();
    eventing.listener('foo2.inner', listener3).listen();

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

  describe('listener', () => {
    it('should remove listener', () => {
      const eventing = MiniEventing.create<testConfig>({
        foo: { type: 'event' },
        'foo2.inner': { type: 'command' },
      });
      const emitter = eventing.emitter('foo');
      const listener = jest.fn();
      const listener2 = jest.fn();

      const listener1 = eventing.listener('foo', listener);
      const listener2Instance = eventing.listener('foo', listener2);

      listener1.listen();
      listener2Instance.listen();

      emitter.emit('bar');
      expect(listener).toHaveBeenCalledWith('bar');
      expect(listener2).toHaveBeenCalledWith('bar');

      listener1.deafen();
      emitter.emit('baz');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
    });

    it('should listen once', () => {
      const eventing = MiniEventing.create<testConfig>({
        foo: { type: 'event' },
        'foo2.inner': { type: 'command' },
      });
      const emitter = eventing.emitter('foo');
      const listener = jest.fn();

      const listener1 = eventing.listener('foo', listener);
      listener1.listenOnce();

      emitter.emit('bar');
      expect(listener).toHaveBeenCalledWith('bar');

      emitter.emit('baz');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('emitter', () => {
    it('should only allow one emitter per event', () => {
      const eventing = MiniEventing.create<testConfig>({
        foo: { type: 'event' },
        'foo2.inner': { type: 'command' },
      });
      const emitter = eventing.emitter('foo');
      expect(() => eventing.emitter('foo')).toThrow('Only one emitter allowed for event foo');
    });

    it('should emit events', () => {
      const eventing = MiniEventing.create<testConfig>({
        foo: { type: 'event' },
        'foo2.inner': { type: 'command' },
      });
      const emitter = eventing.emitter('foo');
      const listener = jest.fn();

      eventing.listener('foo', listener).listen();

      emitter.emit('bar');
      expect(listener).toHaveBeenCalledWith('bar');
    });

    it('should emit commands', () => {
      const eventing = MiniEventing.create<testConfig>({
        foo: { type: 'event' },
        'foo2.inner': { type: 'command' },
      });
      const emitter = eventing.emitter('foo2.inner');
      const listener = jest.fn();

      eventing.listener('foo2.inner', listener).listen();

      emitter.emit(1);
      expect(listener).toHaveBeenCalledWith(1);
    });
  });
});
