export interface DataSummary {
    email: string;
    creditCardDataList: CreditCardData[];
}

export interface CreditCardData {
    creditCard: string;
    purchasedProducts: PurchasedProduct[];
}

export interface PurchasedProduct {
    name: string;
    price: number;
    quantity: number;
}
