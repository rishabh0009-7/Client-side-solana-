"use client";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Page() {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const { connection } = useConnection();
  const { publicKey, connected, signMessage, sendTransaction } = useWallet();

  const requestairdrop = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    try {
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      const signature = await connection.requestAirdrop(publicKey, lamports);
      console.log("Airdrop successful! Signature:", signature);
      alert(`Airdrop successful! Signature: ${signature}`);
    } catch (error: any) {
      console.error("Airdrop failed:", error);
      if (error.message?.includes("429")) {
        alert(
          "Airdrop limit reached. Please visit https://faucet.solana.com for test SOL"
        );
      } else {
        alert(`Airdrop failed: ${error.message}`);
      }
    }
  };

  const showbalance = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }
    const balance = await connection.getBalance(publicKey);
    const solbakan = balance / LAMPORTS_PER_SOL;
    alert(`Balance: ${solbakan} SOL`);
  };

  const signmessage = async () => {
    if (!publicKey || !signMessage) {
      alert("Please connect your wallet first!");
      return;
    }
    const message = "hello solana";
    const encodedmessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedmessage);
    alert(`Signed message: ${signature}`);
  };

  const sendtoken = async () => {
    if (!publicKey || !sendTransaction) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!to.trim()) {
      alert("Please enter recipient address!");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    try {
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(to),
          lamports: lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent:", signature);
      alert(`Transaction sent! Signature: ${signature}`);
    } catch (error: any) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-7xl font-bold">welcome to wallet adapter</h1>

      <WalletMultiButton className="bg-blue-500 text-white p-2 rounded-md mt-2">
        connect wallet{" "}
      </WalletMultiButton>
      <WalletDisconnectButton className="bg-red-500 text-white p-2 rounded-md mt-2" />

      <input
        type="text"
        className="border-2 border-gray-300 p-2 rounded-md"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={() => requestairdrop()}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        request airdrop
      </button>

      <button
        onClick={() => showbalance()}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        show balance
      </button>

      <button
        onClick={() => signmessage()}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        sign message{" "}
      </button>

      <input
        type="text"
        className="border-2 border-gray-300 p-2 rounded-md"
        placeholder="Enter recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input type="text" className="border-2 border-gray-300 p-2 rounded-md" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button
        onClick={() => sendtoken()}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        {" "}
        send token{" "}
      </button>
    </div>
  );
}
