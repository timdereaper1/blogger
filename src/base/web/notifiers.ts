import { DISMISS_NOTIFICATION, SHOW_NOTIFICATION } from './constants';
import { EventEmitter } from './eventEmitter';

export interface NotificationMessage {
	message: string;
	status: 'error' | 'success';
}

export function showErrorNotification(message: string) {
	const notification: NotificationMessage = {
		message,
		status: 'error',
	};
	EventEmitter.dispatch(SHOW_NOTIFICATION, notification);
}

export function showSuccessNotification(message: string) {
	const notification: NotificationMessage = {
		message,
		status: 'success',
	};
	EventEmitter.dispatch(SHOW_NOTIFICATION, notification);
}

export function dismissNotification() {
	EventEmitter.dispatch(DISMISS_NOTIFICATION);
}
