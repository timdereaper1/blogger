import { DISMISS_NOTIFICATION, SHOW_NOTIFICATION } from 'src/base/web/constants';
import { EventEmitter } from 'src/base/web/eventEmitter';
import {
	dismissNotification,
	showErrorNotification,
	showSuccessNotification,
} from 'src/base/web/notifiers';

jest.mock('src/base/web/eventEmitter');
const mockedEventEmitter = EventEmitter as jest.Mocked<typeof EventEmitter>;

describe('showErrorNotification', () => {
	it('should call dispatch with error notification data', () => {
		showErrorNotification('Show new error');
		expect(mockedEventEmitter.dispatch).toHaveBeenCalledWith(SHOW_NOTIFICATION, {
			message: 'Show new error',
			status: 'error',
		});
	});
});

describe('showSuccessNotification', () => {
	it('should call dispatch with success notification data', () => {
		showSuccessNotification('Show success message');
		expect(mockedEventEmitter.dispatch).toHaveBeenCalledWith(SHOW_NOTIFICATION, {
			message: 'Show success message',
			status: 'success',
		});
	});
});

describe('dismissNotification', () => {
	it('should call dispatch with dismiss notification', () => {
		dismissNotification();
		expect(mockedEventEmitter.dispatch).toHaveBeenCalledWith(DISMISS_NOTIFICATION);
	});
});
