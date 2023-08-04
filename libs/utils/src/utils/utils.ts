import { userApi } from '@nodejs-microservices/swagger';

export function isNullOrUndefined(...values: any[]): boolean {
    for (const value of values) {
        if (value === null || value === undefined) {
            return true;
        }
    }
    return false;
}

export function isTokenStructureValid(token: string): boolean {
    if (isNullOrUndefined(token) || token === '') {
        return false;
    }

    const splittedToken = token.split(' ');
    if (splittedToken.length !== 2 || splittedToken[0] !== 'Bearer') {
        return false;
    }

    return true;
}

export async function validateTokenAndGetEmail(token: string): Promise<string> {
    const response = await userApi.validateTokenPost({ signupPost200Response: { token } });
    return response.email;
}
