/**
 * @jest-environment jsdom
 */
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dismissNotification, showSuccessNotification } from 'src/base/web/notifiers';
import Notification from 'src/base/web/ui/Notification';

describe('Notification', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should render correctly', async () => {
		render(<Notification />);
		await waitFor(() => {
			expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
		});
	});

	it('should show message when event is dispatched', async () => {
		render(<Notification />);
		act(() => showSuccessNotification('Testing notification'));
		await screen.findByTestId('notification');
		expect(screen.getByTestId('notification-content')).toHaveTextContent(
			'Testing notification'
		);
	});

	it('should close notification when close button is clicked', async () => {
		render(<Notification />);
		act(() => showSuccessNotification('Testing notification'));
		await screen.findByTestId('notification');
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
		userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await waitFor(() => {
			expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
		});
	});

	it('should close notification after 10s', async () => {
		render(<Notification />);
		act(() => showSuccessNotification('Testing notification'));
		await screen.findByTestId('notification');
		act(() => jest.runAllTimers() as any);
		await waitFor(() => {
			expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
		});
	});

	it('should close notification by event', async () => {
		render(<Notification />);
		act(() => showSuccessNotification('Testing notification'));
		await screen.findByTestId('notification');
		act(() => dismissNotification());
		await waitFor(() => {
			expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
		});
	});
});
