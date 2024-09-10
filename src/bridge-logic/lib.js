import { createWalletClient, custom, parseEther } from 'viem';
import { NETWORK_CONFIG } from './config.js';
import { validateSolanaAddress } from './validate.js';
import { deposit } from './deposit.js';
import bs58 from 'bs58';

export async function runDeposit({ destination, amount, chainName }) {
  try {
    // Validate and decode destination address
    if (!validateSolanaAddress(destination)) {
      throw new Error('Invalid Solana address.');
    }
    const decodedSolanaAddress = bs58.decode(destination);
    const destinationHex =
      '0x' + Buffer.from(decodedSolanaAddress).toString('hex');

    // Parse and validate the amount
    const amountWei = parseEther(amount);
    const minAmountWei = parseEther('0.002');
    if (amountWei < minAmountWei) {
      throw new Error(
        'Insufficient deposit value. Min is 0.002 ether / 2_000_000 gwei',
      );
    }

    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create wallet client using MetaMask
    const networkConfig = NETWORK_CONFIG[chainName];
    if (!networkConfig) {
      throw new Error(`No configuration found for chain: ${chainName}`);
    }
    const { chain, etherBridgeAddress } = networkConfig;
    const client = createWalletClient({
      chain: chain,
      transport: custom(window.ethereum)
    });

    // Get the current account
    const [account] = await client.getAddresses();

    // Call the deposit function with the validated inputs
    await deposit(
      client,
      account,
      etherBridgeAddress,
      destinationHex,
      amountWei,
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}