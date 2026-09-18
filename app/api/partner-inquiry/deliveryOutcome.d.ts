export declare const PUBLIC_FALLBACK_EMAIL: string;

export declare function classifyMailFailure(error: unknown): {
	kind: 'config' | 'transient';
	retryable: boolean;
};

export declare function undeliveredRecord(lead: {
	destination?: string;
	email?: string;
	subject?: string;
	message?: string;
	reason?: string;
}): string;

export declare function failureResponse(kind: 'config' | 'transient'): {
	error: string;
	status: number;
};
