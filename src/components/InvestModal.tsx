"use client";

import React, {useEffect, useState} from "react";
import { useWeb3Store } from '@/hooks/useWeb3Store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InvestModalProps } from "@/interface";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { ProgressBar } from '@/components/ProgressBar';
import {toast} from "sonner";
import {divide, formatUnits, parseUnits, plus, times, truncateDecimals} from "@/lib/numbers";
import {subscribeByUsdt, subscribeByToken} from "@/api/modules";
import GlobalLoading from "@/components/GlobalLoading";

export default function InvestModal({ order, open, setOpen }: InvestModalProps) {
  // 全局loading
  const [pageLoading, setPageLoading] = useState(false);

  const {isConnected, account, sendTransaction} = useWeb3Store();
  // 计算剩余可认购部分可获取的总收益
  const totalReceive = parseFloat(formatUnits(plus(order.remaining_unsold_principal, order.remaining_unsold_reward), order.tokenDecimals, 2));

  const [progress, setProgress] = useState(order.allow_partial_purchase ? 0 : 100);
  const [selectValue, setSelectValue] = useState("USDT");
  const [tokenPay, setTokenPay] = useState(order.allow_partial_purchase ? '0' : order.remaining_unsold_price_usdt);
  const [usdtPay, setUsdtPay] = useState(order.allow_partial_purchase ? '0' : order.remaining_unsold_price_usdt);
  const [receive, setReceive] = useState(order.allow_partial_purchase ? '0' : totalReceive);

  useEffect(() => {
    if (selectValue === "USDT") {
      setUsdtPay(times(divide(progress, 100), order.remaining_unsold_price_usdt))
    } else {
      setTokenPay(times(divide(progress, 100), order.remaining_unsold_price_token))
    }
    setReceive(times(divide(progress, 100), totalReceive))
  }, [progress]);

  // 合约地址
  const contractAddress = order.subscription_address

  const callSubscribeByUSDT = async () => {
    if (!isConnected || !account) {
      toast("Please connect your wallet first to log in.", { id: 'matches' })
      return;
    }

    setPageLoading(true);
    try {
      const _shareID = BigInt(order.stake_id)

      const {data} = await subscribeByUsdt({
        stake_id: order.stake_id,
        subscription_id: order.subscription_id,
        sender: account,
        owner: account,
        amount: usdtPay,
      })

      // 调用approve
      const approveABI = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }]
      const res = await sendTransaction(
        order.usdt_address,
        approveABI,
        'approve',
        [contractAddress, usdtPay],
      );

      const abi = [
        {
          "type": "function",
          "name": "subscribeByUSDT",
          "inputs": [
            {
              "name": "_owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "_shareID",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "_grantedReward",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "_grantedPrincipal",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "sc",
              "type": "tuple",
              "internalType": "struct SignedCredential",
              "components": [
                {
                  "name": "vc",
                  "type": "tuple",
                  "internalType": "struct VerifiableCredential",
                  "components": [
                    {
                      "name": "nonce",
                      "type": "uint64",
                      "internalType": "uint64"
                    },
                    {
                      "name": "epochIssued",
                      "type": "uint64",
                      "internalType": "uint64"
                    },
                    {
                      "name": "epochValidUntil",
                      "type": "uint64",
                      "internalType": "uint64"
                    },
                    {
                      "name": "action",
                      "type": "bytes4",
                      "internalType": "bytes4"
                    }
                  ]
                },
                {
                  "name": "signature",
                  "type": "bytes",
                  "internalType": "bytes"
                }
              ]
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        }
      ]

      // 构造参数
      const _grantedReward = data.granted_reward
      const _grantedPrincipal = data.granted_principal

      // 模拟构造 struct 参数（根据实际结构赋值）
      const vc = {
        nonce: data.nonce,
        epochIssued: data.epoch_issued,
        epochValidUntil: data.epoch_valid_until,
        action: data.action
      }

      const signature = data.signature

      const sc = {
        vc,
        signature
      }

      const receipt = await sendTransaction(
        contractAddress,
        abi,
        'subscribeByUSDT',
        [account, _shareID, usdtPay, _grantedReward, _grantedPrincipal, sc],
      );
      setPageLoading(false);
      console.log(receipt)
      console.log('交易已确认')
      toast("Invest successful. Please be patient. You can check your current invest order in a few minutes.", { id: 'invest' })
      setOpen(false)
    } catch (error) {
      setPageLoading(false);
    }
  }

  const callSubscribeByToken = async () => {
    if (!isConnected || !account) {
      toast("Please connect your wallet first to log in.", { id: 'matches' })
      return;
    }

    setPageLoading(true);
    try {
      const _shareID = BigInt(order.stake_id)

      const {data} = await subscribeByToken({
        stake_id: order.stake_id,
        subscription_id: order.subscription_id,
        sender: account,
        owner: account,
        amount: tokenPay
      })

      // 调用approve
      const approveABI = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }]
      const res = await sendTransaction(
        order.token_address,
        approveABI,
        'approve',
        [contractAddress, tokenPay],
      );

      const abi = [
        {
          "type": "function",
          "name": "subscribeByToken",
          "inputs": [
            {
              "name": "_owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "_shareID",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "_grantedReward",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "_grantedPrincipal",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "sc",
              "type": "tuple",
              "internalType": "struct SignedCredential",
              "components": [
                {
                  "name": "vc",
                  "type": "tuple",
                  "internalType": "struct VerifiableCredential",
                  "components": [
                    {
                      "name": "nonce",
                      "type": "uint64",
                      "internalType": "uint64"
                    },
                    {
                      "name": "epochIssued",
                      "type": "uint64",
                      "internalType": "uint64"
                    },
                    {
                      "name": "epochValidUntil",
                      "type": "uint64",
                      "internalType": "uint64"
                    },
                    {
                      "name": "action",
                      "type": "bytes4",
                      "internalType": "bytes4"
                    }
                  ]
                },
                {
                  "name": "signature",
                  "type": "bytes",
                  "internalType": "bytes"
                }
              ]
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        }
      ]

      // 构造参数
      const _grantedReward = data.granted_reward
      const _grantedPrincipal = data.granted_principal

      const vc = {
        nonce: data.nonce,
        epochIssued: data.epoch_issued,
        epochValidUntil: data.epoch_valid_until,
        action: data.action
      }

      const signature = data.signature

      const sc = {
        vc,
        signature
      }

      const receipt = await sendTransaction(
        contractAddress,
        abi,
        'subscribeByToken',
        [account, _shareID, tokenPay, _grantedReward, _grantedPrincipal, sc],
      );
      setPageLoading(false);
      console.log(receipt)
      console.log('交易已确认')
      toast("Invest successful. Please be patient. You can check your current invest order in a few minutes.", { id: 'invest' })
      setOpen(false)
    } catch (error) {
      setPageLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectValue === "USDT") {
      callSubscribeByUSDT()
    } else {
      callSubscribeByToken()
    }
  };

  return (
    <>
      <GlobalLoading open={pageLoading} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[674px] bg-transparent"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="h-[44px] text-white text-[36px] leading-[44px] font-bold text-center">
              Invest
            </DialogTitle>
          </DialogHeader>

          <div className="mt-[62px] space-y-[40px]">
            <div className="px-[12px]">
              <label className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]">Payment Asset</label>
              <div className="mt-[10px] flex items-center justify-between border-[1px] border-solid border-[#494949] rounded-[5px]">
                <Select value={selectValue} onValueChange={(val: string) => setSelectValue(val)}>
                  <SelectTrigger className="h-[59px] p-[20px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
                    <SelectItem className="px-[15px] py-[12px]" value="USDT">USDT</SelectItem>
                    <SelectItem className="px-[15px] py-[12px]" value={order.token_symbol}>{order.token_symbol}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ProgressBar
              initialValue={progress}
              onChange={setProgress}
            />

            <div className="px-[12px] space-y-[20px]">
              <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
                <div>You will pay:</div>
                <div>{selectValue === "USDT" ? formatUnits(usdtPay, order.usdtDecimals, 2) : formatUnits(tokenPay, order.tokenDecimals, 2)} {selectValue}</div>
              </div>
              <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
                <div>You will receive:</div>
                <div>{receive} {order.token_symbol}</div>
              </div>
              <div className="h-[39px] pt-[20px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between border-t-[1px] border-dashed border-[#494949]">
                <div>Daily Release:</div>
                <div>{formatUnits(order.total_reward, 18, 2)} {order.token_symbol} <span className="text-[#848484]">({formatUnits(order.daily_reward, 18, 2)} {order.token_symbol} / day)</span></div>
              </div>
              <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
                <div>Cliff Unlock:</div>
                <div>{formatUnits(order.price_token, 18, 2)} {order.token_symbol} <span className="text-[#848484]">(In {Math.ceil(order.staked_period / 86400)} days)</span></div>
              </div>
            </div>

            <div className="flex justify-between pt-[20px] px-[60px]">
              <motion.div
                className="w-[168px] h-[47px]"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-full bg-gradient-orange border-none text-black text-[14px] font-bold hover:bg-gradient-orange hover:text-black"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </motion.div>
              <motion.div
                className="w-[168px] h-[47px]"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="submit"
                  className="w-full h-full bg-transparent text-white text-[14px] font-bold border-[1px] border-solid border-[#2C2C2C] rounded-[5px] hover:bg-transparent hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
