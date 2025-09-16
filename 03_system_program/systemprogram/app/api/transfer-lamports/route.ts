import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export async function POST(request: NextRequest) {
  try {
    // Check if PAYER_SECRET_KEY is available
    if (!process.env.PAYER_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "PAYER_SECRET_KEY environment variable not set",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const { toAddress, amount } = await request.json();

    if (!toAddress || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: toAddress and amount",
        },
        { status: 400 }
      );
    }

    // Create keypair from secret key
    const payer = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(process.env.PAYER_SECRET_KEY))
    );

    // Create connection to Solana devnet
    const connection = new Connection("https://api.devnet.solana.com");

    // Convert amount to lamports (1 SOL = 1,000,000,000 lamports)
    const lamports = Math.floor(amount * 1_000_000_000);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports,
      })
    );

    // Send transaction
    const signature = await connection.sendTransaction(transaction, [payer]);

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return NextResponse.json({
      success: true,
      signature,
      fromAddress: payer.publicKey.toString(),
      toAddress,
      amount,
      lamports,
    });
  } catch (error) {
    console.error("Error transferring lamports:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
