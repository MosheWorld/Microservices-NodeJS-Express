import { IShopService } from './shop.interface';
import { CreditCardData, DataSummary, PurchasedProduct } from '../types';
import { productApi, paymentApi, SwaggerProduct, SwaggerPayment } from '@nodejs-microservices/swagger';
import { isNullOrUndefined, getHeaderWithTokenAndContentType, MessageQueue, ProductQueueMessage, PaymentQueueMessage, QueueNames, InternalServerError } from '@nodejs-microservices/utils';

export class ShopService implements IShopService {
    async getAllUserData(token: string, email: string): Promise<DataSummary> {
        const headers = getHeaderWithTokenAndContentType(token);

        const productsPromise = productApi.rootGet({ email: email }, { headers });
        const paymentsPromise = paymentApi.rootGet({ email }, { headers });
        const [productsResult, paymentsResult] = await Promise.allSettled([productsPromise, paymentsPromise]);

        if (productsResult.status === 'rejected' || paymentsResult.status === 'rejected') {
            throw new InternalServerError('Failed to fetch products or payments data');
        }

        const productDict = this.createProductDictionary(productsResult.value);
        const uniqueCreditCards = this.createUniqueCreditCardsSet(paymentsResult.value);
        const creditCardDataList = this.createCreditCardDataList(uniqueCreditCards, paymentsResult.value, productDict);

        const dataSummary: DataSummary = {
            email,
            creditCardDataList,
        };

        return dataSummary;
    }

    async createSampleData(token: string): Promise<void> {
        const headers = getHeaderWithTokenAndContentType(token);

        const [product1, product2, product3, product4, product5] = await Promise.all([
            productApi.rootPost({ postRequest: { name: 'Product 1', description: 'Description of product 1', price: 10 } }, { headers }),
            productApi.rootPost({ postRequest: { name: 'Product 2', description: 'Description of product 2', price: 20 } }, { headers }),
            productApi.rootPost({ postRequest: { name: 'Product 3', description: 'Description of product 3', price: 30 } }, { headers }),
            productApi.rootPost({ postRequest: { name: 'Product 4', description: 'Description of product 4', price: 40 } }, { headers }),
            productApi.rootPost({ postRequest: { name: 'Product 5', description: 'Description of product 5', price: 50 } }, { headers }),
        ]);

        await Promise.all([
            await paymentApi.rootPost({ postRequest: { productId: product1.id, quantity: 1, creditCardNumber: '1111-1111-1111-1111' } }, { headers }),
            await paymentApi.rootPost({ postRequest: { productId: product2.id, quantity: 2, creditCardNumber: '1111-1111-1111-1111' } }, { headers }),
            await paymentApi.rootPost({ postRequest: { productId: product3.id, quantity: 3, creditCardNumber: '1111-1111-1111-1111' } }, { headers }),
            await paymentApi.rootPost({ postRequest: { productId: product4.id, quantity: 4, creditCardNumber: '2222-2222-2222-2222' } }, { headers }),
            await paymentApi.rootPost({ postRequest: { productId: product5.id, quantity: 5, creditCardNumber: '2222-2222-2222-2222' } }, { headers }),
        ]);
    }

    async deleteUserData(email: string): Promise<void> {
        const productMsg: ProductQueueMessage = { emailToDelete: email };
        const paymentMsg: PaymentQueueMessage = { emailToDelete: email };

        await Promise.all([MessageQueue.sendMessage(QueueNames.productMessageQueue, productMsg), MessageQueue.sendMessage(QueueNames.paymentMessageQueue, paymentMsg)]);
    }

    private createProductDictionary(products: SwaggerProduct.Product[]): { [key: string]: SwaggerProduct.Product } {
        const productDict: { [key: string]: SwaggerProduct.Product } = {};
        products.forEach((product) => {
            productDict[product.id] = product;
        });
        return productDict;
    }

    private createUniqueCreditCardsSet(payments: SwaggerPayment.Payment[]): Set<string> {
        const uniqueCreditCards = new Set<string>();
        payments.forEach((payment) => {
            uniqueCreditCards.add(payment.creditCardNumber);
        });
        return uniqueCreditCards;
    }

    private createCreditCardDataList(uniqueCreditCards: Set<string>, payments: SwaggerPayment.Payment[], productDict: Record<string, SwaggerProduct.Product>): CreditCardData[] {
        const creditCardDataList: CreditCardData[] = [];

        for (const creditCard of uniqueCreditCards) {
            const purchasedProducts: PurchasedProduct[] = this.getPurchasedProductsForCreditCard(creditCard, payments, productDict);

            creditCardDataList.push({
                creditCard,
                purchasedProducts,
            });
        }

        return creditCardDataList;
    }

    private getPurchasedProductsForCreditCard(creditCard: string, payments: SwaggerPayment.Payment[], productDict: Record<string, SwaggerProduct.Product>): PurchasedProduct[] {
        const paymentsRelatedCreditCard = payments.filter((payment) => payment.creditCardNumber === creditCard);

        const purchasedProducts: PurchasedProduct[] = paymentsRelatedCreditCard
            .map((payment) => {
                const productRelatedToPayment = productDict[payment.productId];

                if (!isNullOrUndefined(productRelatedToPayment)) {
                    return {
                        name: productRelatedToPayment.name,
                        price: productRelatedToPayment.price,
                        quantity: payment.quantity,
                    };
                }

                return null;
            })
            .filter((purchasedProduct) => !isNullOrUndefined(purchasedProduct));

        return purchasedProducts;
    }
}
