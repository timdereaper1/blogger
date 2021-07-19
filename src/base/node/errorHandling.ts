import { ApolloError } from 'apollo-server-micro';
import { processErrorToErrorLogs } from './logging';

export function processRequestError(error: any, defaultMessage?: string | ApolloError) {
	if (error.isCustom && defaultMessage) throwApolloErrorOrErrorMessage(defaultMessage);
	if (error.isCustom) throw error;
	processErrorToErrorLogs(error);
	throw new Error('Internal server error');
}

export function throwApolloErrorOrErrorMessage(error: string | ApolloError) {
	if (typeof error === 'string') throw new Error(error);
	throw error;
}
