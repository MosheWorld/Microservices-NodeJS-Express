import { TokenPayload } from '../types';

export interface IUserService {
    signup(email: string, password: string): Promise<string>;
    login(email: string, password: string): Promise<string>;
    validateToken(token: string): Promise<TokenPayload>;
}
