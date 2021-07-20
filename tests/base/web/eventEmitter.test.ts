import { EventEmitter } from 'src/base/web/eventEmitter';

describe('EventEmitter', () => {
	it('should dispatch events to handlers', () => {
		const mockFn = jest.fn();
		EventEmitter.subscribe('TESTING', mockFn);
		EventEmitter.dispatch('TESTING', 'hello world');
		expect(mockFn).toHaveBeenCalledWith('hello world');
	});

	it('should unsubscribe event handlers', () => {
		const mockFn = jest.fn();
		const eventId = EventEmitter.subscribe('TESTING', mockFn);
		EventEmitter.unsubscribe('TESTING', eventId);
		EventEmitter.dispatch('TESTING', 'hello world');
		expect(mockFn).not.toHaveBeenCalled();
	});
});
