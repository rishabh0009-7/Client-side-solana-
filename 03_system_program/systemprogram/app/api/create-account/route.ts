import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
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

    // Create keypair from secret key
    const payer = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(process.env.PAYER_SECRET_KEY))
    );

    // Create connection to Solana devnet
    const connection = new Connection("https://api.devnet.solana.com");

    // Generate new account
    const newAccount = Keypair.generate();
    const total_byte = 165;

    // Get minimum balance for rent exemption
    const lamports = await connection.getMinimumBalanceForRentExemption(
      total_byte
    );

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports,
        space: total_byte,
        programId: SystemProgram.programId,
      })
    );

    // Send transaction
    const signature = await connection.sendTransaction(transaction, [
      payer,
      newAccount,
    ]);

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return NextResponse.json({
      success: true,
      signature,
      newAccountPublicKey: newAccount.publicKey.toString(),
      payerPublicKey: payer.publicKey.toString(),
    });
  } catch (error) {
    console.error("Error creating account:", error);
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
