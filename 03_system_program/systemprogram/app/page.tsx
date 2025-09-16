"use client";

import { useState } from "react";

export default function ownership() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [ownershipLoading, setOwnershipLoading] = useState(false);
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>("");

  async function createAccount() {
    setLoading(true);
    setResult("Creating account...");

    try {
      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ Account created successfully!
        
🔑 New Account Public Key: ${data.newAccountPublicKey}
👤 Payer Public Key: ${data.payerPublicKey}
📝 Transaction Signature: ${data.signature}

🔍 Verify on Solana Explorer:
https://explorer.solana.com/tx/${data.signature}?cluster=devnet

🔍 Check Account Details:
https://explorer.solana.com/address/${data.newAccountPublicKey}?cluster=devnet`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function transferLamports() {
    if (!toAddress || !amount) {
      setResult("Please enter both recipient address and amount");
      return;
    }

    setTransferLoading(true);
    setResult("Transferring lamports...");

    try {
      const response = await fetch("/api/transfer-lamports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toAddress,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ Transfer successful!
        
💰 Amount: ${data.amount} SOL (${data.lamports} lamports)
👤 From: ${data.fromAddress}
🎯 To: ${data.toAddress}
📝 Transaction Signature: ${data.signature}

🔍 Verify on Solana Explorer:
https://explorer.solana.com/tx/${data.signature}?cluster=devnet`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setTransferLoading(false);
    }
  }

  async function transferOwnership() {
    if (!accountAddress || !newOwnerAddress) {
      setResult("Please enter both account address and new owner address");
      return;
    }

    setOwnershipLoading(true);
    setResult("Transferring ownership...");

    try {
      const response = await fetch("/api/transfer-ownership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountAddress,
          newOwnerAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ Ownership transferred successfully!
        
🏠 Account Address: ${data.accountAddress}
👤 New Owner: ${data.newOwnerAddress}
👤 Previous Owner: ${data.payerPublicKey}
📝 Transaction Signature: ${data.signature}

🔍 Verify on Solana Explorer:
https://explorer.solana.com/tx/${data.signature}?cluster=devnet`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setOwnershipLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>
        System Program: 1- New Account Creation 2- Transfer Lamports 3-
        Ownership Transfer
      </h1>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={createAccount}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating Account..." : "1. Create New Account"}
        </button>
      </div>

      {/* Transfer Section */}
      <div
        style={{
          marginTop: "40px",
          padding: "25px",
          border: "3px solid #007bff",
          borderRadius: "12px",
          backgroundColor: "#cce7ff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <h3
          style={{
            marginTop: "0",
            color: "#004085",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          💰 2. Transfer Lamports
        </h3>
        <p
          style={{
            color: "#004085",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          💸 Transfer SOL from your account to another address
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "500px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#004085",
                fontSize: "16px",
              }}
            >
              📍 Recipient Address:
            </label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Enter Solana address (e.g., 2CBy2p169rGZCEhGHZqjGw4Jz8d7sDkMTMCE4aCiJxjgNoZqgJcJMNgUeqUKZXmat55XTfucCr822HAbdSeXMAvC)"
              style={{
                width: "100%",
                padding: "15px",
                border: "2px solid #28a745",
                borderRadius: "8px",
                fontSize: "16px",
                fontFamily: "monospace",
                backgroundColor: "black",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#495057",
              }}
            >
              Amount (SOL):
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in SOL (e.g., 0.1)"
              step="0.000000001"
              min="0"
              style={{
                width: "100%",
                padding: "15px",
                border: "2px solid #28a745",
                borderRadius: "8px",
                fontSize: "16px",
                backgroundColor: "black",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <button
            onClick={transferLamports}
            disabled={transferLoading || !toAddress || !amount}
            style={{
              padding: "15px 30px",
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor:
                transferLoading || !toAddress || !amount ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor:
                transferLoading || !toAddress || !amount
                  ? "not-allowed"
                  : "pointer",
              alignSelf: "flex-start",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            {transferLoading ? "⏳ Transferring..." : "🚀 Transfer Lamports"}
          </button>
        </div>
      </div>

      {/* Ownership Transfer Section */}
      <div
        style={{
          marginTop: "40px",
          padding: "25px",
          border: "3px solid #dc3545",
          borderRadius: "12px",
          backgroundColor: "#f8d7da",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <h3
          style={{
            marginTop: "0",
            color: "#721c24",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          🏠 3. Transfer Ownership
        </h3>
        <p
          style={{
            color: "#721c24",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          🔄 Transfer ownership of an account to a new program
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "500px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#495057",
              }}
            >
              Account Address:
            </label>
            <input
              type="text"
              value={accountAddress}
              onChange={(e) => setAccountAddress(e.target.value)}
              placeholder="Enter account address to transfer ownership"
              style={{
                width: "100%",
                padding: "15px",
                border: "2px solid #dc3545",
                borderRadius: "8px",
                fontSize: "16px",
                fontFamily: "monospace",
                backgroundColor: "black",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#495057",
              }}
            >
              New Owner (Program ID):
            </label>
            <input
              type="text"
              value={newOwnerAddress}
              onChange={(e) => setNewOwnerAddress(e.target.value)}
              placeholder="Enter new owner program ID"
              style={{
                width: "100%",
                padding: "15px",
                border: "2px solid #dc3545",
                borderRadius: "8px",
                fontSize: "16px",
                fontFamily: "monospace",
                backgroundColor: "black",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <button
            onClick={transferOwnership}
            disabled={ownershipLoading || !accountAddress || !newOwnerAddress}
            style={{
              padding: "15px 30px",
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor:
                ownershipLoading || !accountAddress || !newOwnerAddress
                  ? "#ccc"
                  : "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor:
                ownershipLoading || !accountAddress || !newOwnerAddress
                  ? "not-allowed"
                  : "pointer",
              alignSelf: "flex-start",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            {ownershipLoading ? "⏳ Transferring..." : "🏠 Transfer Ownership"}
          </button>
        </div>
      </div>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: result.includes("Error") ? "#f8d7da" : "#d4edda",
            border: result.includes("Error")
              ? "1px solid #f5c6cb"
              : "1px solid #c3e6cb",
            borderRadius: "5px",
            wordBreak: "break-all",
            color: result.includes("Error") ? "#721c24" : "#155724",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "pre-line",
          }}
        >
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}
