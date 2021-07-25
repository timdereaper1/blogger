import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';
import { getAuthenticationTokenInStorage } from '../storage';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient() {
	const httpLink = createHttpLink({
		uri: '/api/graphql',
		credentials: 'same-origin',
	});

	const authLink = setContext((_, { headers }) => {
		const token = getAuthenticationTokenInStorage();
		const authorization = token ? `Bearer ${token}` : '';
		const updatedHeaders = Object.assign({}, headers, { authorization });
		return { headers: updatedHeaders };
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
	});
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
	const _apolloClient = apolloClient ?? createApolloClient();

	// If your page has Next.js data fetching methods that use Apollo Client, the initial state
	// gets hydrated here
	if (initialState) _apolloClient.cache.restore(initialState);

	// For SSG and SSR always create a new Apollo Client
	if (typeof window === 'undefined') return _apolloClient;
	// Create the Apollo Client once in the client
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	const store = useMemo(() => initializeApollo(initialState), [initialState]);
	return store;
}
