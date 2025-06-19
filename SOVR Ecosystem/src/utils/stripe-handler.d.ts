import Stripe from 'stripe';
export declare function createPayout(amountCents: number, currency: string, routingNumber: string, accountNumber: string, description: string): Promise<Stripe.Response<Stripe.Payout>>;
