"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnVerificationError = void 0;
exports.verifyBurn = verifyBurn;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
class BurnVerificationError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 400, code = 'BURN_VERIFICATION_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'BurnVerificationError';
    }
}
exports.BurnVerificationError = BurnVerificationError;
async function verifyBurn(txHash, expectedAmount) {
    if (!process.env.BLOCKSCOUT_API_KEY) {
        throw new BurnVerificationError('Blockscout API key not configured', 500, 'CONFIG_ERROR');
    }
    try {
        const response = await axios_1.default.get(`https://blockscout.com/api/v2/transactions/${txHash}`, {
            headers: { Authorization: `Bearer ${process.env.BLOCKSCOUT_API_KEY}` },
        });
        const logs = response.data.logs;
        const paymentRouted = logs.find((log) => log.topics[0] ===
            '0xab736d540db8e38540410a3b175e7e0f05450fd84449017d2e54b1d1e07b9c2e');
        if (!paymentRouted) {
            throw new BurnVerificationError('No PaymentRouted event found', 400, 'INVALID_TRANSACTION');
        }
        const amount = ethers_1.BigNumber.from(paymentRouted.data.slice(0, 66)).div(1e18).toNumber();
        const micr = ethers_1.utils.toUtf8String(paymentRouted.data.slice(130));
        const [checkNumber, routingNumber, accountNumber] = micr.split('|');
        if (amount !== expectedAmount) {
            throw new BurnVerificationError(`Amount mismatch. Expected ${expectedAmount} $SOVRCR1`, 400, 'AMOUNT_MISMATCH');
        }
        return {
            amount,
            checkNumber,
            routingNumber,
            accountNumber,
        };
    }
    catch (error) {
        if (error instanceof BurnVerificationError) {
            throw error;
        }
        if (axios_1.default.isAxiosError(error)) {
            throw new BurnVerificationError(`Blockscout API error: ${error.message}`, error.response?.status || 500, 'API_ERROR');
        }
        throw new BurnVerificationError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`, 500, 'UNKNOWN_ERROR');
    }
}
//# sourceMappingURL=burn-verifier.js.map