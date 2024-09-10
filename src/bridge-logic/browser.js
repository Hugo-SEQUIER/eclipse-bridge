import { runDeposit } from './lib.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('deposit-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const destination = document.getElementById('destination').value;
    const amount = document.getElementById('amount').value;
    const chainName = document.querySelector('input[name="chain"]:checked').value;

    try {
      await runDeposit({ destination, amount, chainName });
      alert('Deposit successful!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});