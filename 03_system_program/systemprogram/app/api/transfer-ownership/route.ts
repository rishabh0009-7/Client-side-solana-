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

    // Create keypair from secret key
    const payer = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(process.env.PAYER_SECRET_KEY))
    );

    // Create connection to Solana devnet
    const connection = new Connection("https://api.devnet.solana.com");
    // Parse request body
    const { accountAddress, newOwnerAddress } = await request.json();

    if (!accountAddress || !newOwnerAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: accountAddress and newOwnerAddress",
        },
        { status: 400 }
      );
    }
    // Create transaction to assign new owner
    const transaction = new Transaction().add(
      SystemProgram.assign({
        accountPubkey: new PublicKey(accountAddress),
        programId: new PublicKey(newOwnerAddress),
      })
    );

    // Send transaction
    const signature = await connection.sendTransaction(transaction, [payer]);

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return NextResponse.json({
      success: true,
      signature,
      accountAddress,
      newOwnerAddress,
      payerPublicKey: payer.publicKey.toString(),
    });
  } catch (error) {
    console.error("Error transferring ownership:", error);
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
