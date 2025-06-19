// Type definitions for SOVR Ecosystem

export interface TransactionRequest {
  txHash: string;
  psik_auth: string;
  manualApprove: boolean;
  approved?: boolean;
  bmoRouting?: string;
  bmoAccount?: string;
}

export interface TransactionResponse {
  success: boolean;
  message?: string;
  tx_id?: string;
  data?: {
    id: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    created: number;
    arrival_date: number;
    description: string;
    [key: string]: unknown;
  };
  error?: string;
}

export interface BurnVerification {
  amount: number;
  checkNumber: string;
  routingNumber?: string;
  accountNumber?: string;
}

export interface VaultRecord {
  tx_id: string;
  timestamp: string;
  offset_token: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Settled' | 'Failed';
  converted_currency: string;
  execution_channel: string;
  trust_reference: string;
  executed_by: string;
}

export interface BankConfig {
  name: string;
  routingNumber: string;
  accountNumber: string;
  burnAmount: number;
}

export interface ApiError extends Error {
  statusCode: number;
  code: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      object: string;
      amount: number;
      currency: string;
      method: string;
      status: string;
      type: string;
      created: number;
      arrival_date: number;
      description: string;
      [key: string]: unknown;
    };
  };
  created: number;
}
