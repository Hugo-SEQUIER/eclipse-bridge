import './App.css';
import MetaMaskConnection from './MetaMaskConnection';
import { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { runDeposit } from './bridge-logic/lib.js';

window.Buffer = Buffer;

function App() {
  const [eclipseAddress, setEclipseAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [toast, setToast] = useState(null);
  const [transactionComplete, setTransactionComplete] = useState(false);

  const handleConnected = (providerInstance, address) => {
    setProvider(providerInstance);
    setAccount(address);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleBridge = async () => {
    if (!eclipseAddress || !amount || !provider || !account) {
      setToast({ message: 'Please connect to MetaMask and enter both Eclipse address and amount.', type: 'error' });
      return;
    }

    try {
      await runDeposit({
        destination: eclipseAddress,
        amount: amount,
        chainName: 'sepolia'
      });
      setToast({ message: `Transaction sent! ${amount} ETH to Eclipse address ${eclipseAddress}.`, type: 'success' });
      setTransactionComplete(true);
    } catch (error) {
      console.error('Error during bridging:', error);
      setToast({ message: `Error during bridging: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="App">
      <MetaMaskConnection onConnected={handleConnected} />
      <header className="App-header">
        <h1>Eclipse Bridge</h1>
        <div className="bridge-form">
          <label htmlFor="address">Eclipse Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter Eclipse address"
            value={eclipseAddress}
            onChange={(e) => setEclipseAddress(e.target.value)}
          />
          <label htmlFor="amount">Amount of ETH to bridge from Sepolia</label>
          <input
            type="number"
            id="amount"
            step="0.001"
            min="0.02"
            placeholder="Enter ETH amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="bridge-button" onClick={handleBridge}>Bridge ETH to Eclipse</button>
        </div>
        {toast && (
          <div className={`toast ${toast.type}`}>
            {typeof toast.message === 'string' ? toast.message : toast.message}
          </div>
        )}
        {transactionComplete && (
          <div className="balance-check">
            <a 
              href={`https://explorer.modular.cloud/eclipse-testnet/addresses/${eclipseAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check your balance on Eclipse Explorer
            </a>
          </div>
        )}
      </header>
      <div className="bottom-left">
        <img src="/eclipse-logo.jpg" alt="Eclipse Logo" className="eclipse-logo" />
      </div>
      <div className="bottom-right">
        <a href="https://linktr.ee/sequierh" target="_blank" rel="noopener noreferrer">
          <img src="/linktree-logo.png" alt="Linktree" className="linktree-logo" />
        </a>
      </div>
    </div>
  );
}

export default App;