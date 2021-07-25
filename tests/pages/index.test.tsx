/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Index from 'src/pages/index';

describe('Landing Page', () => {
	it('should render correctly', () => {
		render(<Index />);
		expect(screen.getByTestId(/text/)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
			'href',
			'/auth/signin'
		);
		expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
			'href',
			'/auth/signup'
		);
	});
});
