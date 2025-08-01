"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, LayoutList, LayoutGrid } from 'lucide-react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react'
import {ethers, BrowserProvider, JsonRpcSigner, formatUnits, parseUnits} from "ethers";
import * as Tabs from '@radix-ui/react-tabs';
import * as Progress from '@radix-ui/react-progress';
import Header from "@/components/Header";
import InvestModal from "@/components/InvestModal";
import PostSellModal from "@/components/PostSellModal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalLoading from "@/components/GlobalLoading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {getAllSalesOrderList, getSalesOrderList} from "@/api/modules";
import {SalesOrderOptions} from "@/api/interface";
import {LayoutIconArguments, SellOrder, SellOrderCardArguments} from "@/interface";

import MainBg1 from "@/assets/images/main-background-1.png";
import MainBg2 from "@/assets/images/main-background-2.png";
import LinearIcon from "@/assets/images/linear.png";
import UnlockIcon from "@/assets/images/unlock.png";
import DuckIcon from "@/assets/images/duck.png";
import PostOrderModal from "@/components/PostOrderModal";
import EmptyIcon from "@/assets/images/empty.svg";

// 模拟卖单数据
const sellOrders: SellOrder[] = [
  { id: '288366221', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366222', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366223', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366224', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366225', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366226', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366227', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366228', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366229', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366230', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
  { id: '288366231', amount: '1,000,000', offerAmount: '8000', currency: 'DUCK', maturityPeriod: 180, chain: 'Duck' },
];

const SearchFilters = () => (
  <div className="flex items-center justify-end gap-[10px] mt-[24px]">
    <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px] pr-[15px] py-[10px]">
      <Input
        placeholder="Search by token"
        className="w-[108px] h-[16px] pl-[15px] bg-transparent border-none focus-visible:ring-0 shadow-none placeholder:text-[rgba(222,222,222,0.3)]"
      />
      <Search className="size-[16px]" />
    </div>

    <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px]">
      <span className="ml-[15px] mt-[10px] h-[16px] leading-[16px] text-[#DEDEDE] text-[14px] whitespace-nowrap opacity-30">Status</span>
      <Select defaultValue="all">
        <SelectTrigger className="h-[36px] pl-[15px] py-[10px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
          <SelectItem className="px-[15px] py-[12px]" value="all">All</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="active">Active</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="pending">Pending</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px]">
      <span className="ml-[15px] mt-[10px] h-[16px] leading-[16px] text-[#DEDEDE] text-[14px] whitespace-nowrap opacity-30">Sort by</span>
      <Select defaultValue="all">
        <SelectTrigger className="h-[36px] pl-[15px] py-[10px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
          <SelectItem className="px-[15px] py-[12px]" value="all">All</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="active">Active</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="pending">Pending</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px]">
      <Select defaultValue="all">
        <SelectTrigger className="h-[36px] py-[10px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
          <SelectItem className="px-[15px] py-[12px]" value="all">Filter</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="active">Active</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="pending">Pending</SelectItem>
          <SelectItem className="px-[15px] py-[12px]" value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
)

