import {apiFetch} from "./api.ts";

interface CreateTokensRequest {
    username: string;
    password: string;
}

interface CreateTokensResponse {
    accessToken: string;
}

async function createTokens(request: CreateTokensRequest): Promise<CreateTokensResponse> {
    return apiFetch<CreateTokensResponse>(`/auth/create-tokens`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
    });
}

export {createTokens};
