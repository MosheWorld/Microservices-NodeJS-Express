import { User } from '../types';
import { IUserDal } from './user.interface';
import { isNullOrUndefined, BadRequestError } from '@nodejs-microservices/utils';

const db: Record<string, User> = {};

export class UserDal implements IUserDal {
    create(email: string, databaseRecord: User): void {
        if (!isNullOrUndefined(db[email])) {
            throw new BadRequestError(`Email ${email} already exists`);
        }

        db[email] = databaseRecord;
    }

    get(email: string): User {
        return db[email];
    }

    exists(email: string): boolean {
        return !isNullOrUndefined(db[email]);
    }
}
