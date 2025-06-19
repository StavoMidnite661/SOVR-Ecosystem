import React, { useState } from 'react';

async function liquidateCredit(txHash: string, isBmo = true) {
  const response = await fetch(`/api/${isBmo ? 'trust-ach-execute-bmo' : 'trust-ach-execute-val'}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      txHash,
      psik_auth: 'TRUST-AUTH-SOVR',
      manualApprove: true,
    }),
  });
  const result = await response.json();
  if (result.success) {
    if (window.confirm(`Approve ACH payout to ${isBmo ? 'BMO' : 'Valley Strong'}?`)) {
      await fetch(`/api/${isBmo ? 'trust-ach-execute-bmo' : 'trust-ach-execute-val'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          psik_auth: 'TRUST-AUTH-SOVR',
          manualApprove: true,
          approved: true,
        }),
      });
      alert(`Payout initiated to ${isBmo ? 'BMO' : 'Valley Strong'}!`);
    }
  } else {
    alert(result.message || 'Error');
  }
}

const App: React.FC = () => {
  const [txHash, setTxHash] = useState('');
  const [isBmo, setIsBmo] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!txHash) {
      alert('Please enter a transaction hash.');
      return;
    }
    setLoading(true);
    try {
      await liquidateCredit(txHash, isBmo);
    } catch (error) {
      alert('An error occurred: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Liquidate Credit</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Transaction Hash:{' '}
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            style={{ width: '300px' }}
            disabled={loading}
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            name="bank"
            checked={isBmo}
            onChange={() => setIsBmo(true)}
            disabled={loading}
          />
          BMO
        </label>{' '}
        <label>
          <input
            type="radio"
            name="bank"
            checked={!isBmo}
            onChange={() => setIsBmo(false)}
            disabled={loading}
          />
          Valley Strong
        </label>
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
};

export default App;
