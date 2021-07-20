import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';

export function useGraphqlMutation<TData = any, TVariables = any>(query: DocumentNode) {
	const [mutation] = useMutation<any, TVariables>(query);

	return async function (
		args?: TVariables
	): Promise<{ data?: TData[keyof TData]; error?: string }> {
		try {
			const response = await mutation({ variables: args });
			if (response.errors) throw response.errors;
			return { data: Object.values<TData[keyof TData]>(response.data)[0] };
		} catch (error) {
			return { error: error.message };
		}
	};
}
