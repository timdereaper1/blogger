import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { showErrorNotification } from 'src/base/web/notifiers';

export function useGraphqlMutation<TData = any, TVariables = any>(query: DocumentNode) {
	const [mutation] = useMutation<any, { data: TVariables }>(query);

	return async function (
		args?: TVariables
	): Promise<{ data?: TData[keyof TData]; error?: string }> {
		try {
			const response = await mutation({ variables: { data: args } });
			if (response.errors) throw response.errors;
			return { data: Object.values<TData[keyof TData]>(response.data)[0] };
		} catch (error) {
			showErrorNotification(error.message);
			return { error: error.message };
		}
	};
}
