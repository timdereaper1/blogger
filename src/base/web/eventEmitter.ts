export type EventHandler = (args?: unknown) => void;

function Events() {
	const events: Record<string, Array<{ eventId: string; handler: EventHandler }>> = {};

	function subscribe(eventName: string, handler: EventHandler): string {
		const eventId = Math.random().toString();
		events[eventName] = (events[eventName] ?? []).concat([{ eventId, handler }]);
		return eventId;
	}

	function dispatch(eventName: string, data?: unknown) {
		(events[eventName] ?? []).forEach(({ handler }) => handler(data));
	}

	function unsubscribe(eventName: string, id: string) {
		events[eventName] = (events[eventName] ?? []).filter(({ eventId }) => eventId !== id);
	}

	return Object.freeze({
		subscribe,
		dispatch,
		unsubscribe,
	});
}

export const EventEmitter = Events();
