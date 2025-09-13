'use client'
import { useWallet  , useConnection} from "@solana/wallet-adapter-react"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function Page (){

  const {connection }= useConnection();
  const {publicKey , sendTransaction} = useWallet();
  return(
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-7xl font-bold">welcome to wallet adapter</h1>

      <WalletMultiButton className="bg-blue-500 text-white p-2 rounded-md">connect wallet </WalletMultiButton>
      <WalletDisconnectButton className="bg-red-500 text-white p-2 rounded-md"/>
    </div>
  )
}