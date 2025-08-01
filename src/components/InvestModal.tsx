"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvestModalProps } from "@/interface";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {type Provider, useAppKitAccount, useAppKitNetworkCore, useAppKitProvider} from "@reown/appkit/react";
import {ethers, BrowserProvider, JsonRpcSigner, formatUnits, parseUnits} from "ethers";
import {toast} from "sonner";

export default function InvestModal({ order, open, setOpen }: InvestModalProps) {
  const { chainId } = useAppKitNetworkCore();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155')

  const [step, setStep] = useState(0);

  const [selectValue, setSelectValue] = useState("USDT");

  // 合约地址
  const contractAddress = '0xYourContractAddress'

  const callSubscribeByUSDT = async () => {
    if (!address) {
      toast("请先登录", { id: 'matches' })
      return;
    }

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

    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);

    const contract = new ethers.Contract(contractAddress, abi, signer)

    // 构造参数
    const _owner = await signer.getAddress()
    const _shareID = BigInt(1)
    const amount = parseUnits('10', 18)
    const _grantedReward = parseUnits('2', 18)
    const _grantedPrincipal = parseUnits('5', 18)

    // 模拟构造 struct 参数（根据实际结构赋值）
    const vc = {
      nonce: 123,
      epochIssued: 1650000000,
      epochValidUntil: 1659999999,
      action: '0x12345678' // bytes4
    }

    const signature = '0x...' // 后端签名得到的 bytes

    const sc = {
      vc,
      signature
    }

    // 调用合约方法
    const tx = await contract.subscribeByUSDT(
      _owner,
      _shareID,
      amount,
      _grantedReward,
      _grantedPrincipal,
      sc
    )

    console.log('正在等待交易确认...', tx.hash)
    await tx.wait()
    console.log('交易已确认')
  }

  const callSubscribeByToken = async () => {
    if (!address) {
      toast("请先登录", { id: 'matches' })
      return;
    }

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

    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);

    const contract = new ethers.Contract(contractAddress, abi, signer)

    // 构造参数
    const _owner = await signer.getAddress()
    const _shareID = BigInt(1)
    const amount = parseUnits('10', 18)
    const _grantedReward = parseUnits('2', 18)
    const _grantedPrincipal = parseUnits('5', 18)

    // 模拟构造 struct 参数（根据实际结构赋值）
    const vc = {
      nonce: 123,
      epochIssued: 1650000000,
      epochValidUntil: 1659999999,
      action: '0x12345678' // bytes4
    }

    const signature = '0x...' // 后端签名得到的 bytes

    const sc = {
      vc,
      signature
    }

    // 调用合约方法
    const tx = await contract.subscribeByToken(
      _owner,
      _shareID,
      amount,
      _grantedReward,
      _grantedPrincipal,
      sc
    )

    console.log('正在等待交易确认...', tx.hash)
    await tx.wait()
    console.log('交易已确认')
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
                  <SelectItem className="px-[15px] py-[12px]" value={order.currency}>{order.currency}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="px-[12px]">
            <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
              <div>Purchase Percentage</div>
              <div>{5 * step}%</div>
            </div>
            <div className="mt-[10px] h-[16px] relative">
              <div className="pt-[5px] px-[8px] w-full flex">
                {Array.from({ length: 20 }).map((_, index) => (
                  <>
                    {index === 0 ? (
                      <div className={`h-[6px] flex-1 rounded-l-[30px] ${step > 0 ? "bg-[#FFA200]" : "bg-[#848484]"}`}></div>
                    ) : index === 19 ? (
                      <div className={`h-[6px] flex-1 rounded-r-[30px] ${step > 19 ? "bg-[#FFA200]" : "bg-[#848484]"}`}></div>
                    ) : (
                      <div className={`h-[6px] flex-1 ${step > index ? "bg-[#FFA200]" : "bg-[#848484]"}`}></div>
                    )}
                  </>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full flex items-center justify-between">
                {Array.from({ length: 21 }).map((_, index) => (
                  <>
                    {index > 0 ? (
                      <>
                        {index%5 === 0 ? (
                          <div className={`size-[16px] rounded-[30px] cursor-pointer ${step >= index ? "bg-[#FFA200]" : "bg-[#848484]"}`} onClick={() => setStep(index)}></div>
                        ) : (
                          <div className={`mx-[2px] size-[12px] rounded-[30px] cursor-pointer ${step >= index ? "bg-[#FFA200]" : "bg-[#848484]"}`} onClick={() => setStep(index)}></div>
                        )}
                      </>
                    ) : (
                      <div className={`size-[16px] rounded-[30px] cursor-pointer ${step > 0 ? "bg-[#FFA200]" : "bg-[#848484]"}`} onClick={() => setStep(0)}></div>
                    )}
                  </>
                ))}
              </div>
            </div>
            <div className="mt-[10px] flex justify-between">
              {Array.from({ length: 21 }).map((_, index) => (
                <>
                  {index%5 === 0 && (
                    <div className={`w-[16px] h-[19px] ${index > 0 ? "flex" : ""}  ${index === 20 ? "justify-end" : "justify-center"}`}>
                      <div className="h-[19px] leading-[19px] text-[16px] text-[#848484]">{5*index}%</div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>

          <div className="px-[12px] space-y-[20px]">
            <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
              <div>You will pay:</div>
              <div>58.00 {selectValue}</div>
            </div>
            <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
              <div>You will receive:</div>
              <div>80 {order.currency}</div>
            </div>
            <div className="h-[39px] pt-[20px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between border-t-[1px] border-dashed border-[#494949]">
              <div>Daily Release:</div>
              <div>15 {order.currency} <span className="text-[#848484]">(0.27 {order.currency} / day)</span></div>
            </div>
            <div className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]] flex justify-between">
              <div>Cliff Unlock:</div>
              <div>65 {selectValue} <span className="text-[#848484]">(In 139 days)</span></div>
            </div>
          </div>

          <div className="flex justify-between pt-[20px] px-[60px]">
            <Button
              type="button"
              variant="outline"
              className="w-[168px] h-[47px] bg-gradient-orange border-none text-black text-[14px] font-bold hover:bg-gradient-orange hover:text-black"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              type="submit"
              className="w-[168px] h-[47px] bg-transparent text-white text-[14px] font-bold border-[1px] border-solid border-[#2C2C2C] rounded-[5px] hover:bg-transparent hover:text-white"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
