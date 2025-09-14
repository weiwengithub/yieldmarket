"use client";

import Link from "next/link"
import { motion } from "framer-motion";
import { useWeb3Store } from '@/hooks/useWeb3Store';
import Image from "next/image";
import WalletIcon from "@/assets/images/wallet.png";

export default function Header({ page }: { page: string; }) {
  const {isConnected, account, connectWallet, disconnect} = useWeb3Store();

  return (
    <>
      <header className="bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 sticky top-0 z-50">
        <nav className="max-w-[1280px] h-[120px] mx-auto flex items-start justify-between pl-[85px] pr-[93px]">
          <Link className="h-[29px] leading-[29px] text-[24px] font-extrabold mt-[39px]" href="/">
            <span className="bg-gradient-orange bg-clip-text text-transparent">Yield</span>
            <span className="text-white">Market</span>
          </Link>
          <div className="mt-[42px] flex space-x-[66px]">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                className={`inline-block h-[24px] leading-[24px] text-[16px] font-medium transition-all duration-300 relative ${
                  page === "sell-orders" ? "text-[#FFA200]" : "text-white hover:text-[#FFA200]"
                }`}
                href="/"
              >
                Sell Orders
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                className={`inline-block h-[24px] leading-[24px] text-[16px] font-medium transition-all duration-300 relative ${
                  page === "buy-orders" ? "text-[#FFA200]" : "text-white hover:text-[#FFA200]"
                }`}
                href="/buy-orders"
              >
                Buy Orders
              </Link>
            </motion.div>
            {isConnected ? (
              <motion.button
                className="flex items-center space-x-[11px] text-gray-300 hover:text-white transition-colors"
                onClick={disconnect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image src={WalletIcon} alt="wallet" className="size-[24px]"/>
                {account && (
                  <span className="inline-block h-[24px] leading-[24px] text-white">{`${account.slice(0, 7)}......${account.slice(-4)}`}</span>
                )}
              </motion.button>
            ) : (
              <motion.button
                className="flex items-center space-x-[11px] text-gray-300 hover:text-white transition-colors"
                onClick={connectWallet}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image src={WalletIcon} alt="wallet" className="size-[24px]"/>
                <span className="inline-block h-[24px] leading-[24px] text-white">Log In</span>
              </motion.button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
