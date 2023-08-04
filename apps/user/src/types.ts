export interface User {
    email: string;
    password: string;
    salt: string;
}

export interface TokenPayload {
    email: string;
}
