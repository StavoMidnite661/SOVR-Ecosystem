import crypto from 'crypto';
import axios from 'axios';
import sodium from 'libsodium-wrappers';
import { ethers } from 'ethers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

async function signMessage(message, privateKeyBase64) {
  await sodium.ready;
  const key = Buffer.from(privateKeyBase64, 'base64');
  const signature = sodium.crypto_sign_detached(message, key);
  return Buffer.from(signature).toString('base64');
}

async function verifyBurn(txHash) {
  const response = await axios.get(`https://blockscout.com/api/v2/transactions/${txHash}`, {
    headers: { Authorization: `Bearer ${process.env.BLOCKSCOUT_API_KEY}` },
  });
  const logs = response.data.logs;
  const paymentRouted = logs.find(
    (log) => log.topics[0] === '0xab736d540db8e38540410a3b175e7e0f05450fd84449017d2e54b1d1e07b9c2e'
  );
  if (!paymentRouted) throw new Error('No PaymentRouted event found');
  const amount = ethers.BigNumber.from(paymentRouted.data.slice(0, 66)).div(1e18).toNumber();
  const micr = ethers.utils.toUtf8String(paymentRouted.data.slice(130));
  const [checkNumber, routingNumber, accountNumber] = micr.split('|');
  // Adjust based on intended burn (50,000 or 50,000,000)
  if (amount !== 50000) throw new Error('Amount mismatch for 50k $SOVRCR1 burn');
  return { amount, checkNumber };
}

async function logVaultEcho(txData) {
  try {
    await axios.post(`${process.env.VAULT_ECHO_URL}/log`, txData);
  } catch (e) {
    console.error('Vault Echo Logging Failed:', e.message);
  }
}

export default async (req, res) => {
  let bodyData = '';
  for await (const chunk of req) bodyData += chunk;
  try {
    req.body = JSON.parse(bodyData);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txHash, psik_auth, manualApprove } = req.body;
  if (!txHash || psik_auth !== 'TRUST-AUTH-SOVR') {
    return res.status(400).json({ error: 'Invalid request payload or authorization' });
  }

  try {
    const { amount, checkNumber } = await verifyBurn(txHash);

    if (manualApprove && !req.body.approved) {
      return res.status(200).json({ success: false, message: 'Awaiting manual approval' });
    }

    const payout = await stripe.payouts.create({
      amount: amount * 100, // USD to cents (1:1 rate, adjust if different)
      currency: 'usd',
      method: 'standard',
      destination: {
        type: 'bank_account',
        routing_number: '322273722',
        account_number: '1016651',
      },
      description: `SOVRCR1 Burn ${txHash} - ${checkNumber} to Valley Strong`,
    });

    const txId = crypto.createHash('sha256').update(JSON.stringify({ txHash })).digest('hex');
    const vaultRecord = {
      tx_id: txId,
      timestamp: new Date().toISOString(),
      offset_token: 'SOVR',
      amount,
      status: 'Settled',
      converted_currency: 'USD',
      execution_channel: 'ACH - Valley Strong',
      trust_reference: checkNumber,
      executed_by: 'GM_FAMILY_TRUST',
    };
    await logVaultEcho(vaultRecord);

    return res.status(200).json({
      success: true,
      message: 'ACH payout initiated to Valley Strong.',
      tx_id: txId,
      data: payout,
    });
  } catch (err) {
    console.error('ACH execution error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};