import { useEffect, useState } from 'react';
import { DISMISS_NOTIFICATION, SHOW_NOTIFICATION } from 'src/base/web/constants';
import { EventEmitter } from 'src/base/web/eventEmitter';
import { NotificationMessage } from 'src/base/web/notifiers';

const NOTIFICATION_DELAY_TIME = 10000;

export default function Notification() {
	const [notification, setNotification] = useState<NotificationMessage | null>(null);
	const isNotificationShown = Boolean(notification);

	useEffect(() => {
		const eventId = EventEmitter.subscribe(SHOW_NOTIFICATION, setNotification);
		return () => EventEmitter.unsubscribe(SHOW_NOTIFICATION, eventId);
	}, []);

	useEffect(() => {
		if (!isNotificationShown) return;
		const timeout = setTimeout(() => setNotification(null), NOTIFICATION_DELAY_TIME);
		return () => clearTimeout(timeout);
	}, [isNotificationShown]);

	useEffect(() => {
		const handler = () => setNotification(null);
		const eventId = EventEmitter.subscribe(DISMISS_NOTIFICATION, handler);
		return () => EventEmitter.unsubscribe(DISMISS_NOTIFICATION, eventId);
	}, []);

	return !notification ? null : (
		<div role="alert" data-testid="notification">
			<p data-testid="notification-content">{notification.message}</p>
			<button type="button" onClick={() => setNotification(null)}>
				Close
			</button>
		</div>
	);
}
