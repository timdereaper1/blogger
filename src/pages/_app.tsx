import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { useApollo } from 'src/base/web/apolloClient';

export default function App({ Component, pageProps }: AppProps) {
	const apolloClient = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={apolloClient}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}
