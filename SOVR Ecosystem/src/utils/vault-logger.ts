import axios from 'axios';
import { VaultRecord } from '../types';

export async function logVaultEcho(txData: VaultRecord): Promise<void> {
  if (!process.env.VAULT_ECHO_URL) {
    console.error('Vault Echo URL not configured');
    return;
  }

  try {
    await axios.post(`${process.env.VAULT_ECHO_URL}/log`, txData);
  } catch (e) {
    console.error('Vault Echo Logging Failed:', e instanceof Error ? e.message : String(e));
  }
}
