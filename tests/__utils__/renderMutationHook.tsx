import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';

interface MutationResponse<T> {
	data?: T;
	error?: string;
}

type MutationHook<T, P> = () => (args: P) => Promise<MutationResponse<T>>;

function useTestMutation<T, P>(hook: MutationHook<T, P>) {
	const [response, setResponse] = useState<MutationResponse<T> | null>(null);
	const mutation = hook();
	async function handleChange(args: P) {
		const result = await mutation(args);
		setResponse(result);
	}
	return { handleChange, response };
}

export function renderMutationHook<Response = any, Data = any, Args = any>(
	hook: MutationHook<Data, Args>,
	mocks: MockedResponse<Response>[] = []
) {
	return renderHook(() => useTestMutation(hook), {
		wrapper: ({ children }) => (
			<MockedProvider addTypename={false} mocks={mocks}>
				{children}
			</MockedProvider>
		),
	});
}
