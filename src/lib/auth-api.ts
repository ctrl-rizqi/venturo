const API_BASE_URL = "https://api.escuelajs.co/api/v1";
const ACCESS_TOKEN_STORAGE_KEY = "auth.access_token";
const REFRESH_TOKEN_STORAGE_KEY = "auth.refresh_token";

export type LoginPayload = {
	email: string;
	password: string;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
};

export type AuthProfile = {
	id: number;
	email: string;
	password: string;
	name: string;
	role: string;
	avatar: string;
};

type ApiTokensResponse = {
	access_token: string;
	refresh_token: string;
};

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

function toAuthTokens(tokens: ApiTokensResponse): AuthTokens {
	return {
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token,
	};
}

function safeStorage(): Storage | null {
	if (typeof window === "undefined") {
		return null;
	}

	return window.localStorage;
}

async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const body = await response.json();

		if (typeof body?.message === "string") {
			return body.message;
		}

		if (Array.isArray(body?.message) && typeof body.message[0] === "string") {
			return body.message[0];
		}
	} catch (error) {
		if (error instanceof Error) {
			return error.message;
		}
	}

	return `Request failed with status ${response.status}`;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const message = await parseErrorMessage(response);
		throw new ApiError(response.status, message);
	}

	return (await response.json()) as T;
}

export function getStoredTokens(): AuthTokens | null {
	const storage = safeStorage();

	if (!storage) {
		return null;
	}

	const accessToken = storage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim() ?? "";
	const refreshToken = storage.getItem(REFRESH_TOKEN_STORAGE_KEY)?.trim() ?? "";

	if (!accessToken && !refreshToken) {
		return null;
	}

	return {
		accessToken,
		refreshToken,
	};
}

export function hasStoredTokens(): boolean {
	const tokens = getStoredTokens();

	if (!tokens) {
		return false;
	}

	return Boolean(tokens.accessToken || tokens.refreshToken);
}

export function saveTokens(tokens: AuthTokens): void {
	const storage = safeStorage();

	if (!storage) {
		return;
	}

	storage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
	storage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
	const storage = safeStorage();

	if (!storage) {
		return;
	}

	storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await parseJsonResponse<ApiTokensResponse>(response);
	const tokens = toAuthTokens(data);

	saveTokens(tokens);

	return tokens;
}

export async function refreshAccessToken(
	refreshToken: string,
): Promise<AuthTokens> {
	const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken }),
	});

	const data = await parseJsonResponse<ApiTokensResponse>(response);
	const tokens = toAuthTokens(data);

	saveTokens(tokens);

	return tokens;
}

export async function getProfileByToken(
	accessToken: string,
): Promise<AuthProfile> {
	const response = await fetch(`${API_BASE_URL}/auth/profile`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return parseJsonResponse<AuthProfile>(response);
}

export async function getProfileWithRefresh(): Promise<AuthProfile> {
	const tokens = getStoredTokens();

	if (!tokens) {
		throw new ApiError(401, "Missing authentication tokens");
	}

	if (!tokens.accessToken && !tokens.refreshToken) {
		throw new ApiError(401, "Missing authentication tokens");
	}

	if (!tokens.accessToken && tokens.refreshToken) {
		try {
			const refreshedTokens = await refreshAccessToken(tokens.refreshToken);
			return getProfileByToken(refreshedTokens.accessToken);
		} catch (error) {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				clearTokens();
			}

			throw error;
		}
	}

	try {
		return await getProfileByToken(tokens.accessToken);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}

		if (error.status !== 401 || !tokens.refreshToken) {
			if (error.status === 401 || error.status === 403) {
				clearTokens();
			}

			throw error;
		}

		try {
			const refreshedTokens = await refreshAccessToken(tokens.refreshToken);

			return getProfileByToken(refreshedTokens.accessToken);
		} catch (refreshError) {
			if (
				refreshError instanceof ApiError &&
				(refreshError.status === 401 || refreshError.status === 403)
			) {
				clearTokens();
			}

			throw refreshError;
		}
	}
}
