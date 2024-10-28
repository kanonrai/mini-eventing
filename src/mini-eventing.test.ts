import { MiniEventing } from './mini-eventing';

describe('MiniEventing', () => {
  it('should emit and listen to events', () => {
    const eventing = MiniEventing.create<{
      foo: string;
      foo2: number;
    }>();
    const emitter = eventing.emitter('foo');
    const emitter2 = eventing.emitter('foo');
    const emitter3 = eventing.emitter('foo2');

    const listener = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();

    eventing.listen('foo', { listen: listener });
    eventing.listen('foo', { listen: listener2 });
    eventing.listen('foo2', { listen: listener3 });

    emitter.emit('bar');
    emitter2.emit('bar');
    emitter3.emit(1);

    expect(listener).toHaveBeenCalledWith('bar');
    expect(listener2).toHaveBeenCalledWith('bar');
    expect(listener3).toHaveBeenCalledWith(1);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(2);
    expect(listener3).toHaveBeenCalledTimes(1);
  });
});
