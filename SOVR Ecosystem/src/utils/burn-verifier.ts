import axios from 'axios';
import { BigNumber, utils } from 'ethers';
import { BurnVerification, ApiError } from '../types';

export class BurnVerificationError extends Error implements ApiError {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code: string = 'BURN_VERIFICATION_ERROR'
  ) {
    super(message);
    this.name = 'BurnVerificationError';
  }
}

export async function verifyBurn(
  txHash: string,
  expectedAmount: number
): Promise<BurnVerification> {
  if (!process.env.BLOCKSCOUT_API_KEY) {
    throw new BurnVerificationError(
      'Blockscout API key not configured',
      500,
      'CONFIG_ERROR'
    );
  }

  try {
    const response = await axios.get(
      `https://blockscout.com/api/v2/transactions/${txHash}`,
      {
        headers: { Authorization: `Bearer ${process.env.BLOCKSCOUT_API_KEY}` },
      }
    );

    const logs = response.data.logs;
    const paymentRouted = logs.find(
      (log: any) =>
        log.topics[0] ===
        '0xab736d540db8e38540410a3b175e7e0f05450fd84449017d2e54b1d1e07b9c2e'
    );

    if (!paymentRouted) {
      throw new BurnVerificationError(
        'No PaymentRouted event found',
        400,
        'INVALID_TRANSACTION'
      );
    }

    const amount = BigNumber.from(
      paymentRouted.data.slice(0, 66)
    ).div(1e18).toNumber();
    
    const micr = utils.toUtf8String(paymentRouted.data.slice(130));
    const [checkNumber, routingNumber, accountNumber] = micr.split('|');

    if (amount !== expectedAmount) {
      throw new BurnVerificationError(
        `Amount mismatch. Expected ${expectedAmount} $SOVRCR1`,
        400,
        'AMOUNT_MISMATCH'
      );
    }

    return {
      amount,
      checkNumber,
      routingNumber,
      accountNumber,
    };
  } catch (error) {
    if (error instanceof BurnVerificationError) {
      throw error;
    }
    
    if (axios.isAxiosError(error)) {
      throw new BurnVerificationError(
        `Blockscout API error: ${error.message}`,
        error.response?.status || 500,
        'API_ERROR'
      );
    }

    throw new BurnVerificationError(
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      500,
      'UNKNOWN_ERROR'
    );
  }
}
