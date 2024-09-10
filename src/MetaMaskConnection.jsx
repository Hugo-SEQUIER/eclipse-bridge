import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaMaskConnection = ({ onConnected }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    initializeEthers();
  }, []);

  useEffect(() => {
    if (account && provider) {
      fetchBalance();
    }
  }, [account, provider]);

  const initializeEthers = async () => {
    if (window.ethereum) {
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerInstance);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await providerInstance.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        onConnected(providerInstance, address);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log('Please install EVM Wallet!');
    }
  };

  const fetchBalance = async () => {
    try {
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const disconnect = () => {
    setAccount('');
    setProvider(null);
    setBalance(null);
    onConnected(null, null);
  };

  return (
    <div className="metamask-connection">
      {account ? (
        <div>
          <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          {balance !== null && (
            <p>Balance: {parseFloat(balance).toFixed(4)} ETH</p>
          )}
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={initializeEthers}>Connect EVM Wallet</button>
      )}
    </div>
  );
};

export default MetaMaskConnection;