/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import Login from 'src/pages/signin';

describe('signin', () => {
	it.skip('should login user with correct credentials', () => {
		render(<Login />);
	});
});
