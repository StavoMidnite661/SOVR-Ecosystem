"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayout = createPayout;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
async function createPayout(amountCents, currency, routingNumber, accountNumber, description) {
    return await stripe.payouts.create({
        amount: amountCents,
        currency,
        method: 'standard',
        destination: `${routingNumber}|${accountNumber}`, // Stripe expects string for destination in some versions
        description,
    });
}
//# sourceMappingURL=stripe-handler.js.map