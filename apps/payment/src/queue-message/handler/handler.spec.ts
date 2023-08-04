import { Handler } from './handler';
import { Payment } from '../../types';
import { IPaymentService } from '../../service';
import { PaymentQueueMessage } from '@nodejs-microservices/utils';

function getMockPayment(id: string, email: string, productId: string, creditCardNumber: string, quantity: number): Payment {
    return {
        id,
        userEmail: email,
        productId,
        creditCardNumber,
        quantity,
        date: new Date().toISOString(),
    };
}

describe('Handler', () => {
    let mockPaymentService: IPaymentService;

    beforeEach(() => {
        mockPaymentService = {
            getByEmail: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            get: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    it('should not delete payments when emailToDelete is null or undefined', () => {
        // Arrange
        const message: PaymentQueueMessage = { emailToDelete: null };
        const handler = new Handler(mockPaymentService);

        // Act
        handler.handle(message);

        // Assert
        expect(mockPaymentService.getByEmail).not.toHaveBeenCalled();
        expect(mockPaymentService.delete).not.toHaveBeenCalled();
    });

    it('should delete payments when emailToDelete is provided', () => {
        // Arrange
        const mockEmail = 'test@example.com';
        const message: PaymentQueueMessage = { emailToDelete: mockEmail };
        const mockPayment1 = getMockPayment('1', mockEmail, '11', '1234', 7);
        const mockPayment2 = getMockPayment('2', mockEmail, '22', '1235', 10);
        mockPaymentService.getByEmail = jest.fn().mockReturnValue([mockPayment1, mockPayment2]);
        const handler = new Handler(mockPaymentService);

        // Act
        handler.handle(message);

        // Assert
        expect(mockPaymentService.getByEmail).toHaveBeenCalledTimes(1);
        expect(mockPaymentService.getByEmail).toHaveBeenCalledWith(mockEmail);
        expect(mockPaymentService.delete).toHaveBeenCalledTimes(2);
        expect(mockPaymentService.delete).toHaveBeenCalledWith(mockPayment1.id);
        expect(mockPaymentService.delete).toHaveBeenCalledWith(mockPayment2.id);
    });

    it('should not delete payments when getByEmail throws an error', () => {
        // Arrange
        const mockEmail = 'test@example.com';
        const message: PaymentQueueMessage = { emailToDelete: mockEmail };
        mockPaymentService.getByEmail = jest.fn(() => {
            throw new Error('test');
        });

        // Act
        const handler = new Handler(mockPaymentService);

        // Assert
        expect(() => handler.handle(message)).not.toThrow();
        expect(mockPaymentService.getByEmail).toHaveBeenCalledTimes(1);
        expect(mockPaymentService.getByEmail).toHaveBeenCalledWith(mockEmail);
        expect(mockPaymentService.delete).not.toHaveBeenCalled();
    });
});
