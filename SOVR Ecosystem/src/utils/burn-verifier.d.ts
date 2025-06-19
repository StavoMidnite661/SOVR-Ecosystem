import { BurnVerification, ApiError } from '../types';
export declare class BurnVerificationError extends Error implements ApiError {
    statusCode: number;
    code: string;
    constructor(message: string, statusCode?: number, code?: string);
}
export declare function verifyBurn(txHash: string, expectedAmount: number): Promise<BurnVerification>;
