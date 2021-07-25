import { SuccessMutationResponse } from 'src/base/common/types';
import { useGraphqlMutation } from 'src/base/web/hooks/useGraphqlMutation';
import { ResetPasswordCredentials } from 'src/modules/authentication/common/types';
import { RESET_USER_PASSWORD_MUTATION } from 'src/modules/authentication/web/schemas';
import { ResetPasswordCredentialsForm } from 'src/modules/authentication/web/types';

export interface ResetPasswordMutationResponse {
	resetUserPassword: SuccessMutationResponse;
}

export function useResetPassword() {
	const mutation = useGraphqlMutation<ResetPasswordMutationResponse, ResetPasswordCredentials>(
		RESET_USER_PASSWORD_MUTATION
	);
	return function (args: ResetPasswordCredentialsForm) {
		return mutation({ password: args.password });
	};
}
