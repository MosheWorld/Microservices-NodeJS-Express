export enum QueueNames {
    productMessageQueue = 'productMessageQueue',
    paymentMessageQueue = 'paymentMessageQueue',
}

export function getMessageQueueNames() {
    return Object.values(QueueNames);
}