// 卖单卡片组件
const SellOrderCard = ({ order, type, callInvest, callClaimRewards, callClaimPrincipal }: SellOrderCardArguments) => (
  <div className="border border-[#494949] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors">
    <div className="flex flex-col">
      {/* Token Header */}
      <div className="flex justify-between">
        <div className="flex flex-col p-[10px]">
          <Image src={DuckIcon} alt="" className="size-[51px]"/>
          <div className="mt-[15px] h-[15px] leading-[15px] text-[12px] text-[#848484]">DuckChain</div>
          <div className="mt-[2px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.chain}</div>
          <div className="mt-[20px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Older ID ： </div>
          <div className="mt-[5px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.id}</div>
        </div>
        <div className="flex flex-col p-[10px]">
          {type === "all" && (
            <>
              <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Token for Sale</div>
              <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">200 {order.currency}</div>
              <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Ask Amount</div>
              <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">80 USDT / 145 DUCK</div>
            </>
          )}
          {type === "matches" && (
            <>
              <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Total Purchased</div>
              <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">200 {order.currency}</div>
              <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Payment Amount</div>
              <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">80 USDT</div>
            </>
          )}
          <Progress.Root
            className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-[163px] h-[10px]"
            value={30}
          >
            <Progress.Indicator
              className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
              style={{ width: `${30}%` }}
            />
          </Progress.Root>
          <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right pr-[3px]">40/180 Days</div>
        </div>
      </div>

      <div className="mt-[26px] px-[10px]">
        <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Release Breakdown</div>
        <div className="mt-[5px] flex gap-[6px]">
          <div className="p-[3px]">
            <Image src={LinearIcon} alt="" className="size-[12px]"/>
          </div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: 50 DUCK</div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">(0.27/day)</div>
        </div>
        <div className="mt-[5px] flex gap-[6px]">
          <div className="p-[3px]">
            <Image src={UnlockIcon} alt="" className="size-[12px]"/>
          </div>
          <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: 150 DUCK</span>
        </div>
      </div>

      {type === "all" && (
        <Button
          className="ml-[10px] mt-[26px] w-[87px] h-[37px] pl-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
          onClick={() => callInvest && callInvest(order)}
        >
          <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Invest</span>
          <ChevronRight className="size-[12px] text-[#F4F4F4]" />
        </Button>
      )}

      {type === "matches" && (
        <div className="mt-[26px] border-[1px] border-solid border-[#2C2C2C] rounded-[12px] p-[20px] space-y-[26px]">
          <div className="flex justify-between">
            <div>
              <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Unclaimed Rewards</div>
              <div className="mt-[3px] flex items-end">
                <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]">18</span>
                <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">Duck</span>
              </div>
            </div>
            <div
              className="px-[20px] py-[10px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px]"
              onClick={() => callClaimRewards && callClaimRewards()}
            >
              <span className="inline-block h-[15px] leading-[15px] text-[#F4F4F4] text-[12px]">Claim Rewards</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Total Rewards</div>
              <div className="mt-[3px] flex items-end">
                <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]">180</span>
                <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">Duck</span>
              </div>
            </div>
            <div
              className="px-[20px] py-[10px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px]"
              onClick={() => callClaimPrincipal && callClaimPrincipal()}
            >
              <span className="inline-block h-[15px] leading-[15px] text-[#F4F4F4] text-[12px]">Withdraw Principal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)

// 卖单列表组件
const SellOrderList = ({ order, type, callInvest, callClaimRewards, callClaimPrincipal }: SellOrderCardArguments) => (
  <div className="border border-[#494949] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Image src={DuckIcon} alt="" className="size-[57px]"/>
        <div className="ml-[8px]">
          <div className="h-[17px] leading-[17px] text-[#848484] text-[14px]">Merlin Chain</div>
          <div className="mt-[5px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.chain}</div>
        </div>
      </div>

      <div className="flex items-center space-x-[35px]">
        <div>
          <div className="h-[17px] leading-[17px] text-[#848484] text-[14px]">Payment Asset</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.amount}</div>
        </div>

        <div>
          <div className="h-[17px] leading-[17px] text-[#848484] text-[14px]">Amount</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.amount}</div>
        </div>

        <div>
          <div className="h-[17px] leading-[17px] text-[#848484] text-[14px]">Offer Amount</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.offerAmount} {order.currency}</div>
        </div>

        <div>
          <div className="h-[17px] leading-[17px] text-[#848484] text-[14px]">Maturity Period</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">
            <span className="text-[16px]">{order.maturityPeriod}</span>
            <span className="text-[#848484] text-[12px] ml-1">Day</span>
          </div>
        </div>

        {type === "all" && (
          <Button
            className="ml-[10px] mt-[26px] w-[87px] h-[37px] pl-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
            onClick={() => callInvest && callInvest(order)}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Invest</span>
            <ChevronRight className="size-[12px] text-[#F4F4F4]" />
          </Button>
        )}
        {type === "matches" && (
          <>
            <Button
              className="h-[37px] pl-[20px] pr-[16px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
              onClick={() => callClaimRewards && callClaimRewards()}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Claim</span>
              <ChevronRight className="size-[12px] text-[#F4F4F4]" />
            </Button>
            <Button
              className="h-[37px] pl-[20px] pr-[16px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
              onClick={() => callClaimPrincipal && callClaimPrincipal()}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Withdraw</span>
              <ChevronRight className="size-[12px] text-[#F4F4F4]" />
            </Button>
          </>
        )}
      </div>
    </div>
  </div>
);

