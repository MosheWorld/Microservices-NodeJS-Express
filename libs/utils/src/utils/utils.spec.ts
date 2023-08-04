import { userApi } from '@nodejs-microservices/swagger';
import { isNullOrUndefined, isTokenStructureValid, validateTokenAndGetEmail } from './utils';

jest.mock('@nodejs-microservices/swagger', () => ({
    userApi: {
        validateTokenPost: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
    },
}));

describe('utils', () => {
    describe('isNullOrUndefined', () => {
        it('should return true for null or undefined values', () => {
            // Act + Assert
            expect(isNullOrUndefined(null)).toEqual(true);
            expect(isNullOrUndefined(undefined)).toEqual(true);
        });

        it('should return false for non-null and defined values', () => {
            // Act + Assert
            expect(isNullOrUndefined(0)).toEqual(false);
            expect(isNullOrUndefined('')).toEqual(false);
            expect(isNullOrUndefined(false)).toEqual(false);
            expect(isNullOrUndefined({})).toEqual(false);
            expect(isNullOrUndefined([])).toEqual(false);
            expect(isNullOrUndefined(42)).toEqual(false);
        });

        it('should handle multiple arguments and return true if any of them is null or undefined', () => {
            // Act + Assert
            expect(isNullOrUndefined(null, 42)).toEqual(true);
            expect(isNullOrUndefined(undefined, 'hello', null)).toEqual(true);
            expect(isNullOrUndefined(0, false, null, undefined)).toEqual(true);
            expect(isNullOrUndefined(null, undefined, null)).toEqual(true);
            expect(isNullOrUndefined(false, {})).toEqual(false);
            expect(isNullOrUndefined([], 'value')).toEqual(false);
        });
    });

    describe('isTokenStructureValid', () => {
        it('should return false for null or empty token', () => {
            // Act + Assert
            expect(isTokenStructureValid(null)).toEqual(false);
            expect(isTokenStructureValid(undefined)).toEqual(false);
            expect(isTokenStructureValid('')).toEqual(false);
        });

        it('should return false for invalid token structure', () => {
            // Act + Assert
            expect(isTokenStructureValid('Bearer')).toEqual(false);
            expect(isTokenStructureValid('Token only')).toEqual(false);
            expect(isTokenStructureValid('Bearer token extra')).toEqual(false);
        });

        it('should return true for valid token structure', () => {
            // Act + Assert
            expect(isTokenStructureValid('Bearer abcdef123456')).toEqual(true);
            expect(isTokenStructureValid('Bearer 789xyz')).toEqual(true);
        });
    });

    describe('validateTokenAndGetEmail', () => {
        it('should return the email when provided a valid token', async () => {
            // Arrange
            const validToken = 'Bearer abcdef123456';

            // Act
            const email = await validateTokenAndGetEmail(validToken);

            // Assert
            expect(email).toEqual('test@example.com');
            expect(userApi.validateTokenPost).toHaveBeenCalledWith({ signupPost200Response: { token: validToken } });
        });

        it('should throw an error when provided an invalid token', async () => {
            // Arrange
            (userApi.validateTokenPost as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

            // Act
            const validateTokenAndGetEmailPromise = validateTokenAndGetEmail('Bearer invalid_token');

            // Assert
            await expect(validateTokenAndGetEmailPromise).rejects.toThrowError(Error);
        });
    });
});
