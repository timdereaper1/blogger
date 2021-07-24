import { SuccessMutationResponse } from 'src/base/common/types';
import { useGraphqlMutation } from 'src/base/web/hooks/useGraphqlMutation';
import { UserPasswordResetCredentials } from 'src/modules/authentication/common/types';
import { VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION } from 'src/modules/authentication/web/schemas';

export interface VerifyAndSendPasswordResetEmailResponse {
	verifyAndSendPasswordResetEmail: SuccessMutationResponse;
}

export function useEmailPasswordReset() {
	const mutation = useGraphqlMutation<
		VerifyAndSendPasswordResetEmailResponse,
		UserPasswordResetCredentials
	>(VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION);
	return function (credentials: UserPasswordResetCredentials) {
		return mutation(credentials);
	};
}