// 分页组件
const Pagination = () => (
  <div className="flex items-center justify-between px-[15px] mt-[40px]">
    <div className="h-[17x] leading-[17px] text-[#6C7080] text-[14px]">
      52 assets
    </div>

    <div className="flex items-center space-x-2">
      <button className="w-8 h-8 flex items-center justify-center text-[#9295A6] hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex">
        <button className="w-[30px] h-[30px] leading-[30px] flex items-center justify-center text-[#FFA200] rounded text-[16px]">
          1
        </button>
        <button className="w-[30px] h-[30px] leading-[30px] flex items-center justify-center text-[#6C7080] hover:text-white transition-colors text-sm">
          2
        </button>
        <span className="w-[30px] h-[30px] leading-[30px] flex items-center justify-center text-[#6C7080] text-sm">
          ....
        </span>
        <button className="w-[30px] h-[30px] leading-[30px] flex items-center justify-center text-[#6C7080] hover:text-white transition-colors text-sm">
          6
        </button>
      </div>

      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const LayoutIcon = ({ isGrid, viewChange }: LayoutIconArguments) => (
  <div className="h-[38px] flex items-center justify-end">
    {isGrid ? (
      <LayoutGrid className="w-4 h-4 text-[#DEDEDE] cursor-pointer" onClick={() => viewChange(false)} />
    ) : (
      <LayoutList className="w-4 h-4 text-[#DEDEDE] cursor-pointer" onClick={() => viewChange(true)} />
    )}
  </div>
);

const ListEmpty = () => (
  <div className="mt-[140px] flex flex-col items-center">
    <Image src={EmptyIcon} alt="" className="w-[auto] h-[160px]"/>
    <div className="mt-[8px] text-[30px] text-[#272727]">No Orders Found</div>
  </div>
);

export default function SellOrdersPage() {
  const { chainId } = useAppKitNetworkCore();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155')

  const [loading, setLoading] = useState(false);
  const [viewSell, setViewSell] = useState(true);
  const [tabValue, setTabValue] = useState('all');
  const [openSell, setOpenSell] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState<SellOrder | null>(null);

  const [postSell] = useState(false);
  const [pagination] = useState(false);

  const [allOrders, SetAllOrders] = useState<SalesOrderOptions[]>([]);
  const [matchesOrders, SetMatchesOrders] = useState<SalesOrderOptions[]>([]);

  const handleTabChange = (nextValue: string) => {
    if (nextValue === 'matches') {
      if (!address) {
        toast("请先登录", { id: 'matches' })
        return;
      }
      getMatchesOrders()
    }
    setTabValue(nextValue);
  };

  const getAllOrder = async () => {
    setLoading(true);
    try {
      const {data} = await getAllSalesOrderList()
      console.log(data)
      SetAllOrders(data)
      setLoading(false);
    } catch (e) {
      console.log(e)
      setLoading(false);
    }
  };

  const getMatchesOrders = async () => {
    setLoading(true);
    try {
      const {data} = await getSalesOrderList()
      console.log(data)
      SetMatchesOrders(data)
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  const callClaimRewards = async () => {
    if (!address) {
      toast("请先登录", { id: 'matches' })
      return;
    }

    // 合约地址
    const contractAddress = '0xYourContractAddress'
    const abi = [
      {
        "type": "function",
        "name": "claimRewards",
        "inputs": [
          {
            "name": "_shareID",
            "type": "uint256",
            "internalType": "uint256"
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
    const _shareID = BigInt(1)

    // 调用合约方法
    const tx = await contract.claimRewards(_shareID)

    console.log('正在等待交易确认...', tx.hash)
    await tx.wait()
    console.log('交易已确认')
  }

  const callClaimPrincipal = async () => {
    if (!address) {
      toast("请先登录", { id: 'matches' })
      return;
    }

    // 合约地址
    const contractAddress = '0xYourContractAddress'
    const abi = [
      {
        "type": "function",
        "name": "claimPrincipal",
        "inputs": [
          {
            "name": "_shareID",
            "type": "uint256",
            "internalType": "uint256"
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
    const _shareID = BigInt(1)

    // 调用合约方法
    const tx = await contract.claimPrincipal(_shareID)

    console.log('正在等待交易确认...', tx.hash)
    await tx.wait()
    console.log('交易已确认')
  }

  useEffect(() => {
    getAllOrder()
  }, [])

  return (
    <>
      <GlobalLoading open={loading} />
      <div className="min-h-screen bg-zinc-950 bg-[url(../assets/images/bg.png)] bg-no-repeat bg-[position:bottom_left] bg-full-auto pb-[97px]">
        <Header page="sell-orders" />

        <main className="max-w-[1280px] mx-auto px-[82px] relative">
          <Image src={MainBg1} alt="" className="w-[592px] h-[169px] absolute top-0 right-[157px]"/>
          <Image src={MainBg2} alt="" className="w-[239px] h-[227px] absolute top-[13px] right-[190px]"/>
          {/* 标题区域 */}
          <div className="pt-[35px]">
            <h1 className="h-[67px] leading-[67px] text-[55px] font-bold text-[#B2B2B2]">
              <span>Dual-Sided</span>
            </h1>
            <h1 className="h-[67px] leading-[67px] text-[55px] font-bold text-[#B2B2B2]">
              <span className="bg-gradient-orange bg-clip-text text-transparent">OTC</span> <span>Matching System</span>
            </h1>
          </div>

          <div className="mt-[71px] h-[44px] leading-[44px] text-[36px] font-bold">Sell Orders</div>

          {/* Buy Orders 区域 */}
          <div className="mt-[15px]">
            <Tabs.Root value={tabValue} onValueChange={handleTabChange} className="w-full">
              <div className="flex items-center justify-between border-b-[1px] border-solid border-[#424242] pb-[10px]">
                <div className="flex items-center space-x-8">
                  <Tabs.List className="flex space-x-[36px]">
                    <Tabs.Trigger
                      value="all"
                      className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-white transition-colors"
                    >
                      All Sell Orders
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="matches"
                      className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-white transition-colors"
                    >
                      My Matches
                    </Tabs.Trigger>
                  </Tabs.List>
                </div>

                {postSell && (
                  <button
                    className="bg-gradient-orange text-white text-[14px] px-[15px] py-[10px] rounded-[5px] font-bold transition-colors"
                    onClick={() => {setOpenSell(true)}}
                  >
                    Post Sell Order
                  </button>
                )}
              </div>

              <Tabs.Content value="all">
                {allOrders.length > 0 ? (
                  <>
                    <SearchFilters/>
                    <LayoutIcon isGrid={viewSell} viewChange={setViewSell} />
                    {viewSell ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                        {sellOrders.map((order) => (
                          <SellOrderCard
                            key={order.id}
                            order={order}
                            type="all"
                            callInvest={(order: SellOrder) => {
                              setOrderInfo(order)
                              setOpen(true)
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[15px]">
                        {sellOrders.map((order) => (
                          <SellOrderList
                            key={order.id}
                            order={order}
                            type="all"
                            callInvest={(order: SellOrder) => {
                              setOrderInfo(order)
                              setOpen(true)
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {pagination && <Pagination />}
                  </>
                ) : (
                  <ListEmpty />
                )}
              </Tabs.Content>

              <Tabs.Content value="matches">
                {matchesOrders.length > 0 ? (
                  <>
                    <LayoutIcon isGrid={viewSell} viewChange={setViewSell} />
                    <SearchFilters/>
                    {viewSell ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                        {sellOrders.map((order) => (
                          <SellOrderCard key={order.id} order={order} type="matches" callClaimRewards={callClaimRewards} callClaimPrincipal={callClaimPrincipal} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[15px]">
                        {sellOrders.map((order) => (
                          <SellOrderList key={order.id} order={order} type="matches" callClaimRewards={callClaimRewards} callClaimPrincipal={callClaimPrincipal} />
                        ))}
                      </div>
                    )}
                    {pagination && <Pagination />}
                  </>
                ) : (
                  <ListEmpty />
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </main>
      </div>
      <PostSellModal open={openSell} setOpen={setOpenSell}/>
      {orderInfo && <InvestModal order={orderInfo} open={open} setOpen={setOpen}/>}
    </>
  );
}
