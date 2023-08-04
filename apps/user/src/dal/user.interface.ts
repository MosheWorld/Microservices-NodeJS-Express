import { User } from '../types';

export interface IUserDal {
    create(email: string, databaseRecord: User): void;
    get(email: string): User;
    exists(email: string): boolean;
}
