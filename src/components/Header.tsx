"use client";

import { useState, useEffect } from "react";
import {
  useDisconnect,
  useAppKit,
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
  type Provider
} from "@reown/appkit/react"
import Link from "next/link"
import GlobalLoading from "@/components/GlobalLoading";
import Image from "next/image";
import { getAuthInfo, authSignature } from "@/api/modules";
import WalletIcon from "@/assets/images/wallet.png";

export default function Header({ page }: { page: string; }) {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { chainId } = useAppKitNetworkCore();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155')

  const [loading, setLoading] = useState(false);

  // 监听 address 的变化
  useEffect(() => {
    const _getAuthInfo = async () => {
      // 1. 检查是否安装了 MetaMask
      if (typeof window.ethereum === 'undefined') {
        alert('请先安装 MetaMask 钱包插件')
      }
      setLoading(true);
      try {
        // if (!walletProvider || !address) throw Error('user is disconnected');
        const {data} = await getAuthInfo()
        // const provider = new BrowserProvider(walletProvider, chainId);
        // const signer = new JsonRpcSigner(provider, address);
        // const signature = await signer?.signMessage(data.auth_info);
        if(typeof window.ethereum === 'undefined') {
          throw Error('请先安装 MetaMask 钱包插件')
        }
        // @ts-expect-error: window.ethereum
        const [address] = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        // @ts-expect-error: window.ethereum
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [data.auth_info, address], // ⚠️ 注意参数顺序
        })
        const res = await authSignature({
          id: data.id,
          signature: signature,
          addr: address,
        })
        localStorage.setItem('token', res.data.token)
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    if (address) _getAuthInfo()
  }, [address, chainId, walletProvider])

  const login = async () => {
    if (address) {
      try {
        await disconnect();
        localStorage.removeItem('token');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await open()
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <GlobalLoading open={loading} />
      <header className="bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 sticky top-0 z-50">
        <nav className="max-w-[1280px] h-[120px] mx-auto flex items-start justify-between px-[90px]">
          <Link className="h-[29px] leading-[29px] text-[24px] font-extrabold mt-[39px]" href="/">
            <span className="bg-gradient-orange bg-clip-text text-transparent">Yield</span>
            <span className="text-white">Market</span>
          </Link>
          <div className="mt-[42px] flex space-x-[68PX]">
            <Link className={`inline-block h-[24px] leading-[24px] ${page === "sell-orders" ? "text-[#FFA200]" : "text-white"}`} href="/">Sell Orders</Link>
            <Link className={`inline-block h-[24px] leading-[24px] ${page === "buy-orders" ? "text-[#FFA200]" : "text-white"}`} href="/buy-orders">Buy Orders</Link>
            <button
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              onClick={login}
            >
              <Image src={WalletIcon} alt="wallet" className="size-[24px] mr-[11px]"/>
              {address ? (
                <span className="inline-block h-[24px] leading-[24px] text-white">{`${address.slice(0, 7)}......${address.slice(-4)}`}</span>
              ) : (
                <span className="inline-block h-[24px] leading-[24px] text-white">Log In</span>
              )}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
