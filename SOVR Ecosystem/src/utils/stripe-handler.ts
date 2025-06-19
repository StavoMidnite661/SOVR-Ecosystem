import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export async function createPayout(
  amountCents: number,
  currency: string,
  routingNumber: string,
  accountNumber: string,
  description: string
) {
  return await stripe.payouts.create({
    amount: amountCents,
    currency,
    method: 'standard',
    destination: `${routingNumber}|${accountNumber}`, // Stripe expects string for destination in some versions
    description,
  });
}
