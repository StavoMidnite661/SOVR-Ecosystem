"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logVaultEcho = logVaultEcho;
const axios_1 = __importDefault(require("axios"));
async function logVaultEcho(txData) {
    if (!process.env.VAULT_ECHO_URL) {
        console.error('Vault Echo URL not configured');
        return;
    }
    try {
        await axios_1.default.post(`${process.env.VAULT_ECHO_URL}/log`, txData);
    }
    catch (e) {
        console.error('Vault Echo Logging Failed:', e instanceof Error ? e.message : String(e));
    }
}
//# sourceMappingURL=vault-logger.js.map