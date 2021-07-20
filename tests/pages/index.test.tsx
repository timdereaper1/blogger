/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Index from 'src/pages/index';

it('should render correctly', () => {
	render(<Index />);
	expect(screen.getByTestId(/text/)).toBeInTheDocument();
});
