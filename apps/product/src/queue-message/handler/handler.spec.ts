import { Handler } from './handler';
import { Product } from '../../types';
import { IProductService } from '../../service';
import { ProductQueueMessage } from '@nodejs-microservices/utils';

function getMockProduct(id: string, email: string, name: string, description: string, price: number): Product {
    return {
        id,
        userEmail: email,
        name,
        description,
        price,
    };
}

describe('Handler', () => {
    let mockProductService: IProductService;

    beforeEach(() => {
        mockProductService = {
            getByEmail: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            get: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    it('should not delete products when emailToDelete is null or undefined', () => {
        // Arrange
        const message: ProductQueueMessage = { emailToDelete: null };
        const handler = new Handler(mockProductService);

        // Act
        handler.handle(message);

        // Assert
        expect(mockProductService.getByEmail).not.toHaveBeenCalled();
        expect(mockProductService.delete).not.toHaveBeenCalled();
    });

    it('should delete products when emailToDelete is provided', () => {
        // Arrange
        const mockEmail = 'test@example.com';
        const message: ProductQueueMessage = { emailToDelete: mockEmail };
        const mockProduct1 = getMockProduct('1', mockEmail, 'Product 1', 'Description of Product 1', 19.99);
        const mockProduct2 = getMockProduct('2', mockEmail, 'Product 2', 'Description of Product 2', 29.99);
        mockProductService.getByEmail = jest.fn().mockReturnValue([mockProduct1, mockProduct2]);
        const handler = new Handler(mockProductService);

        // Act
        handler.handle(message);

        // Assert
        expect(mockProductService.getByEmail).toHaveBeenCalledTimes(1);
        expect(mockProductService.getByEmail).toHaveBeenCalledWith(mockEmail);
        expect(mockProductService.delete).toHaveBeenCalledTimes(2);
        expect(mockProductService.delete).toHaveBeenCalledWith(mockProduct1.id);
        expect(mockProductService.delete).toHaveBeenCalledWith(mockProduct2.id);
    });

    it('should not delete productss when getByEmail throws an error', () => {
        // Arrange
        const mockEmail = 'test@example.com';
        const message: ProductQueueMessage = { emailToDelete: mockEmail };
        mockProductService.getByEmail = jest.fn(() => {
            throw new Error('test');
        });

        // Act
        const handler = new Handler(mockProductService);

        // Assert
        expect(() => handler.handle(message)).not.toThrow();
        expect(mockProductService.getByEmail).toHaveBeenCalledTimes(1);
        expect(mockProductService.getByEmail).toHaveBeenCalledWith(mockEmail);
        expect(mockProductService.delete).not.toHaveBeenCalled();
    });
});
