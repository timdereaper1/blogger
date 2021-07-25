/**
 * @jest-environment jsdom
 */

import { act } from '@testing-library/react-hooks';
import {
	ResetPasswordMutationResponse,
	useResetPassword,
} from 'src/modules/authentication/web/hooks/useResetPassword';
import { RESET_USER_PASSWORD_MUTATION } from 'src/modules/authentication/web/schemas';
import { renderMutationHook } from 'tests/reactTestUtils';

describe('useResetPassword', () => {
	it('should return the success message when password is successfully reset', async () => {
		const { result } = renderMutationHook<ResetPasswordMutationResponse>(useResetPassword, [
			{
				request: {
					query: RESET_USER_PASSWORD_MUTATION,
					variables: { data: { password: '1234567' } },
				},
				result: {
					data: {
						resetUserPassword: {
							message: 'Password is reset successfully',
							success: true,
						},
					},
				},
			},
		]);
		const credentials = { password: '1234567', confirmPassword: '1234567' };
		await act(() => result.current.handleChange(credentials));
		expect(result.current.response.data).toBeDefined();
		expect(result.current.response).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "message": "Password is reset successfully",
    "success": true,
  },
}
`);
	});
});
