"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, LayoutList, LayoutGrid } from 'lucide-react';
import { useWeb3Store } from '@/hooks/useWeb3Store';
import * as Tabs from '@radix-ui/react-tabs';
import * as Progress from '@radix-ui/react-progress';
import { motion } from "framer-motion";
import Header from "@/components/Header";
import MainTop from "@/components/MainTop";
import InvestModal from "@/components/InvestModal";
import PostSellModal from "@/components/PostSellModal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalLoading from "@/components/GlobalLoading";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  getAllSalesOrderList,
  getSalesOrderList,
  getPurchaseOrderList,
  getSharecoreOrderList,
  getTokenInfo,
  getUsdtInfo
} from "@/api/modules";
import {SalesOrderOptions, MyOrderOptions} from "@/api/interface";
import {LayoutIconArguments, SellOrderCardArguments, MatchesOrderCardArguments, ShareCoreOrderCardArguments} from "@/interface";
import {formatUnits, divide, minus, truncateDecimals, times, gt, lt} from "@/lib/numbers";

import LinearIcon from "@/assets/images/linear.png";
import UnlockIcon from "@/assets/images/unlock.png";
import DuckIcon from "@/assets/images/duck.png";
import PostOrderModal from "@/components/PostOrderModal";
import EmptyIcon from "@/assets/images/empty.svg";
import defaultLogo from "@/assets/images/default-logo.png";

const SearchFilters = ({ isGrid, viewChange }: LayoutIconArguments) => {
  // 是否显示搜索组件
  const [search] = useState(true);
  return (
    <div className="flex items-center justify-end gap-[10px] my-[24px]">
      {/*<div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px] pr-[15px] py-[10px]">*/}
      {/*  <Input*/}
      {/*    placeholder="Search by token"*/}
      {/*    className="w-[108px] h-[16px] pl-[15px] bg-transparent border-none focus-visible:ring-0 shadow-none placeholder:text-[rgba(222,222,222,0.3)]"*/}
      {/*  />*/}
      {/*  <Search className="size-[16px]" />*/}
      {/*</div>*/}
      {/*<div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px]">*/}
      {/*  <span className="ml-[15px] mt-[10px] h-[16px] leading-[16px] text-[#DEDEDE] text-[14px] whitespace-nowrap opacity-30">Status</span>*/}
      {/*  <Select defaultValue="all">*/}
      {/*    <SelectTrigger className="h-[36px] pl-[15px] py-[10px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">*/}
      {/*      <SelectValue />*/}
      {/*    </SelectTrigger>*/}
      {/*    <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="all">All</SelectItem>*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="active">Active</SelectItem>*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="pending">Pending</SelectItem>*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="completed">Completed</SelectItem>*/}
      {/*    </SelectContent>*/}
      {/*  </Select>*/}
      {/*</div>*/}
      {/*<div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px]">*/}
      {/*  <span className="ml-[15px] mt-[10px] h-[16px] leading-[16px] text-[#DEDEDE] text-[14px] whitespace-nowrap opacity-30">Sort by</span>*/}
      {/*  <Select defaultValue="all">*/}
      {/*    <SelectTrigger className="h-[36px] pl-[15px] py-[10px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">*/}
      {/*      <SelectValue />*/}
      {/*    </SelectTrigger>*/}
      {/*    <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="all">All</SelectItem>*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="active">Active</SelectItem>*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="pending">Pending</SelectItem>*/}
      {/*      <SelectItem className="px-[15px] py-[12px]" value="completed">Completed</SelectItem>*/}
      {/*    </SelectContent>*/}
      {/*  </Select>*/}
      {/*</div>*/}

      <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px]">
        <Select defaultValue="all">
          <SelectTrigger className="h-[36px] py-[10px] bg-transparent text-[#DEDEDE] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
            <SelectItem className="px-[15px] py-[12px]" value="all">eth-sepolia</SelectItem>
            <SelectItem className="px-[15px] py-[12px]" value="active">eth-main</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px] h-[36px] px-[15px] pt-[10px]">
        {isGrid ? (
          <LayoutGrid className="w-4 h-4 text-[#DEDEDE] cursor-pointer" onClick={() => viewChange(false)} />
        ) : (
          <LayoutList className="w-4 h-4 text-[#DEDEDE] cursor-pointer" onClick={() => viewChange(true)} />
        )}
      </div>
    </div>
  )
}

// 卖单卡片组件
const SellOrderCard = ({ order, isConnected, callInvest }: SellOrderCardArguments) => {
  const progress = parseFloat(truncateDecimals(100 * parseFloat(divide(order.event_time_day, order.staked_period_day)), 2))

  return (
    <motion.div
      className="border border-[#333333] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors relative overflow-hidden"
      whileHover={{
        scale: 1.02,
        borderColor: '#FFA200',
        boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-[114px] flex-initial flex flex-col p-[10px]">
            {order.project_log ? (
              <Image src={order.project_log} alt="" className="size-[51px]"/>
            ) : (
              <div className="size-[51px] border border-[#333333] rounded-[16px]">
                <Image src={defaultLogo} alt="" className="size-full"/>
              </div>
            )}
            <div className="mt-[15px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Chain Name</div>
            <div className="mt-[2px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold whitespace-nowrap">{order.chain_name}</div>
            <div className="mt-[20px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Older ID ：</div>
            <div className="mt-[5px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.deal_id}</div>
          </div>
          <div className="ml-[30px] flex-1 flex flex-col p-[10px] text-nowrap">
            <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Token for Sale</div>
            <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">{formatUnits(order.remaining_unsold_principal, order.tokenDecimals, 2)} {order.token_symbol}</div>
            <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Ask Amount</div>
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.remaining_unsold_price_usdt, order.usdtDecimals, 2)} USDT</div>
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">or {formatUnits(order.remaining_unsold_price_token, order.tokenDecimals, 2)} {order.token_symbol}</div>
            <Progress.Root
              className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-full h-[10px]"
              value={progress}
            >
              <Progress.Indicator
                className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </Progress.Root>
            <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right">{order.event_time_day} / {order.staked_period_day} days</div>
          </div>
        </div>

        <div className="mt-[26px] px-[10px]">
          <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Release Breakdown</div>
          <div className="mt-[5px] flex flex-nowrap gap-[5px]">
            <div className="p-[3px]">
              <Image src={LinearIcon} alt="" className="size-[12px]"/>
            </div>
            <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: {formatUnits(order.remaining_unsold_reward, order.tokenDecimals, 2)} {order.token_symbol}</div>
            <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">({formatUnits(order.daily_reward, order.tokenDecimals, 2)}/day)</div>
          </div>
          <div className="mt-[5px] flex flex-nowrap gap-[5px]">
            <div className="p-[3px]">
              <Image src={UnlockIcon} alt="" className="size-[12px]"/>
            </div>
            <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: {formatUnits(order.remaining_unsold_principal, order.tokenDecimals, 2)} {order.token_symbol}</span>
          </div>
        </div>

        {isConnected && (
          <Button
            className={`ml-[10px] mt-[26px] w-[87px] h-[37px] pl-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] ${order.remaining_unsold_principal === "0" ? "cursor-no-drop" : "hover:border-none hover:bg-gradient-orange"}`}
            onClick={() => callInvest && callInvest(order)}
            disabled={order.remaining_unsold_principal === "0"}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Invest</span>
            <ChevronRight className="size-[12px] text-[#F4F4F4]" />
          </Button>
        )}
      </div>
      {order.remaining_unsold_principal === "0" && (
        <div className="absolute top-0 right-0 size-[88px]">
          <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Order Completed Corner">
            <path d="M44 0H14.5L44 29.5V0Z" fill="#FFA200"/>
            <path d="M27.5 15.8l3.4 3.6L38 12" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  )
}

// 卖单列表组件
const SellOrderList = ({ order, isConnected, callInvest }: SellOrderCardArguments) => {
  const progress = parseFloat(truncateDecimals(100 * parseFloat(divide(order.event_time_day, order.staked_period_day)), 2))

  return (
    <motion.div
      className="flex border border-[#333333] rounded-[16px] px-[10px] py-[20px] hover:border-[#FFA200] transition-colors cursor-pointer"
      whileHover={{
        scale: 1.01,
        borderColor: '#FFA200',
        boxShadow: '0 4px 15px rgba(255, 162, 0, 0.1)'
      }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {order.project_log ? (
        <Image src={order.project_log} alt="" className="size-[51px]"/>
      ) : (
        <div className="size-[51px] border border-[#333333] rounded-[16px]">
          <Image src={defaultLogo} alt="" className="size-full"/>
        </div>
      )}
      <div className="ml-[15px]">
        <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Chain Name</div>
        <div className="mt-[2px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-bold">{order.chain_name}</div>
      </div>
      <div className="ml-[20px]">
        <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Older ID ：</div>
        <div className="mt-[5px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-bold">{order.deal_id}</div>
      </div>
      <div className="ml-[40px]">
        <div className="h-[17px] leading-[17px] text-[#848484] text-[14px]">Token for Sale</div>
        <div className="mt-[5px] h-[29px] leading-[29px] text-[#DEDEDE] text-[24px] font-semibold">{formatUnits(order.remaining_unsold_principal, order.tokenDecimals, 2)} {order.token_symbol}</div>
      </div>
      <div className="ml-[50px] flex-1">
        <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Ask Amount</div>
        <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold text-nowrap">{formatUnits(order.remaining_unsold_price_usdt, order.usdtDecimals, 2)} USDT / {formatUnits(order.remaining_unsold_price_token, order.tokenDecimals, 2)} {order.token_symbol}</div>
        <Progress.Root
          className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-full h-[10px]"
          value={progress}
        >
          <Progress.Indicator
            className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </Progress.Root>
        <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right">{order.event_time_day} / {order.staked_period_day} Days</div>
      </div>
      <div className="ml-[40px] w-[310px] text-nowrap">
        <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Release Breakdown</div>
        <div className="mt-[5px] flex flex-nowrap gap-[5px]">
          <div className="p-[3px]">
            <Image src={LinearIcon} alt="" className="size-[12px]"/>
          </div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: {formatUnits(order.remaining_unsold_reward, order.tokenDecimals, 2)} {order.token_symbol}</div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">({formatUnits(order.daily_reward, order.tokenDecimals, 2)}/day)</div>
        </div>
        <div className="mt-[5px] flex flex-nowrap gap-[5px]">
          <div className="p-[3px]">
            <Image src={UnlockIcon} alt="" className="size-[12px]"/>
          </div>
          <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: {formatUnits(order.remaining_unsold_principal, order.tokenDecimals, 2)} {order.token_symbol}</span>
        </div>
      </div>
      {isConnected && (
        <div className="w-[117px] flex flex-col items-end">
          <Button
            className="w-[87px] h-[37px] pl-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
            onClick={() => callInvest && callInvest(order)}
            disabled={order.remaining_unsold_principal === "0"}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Invest</span>
            <ChevronRight className="size-[12px] text-[#F4F4F4]" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// My SubOrder 卡片组件
const SubOrderCard = ({ order, callClaimRewards, callClaimPrincipal }: MatchesOrderCardArguments) => {
  const progress = parseFloat(truncateDecimals(100 * parseFloat(divide(order.event_time_day, order.staked_period_day)), 2))

  return (
    <motion.div
      className="border border-[#333333] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors relative overflow-hidden"
      whileHover={{
        scale: 1.02,
        borderColor: '#FFA200',
        boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-[114px] flex-initial flex flex-col p-[10px]">
            {order.project_logo ? (
              <img src={order.project_logo} alt="" className="size-[51px]"/>
            ) : (
              <div className="size-[51px] border border-[#333333] rounded-[16px]">
                <Image src={defaultLogo} alt="" className="size-full"/>
              </div>
            )}
            <div className="mt-[15px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Project Name</div>
            <div className="mt-[2px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold whitespace-nowrap">{order.project_name}</div>
            <div className="mt-[20px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Share ID ：</div>
            <div className="mt-[5px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.share_id}</div>
          </div>
          <div className="ml-[30px] flex-1 flex flex-col p-[10px] text-nowrap">
            <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Total Purchased</div>
            <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">{formatUnits(order.granted_principal, order.tokenDecimals, 2)}</div>
            <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Payment Amount</div>
            {order.deposited_token && parseFloat(order.deposited_token) > 0 && (
              <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.deposited_token, order.tokenDecimals, 2)} {order.token_name}</div>
            )}
            {order.deposited_usdt && parseFloat(order.deposited_usdt) > 0 && (
              <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.deposited_usdt, order.usdtDecimals, 2)} USDT</div>
            )}
            <Progress.Root
              className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-full h-[10px]"
              value={progress}
            >
              <Progress.Indicator
                className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </Progress.Root>
            <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right">{order.event_time_day}/{order.staked_period_day} Days</div>
          </div>
        </div>

        <div className="mt-[26px] px-[10px]">
          <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Release Breakdown</div>
          <div className="mt-[5px] flex flex-nowrap gap-[5px]">
            <div className="p-[3px]">
              <Image src={LinearIcon} alt="" className="size-[12px]"/>
            </div>
            <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: {formatUnits(order.granted_reward, order.tokenDecimals, 2)} {order.token_name}</div>
            <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">({formatUnits(order.daily_reward, order.tokenDecimals, 2)}/day)</div>
          </div>
          <div className="mt-[5px] flex flex-nowrap gap-[5px]">
            <div className="p-[3px]">
              <Image src={UnlockIcon} alt="" className="size-[12px]"/>
            </div>
            <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: {formatUnits(order.granted_principal, order.tokenDecimals, 2)} {order.token_name}</span>
          </div>
        </div>

        <div className="mt-[26px] border-[1px] border-solid border-[#2C2C2C] rounded-[12px] p-[20px] space-y-[26px]">
          <div className="flex justify-between">
            <div>
              <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Unclaimed Rewards</div>
              <div className="mt-[3px] flex items-end">
                <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_reward, order.tokenDecimals, 2)}</span>
                <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
              </div>
            </div>
            <Button
              className={`h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] ${order.supportClaim ? "hover:border-none hover:bg-gradient-orange" : "cursor-no-drop"}`}
              onClick={() => callClaimRewards && callClaimRewards(order)}
              disabled={!order.supportClaim}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Claim Rewards</span>
            </Button>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Total Rewards</div>
              <div className="mt-[3px] flex items-end">
                <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_principal, order.tokenDecimals, 2)}</span>
                <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
              </div>
            </div>
            <Button
              className={`h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] ${order.supportWithdraw ? "hover:border-none hover:bg-gradient-orange" : "cursor-no-drop"}`}
              onClick={() => callClaimPrincipal && callClaimPrincipal(order)}
              disabled={!order.supportWithdraw}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Withdraw Principal</span>
            </Button>
          </div>
        </div>
      </div>
      {!order.supportClaim && !order.supportWithdraw && (
        <div className="absolute top-0 right-0 size-[88px]">
          <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Order Completed Corner">
            <path d="M44 0H14.5L44 29.5V0Z" fill="#FFA200"/>
            <path d="M27.5 15.8l3.4 3.6L38 12" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  )
}

// My SubOrder 列表组件
const SubOrderList = ({ order, callClaimRewards, callClaimPrincipal }: MatchesOrderCardArguments) => {
  const progress = parseFloat(truncateDecimals(100 * parseFloat(divide(order.event_time_day, order.staked_period_day)), 2))

  return (
    <motion.div
      className="flex border border-[#333333] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors"
      whileHover={{
        scale: 1.01,
        borderColor: '#FFA200',
        boxShadow: '0 4px 15px rgba(255, 162, 0, 0.1)'
      }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 flex">
        <div className="w-[114px] flex-initial flex flex-col p-[10px]">
          {order.project_logo ? (
            <img src={order.project_logo} alt="" className="size-[51px]"/>
          ) : (
            <div className="size-[51px] border border-[#333333] rounded-[16px]">
              <Image src={defaultLogo} alt="" className="size-full"/>
            </div>
          )}
          <div className="mt-[15px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Project Name</div>
          <div className="mt-[2px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.project_name}</div>
          <div className="mt-[20px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Share ID ：</div>
          <div className="mt-[5px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.share_id}</div>
        </div>
        <div className="ml-[30px] flex-1 flex flex-col p-[10px] text-nowrap">
          <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Total Purchased</div>
          <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">{formatUnits(order.granted_principal, order.tokenDecimals, 2)}</div>
          <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Payment Amount</div>
          {order.deposited_token && parseFloat(order.deposited_token) > 0 && (
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.deposited_token, order.tokenDecimals, 2)} {order.token_name}</div>
          )}
          {order.deposited_usdt && parseFloat(order.deposited_usdt) > 0 && (
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.deposited_usdt, order.usdtDecimals, 2)} USDT</div>
          )}
          <Progress.Root
            className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-full h-[10px]"
            value={progress}
          >
            <Progress.Indicator
              className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </Progress.Root>
          <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right">{order.event_time_day}/{order.staked_period_day} Days</div>
        </div>
      </div>

      <div className="ml-[24px] w-[310px] p-[10px]">
        <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Release Breakdown</div>
        <div className="mt-[5px] flex flex-nowrap gap-[5px]">
          <div className="p-[3px]">
            <Image src={LinearIcon} alt="" className="size-[12px]"/>
          </div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: {formatUnits(order.granted_reward, order.tokenDecimals, 2)} {order.token_name}</div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">({formatUnits(order.daily_reward, order.tokenDecimals, 2)}/day)</div>
        </div>
        <div className="mt-[5px] flex flex-nowrap gap-[5px]">
          <div className="p-[3px]">
            <Image src={UnlockIcon} alt="" className="size-[12px]"/>
          </div>
          <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: {formatUnits(order.granted_principal, order.tokenDecimals, 2)} {order.token_name}</span>
        </div>
      </div>

      <div className="ml-[24px] w-[330px] border-[1px] border-solid border-[#2C2C2C] rounded-[12px] p-[20px] space-y-[26px]">
        <div className="flex justify-between">
          <div>
            <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Unclaimed Rewards</div>
            <div className="mt-[3px] flex items-end">
              <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_reward, order.tokenDecimals, 2)}</span>
              <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
            </div>
          </div>
          <Button
            className="h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
            onClick={() => callClaimRewards && callClaimRewards(order)}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Claim Rewards</span>
          </Button>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Total Rewards</div>
            <div className="mt-[3px] flex items-end">
              <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_principal, order.tokenDecimals, 2)}</span>
              <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
            </div>
          </div>
          <Button
            className="h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
            onClick={() => callClaimPrincipal && callClaimPrincipal(order)}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Withdraw Principal</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
};

// My Share Order 卡片组件
const ShareOrderCard = ({ order, callClaimRewards, callClaimPrincipal }: MatchesOrderCardArguments) => {
  const progress = parseFloat(truncateDecimals(100 * parseFloat(divide(order.event_time_day, order.staked_period_day)), 2))

  return (
    <motion.div
      className="border border-[#333333] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors relative overflow-hidden"
      whileHover={{
        scale: 1.02,
        borderColor: '#FFA200',
        boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-[114px] flex-initial flex flex-col p-[10px]">
            {order.project_logo ? (
              <img src={order.project_logo} alt="" className="size-[51px]"/>
            ) : (
              <div className="size-[51px] border border-[#333333] rounded-[16px]">
                <Image src={defaultLogo} alt="" className="size-full"/>
              </div>
            )}
            <div className="mt-[15px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Project Name</div>
            <div className="mt-[2px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold whitespace-nowrap">{order.project_name}</div>
            <div className="mt-[20px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Share ID ：</div>
            <div className="mt-[5px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.share_id}</div>
          </div>
          <div className="ml-[30px] flex-1 flex flex-col p-[10px] text-nowrap">
            <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Total Purchased</div>
            <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">{formatUnits(order.granted_principal, order.tokenDecimals, 2)}</div>
            <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Total Reward</div>
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.granted_reward, order.tokenDecimals, 2)} {order.token_name}</div>
            <Progress.Root
              className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-full h-[10px]"
              value={progress}
            >
              <Progress.Indicator
                className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </Progress.Root>
            <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right">{order.event_time_day}/{order.staked_period_day} Days</div>
          </div>
        </div>

        <div className="mt-[26px] px-[10px]">
          <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Release Breakdown</div>
          <div className="mt-[5px] flex flex-nowrap gap-[5px]">
            <div className="p-[3px]">
              <Image src={LinearIcon} alt="" className="size-[12px]"/>
            </div>
            <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: {formatUnits(order.granted_reward, order.tokenDecimals, 2)} {order.token_name}</div>
            <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">({formatUnits(order.daily_reward, order.tokenDecimals, 2)}/day)</div>
          </div>
          <div className="mt-[5px] flex flex-nowrap gap-[5px]">
            <div className="p-[3px]">
              <Image src={UnlockIcon} alt="" className="size-[12px]"/>
            </div>
            <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: {formatUnits(order.granted_principal, order.tokenDecimals, 2)} {order.token_name}</span>
          </div>
        </div>

        <div className="mt-[26px] border-[1px] border-solid border-[#2C2C2C] rounded-[12px] p-[20px] space-y-[26px]">
          <div className="flex justify-between">
            <div>
              <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Unclaimed Rewards</div>
              <div className="mt-[3px] flex items-end">
                <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_reward, order.tokenDecimals, 2)}</span>
                <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
              </div>
            </div>
            <Button
              className={`h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] ${order.supportClaim ? "hover:border-none hover:bg-gradient-orange" : "cursor-no-drop"}`}
              onClick={() => callClaimRewards && callClaimRewards(order)}
              disabled={!order.supportClaim}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Claim Rewards</span>
            </Button>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Total Rewards</div>
              <div className="mt-[3px] flex items-end">
                <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_principal, order.tokenDecimals, 2)}</span>
                <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
              </div>
            </div>
            <Button
              className={`h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] ${order.supportWithdraw ? "hover:border-none hover:bg-gradient-orange" : "cursor-no-drop"}`}
              onClick={() => callClaimPrincipal && callClaimPrincipal(order)}
              disabled={!order.supportWithdraw}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Withdraw Principal</span>
            </Button>
          </div>
        </div>
      </div>
      {!order.supportClaim && !order.supportWithdraw && (
        <div className="absolute top-0 right-0 size-[88px]">
          <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Order Completed Corner">
            <path d="M44 0H14.5L44 29.5V0Z" fill="#FFA200"/>
            <path d="M27.5 15.8l3.4 3.6L38 12" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  )
}

// My Share Order 列表组件
const ShareOrderList = ({ order, callClaimRewards, callClaimPrincipal }: MatchesOrderCardArguments) => {
  const progress = parseFloat(truncateDecimals(100 * parseFloat(divide(order.event_time_day, order.staked_period_day)), 2))

  return (
    <motion.div
      className="flex border border-[#333333] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors"
      whileHover={{
        scale: 1.01,
        borderColor: '#FFA200',
        boxShadow: '0 4px 15px rgba(255, 162, 0, 0.1)'
      }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 flex">
        <div className="w-[114px] flex-initial flex flex-col p-[10px]">
          {order.project_logo ? (
            <img src={order.project_logo} alt="" className="size-[51px]"/>
          ) : (
            <div className="size-[51px] border border-[#333333] rounded-[16px]">
              <Image src={defaultLogo} alt="" className="size-full"/>
            </div>
          )}
          <div className="mt-[15px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Project Name</div>
          <div className="mt-[2px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.project_name}</div>
          <div className="mt-[20px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Share ID ：</div>
          <div className="mt-[5px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-bold">{order.share_id}</div>
        </div>
        <div className="ml-[30px] flex-1 flex flex-col p-[10px] text-nowrap">
          <div className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Total Purchased</div>
          <div className="mt-[5px] h-[29px] leading-[29px] text-[24px] text-[#DEDEDE] font-semibold">{formatUnits(order.granted_principal, order.tokenDecimals, 2)}</div>
          <div className="mt-[25px] h-[15px] leading-[15px] text-[12px] text-[#848484]">Payment Amount</div>
          {order.deposited_token && parseFloat(order.deposited_token) > 0 && (
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.deposited_token, order.tokenDecimals, 2)} {order.token_name}</div>
          )}
          {order.deposited_usdt && parseFloat(order.deposited_usdt) > 0 && (
            <div className="mt-[3px] h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.deposited_usdt, order.usdtDecimals, 2)} USDT</div>
          )}
          <Progress.Root
            className="mt-[25px] relative overflow-hidden bg-[#303030] rounded-[30px] w-full h-[10px]"
            value={progress}
          >
            <Progress.Indicator
              className="bg-gradient-orange h-full rounded-[30px] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </Progress.Root>
          <div className="mt-[5px] h-[15px] leading-[15px] text-[12px] text-[#848484] text-right">{order.event_time_day}/{order.staked_period_day} Days</div>
        </div>
      </div>

      <div className="ml-[24px] w-[310px] p-[10px]">
        <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Release Breakdown</div>
        <div className="mt-[5px] flex flex-nowrap gap-[5px]">
          <div className="p-[3px]">
            <Image src={LinearIcon} alt="" className="size-[12px]"/>
          </div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Daily Release: {formatUnits(order.granted_reward, order.tokenDecimals, 2)} {order.token_name}</div>
          <div className="h-[18px] leading-[18px] text-[14px] text-[#848484]">({formatUnits(order.daily_reward, order.tokenDecimals, 2)}/day)</div>
        </div>
        <div className="mt-[5px] flex flex-nowrap gap-[5px]">
          <div className="p-[3px]">
            <Image src={UnlockIcon} alt="" className="size-[12px]"/>
          </div>
          <span className="h-[18px] leading-[18px] text-[14px] text-[#DEDEDE]">Cliff Unlock: {formatUnits(order.granted_principal, order.tokenDecimals, 2)} {order.token_name}</span>
        </div>
      </div>

      <div className="ml-[24px] w-[330px] border-[1px] border-solid border-[#2C2C2C] rounded-[12px] p-[20px] space-y-[26px]">
        <div className="flex justify-between">
          <div>
            <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Unclaimed Rewards</div>
            <div className="mt-[3px] flex items-end">
              <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_reward, order.tokenDecimals, 2)}</span>
              <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
            </div>
          </div>
          <Button
            className="h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
            onClick={() => callClaimRewards && callClaimRewards(order)}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Claim Rewards</span>
          </Button>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="h-[15px] leading-[15px] text-[12px] text-[#848484]">Total Rewards</div>
            <div className="mt-[3px] flex items-end">
              <span className="inline-block h-[19px] leading-[19px] text-[16px] text-[#DEDEDE] font-semibold">{formatUnits(order.claimable_principal, order.tokenDecimals, 2)}</span>
              <span className="ml-1 inline-block h-[16px] leading-[16px] text-[12px] text-[#848484]">{order.token_name}</span>
            </div>
          </div>
          <Button
            className="h-[35px] px-[20px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
            onClick={() => callClaimPrincipal && callClaimPrincipal(order)}
          >
            <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Withdraw Principal</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
};

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

const ListEmpty = () => (
  <div className="mt-[140px] flex flex-col items-center">
    <Image src={EmptyIcon} alt="" className="w-[auto] h-[160px]"/>
    <div className="mt-[8px] text-[30px] text-[#272727]">No Orders Found</div>
  </div>
);

export default function SellOrdersPage() {
  const {isConnected, account, chainId, switchNetwork, callContract, sendTransaction} = useWeb3Store();

  // 全局loading
  const [pageLoading, setPageLoading] = useState(false);
  // 是否以卡片模式显示
  const [gridView, setGridView] = useState(true);
  // 是否显示 Post Sell Order 按钮
  const [postSell] = useState(false);
  // 是否显示分页组件
  const [pagination] = useState(false);
  // 是否显示 Post Sell Order 弹窗
  const [openSell, setOpenSell] = useState(false);
  // 是否显示 Invest 弹窗
  const [openInvest, setOpenInvest] = useState(false);
  // Invest 弹窗显示的数据
  const [investInfo, setInvestInfo] = useState<SalesOrderOptions | null>(null);

  // tabs
  const [tabValue, setTabValue] = useState('all');
  const handleTabChange = (nextValue: string) => {
    if (nextValue !== 'all' && !isConnected) {
      toast("Please connect your wallet first to log in.", { id: 'tabChange' })
      return;
    }
    switch (nextValue) {
      case 'all':
        if (isConnected) {
          getSellOrders();
        } else {
          getAllOrder();
        }
        break;
      case 'subOrder':
        getPurchaseOrder();
        break;
      case 'shareOrder':
        getShareCoreOrder();
        break;
    }
    setTabValue(nextValue);
  };

  const decimalsMaps: Record<string, number> = {};
  const usdtDecimalsMaps: Record<string, number> = {};

  const getDecimals = async (chain_name: string, address?: string) => {
    if (address) {
      const {data} = await getTokenInfo({ chain_name, address });
      decimalsMaps[address] = data.decimals;
    } else {
      const {data} = await getUsdtInfo({ chain_name });
      usdtDecimalsMaps[chain_name] = data.decimals;
    }
  }

  const createLimiter = (limit = 6) => {
    let running = 0;
    const queue: Array<() => void> = [];
    const runNext = () => {
      if (running >= limit || queue.length === 0) return;
      running++;
      const fn = queue.shift()!;
      fn();
    };
    return (task: () => Promise<any>) =>
      new Promise<any>((resolve, reject) => {
        const exec = () => {
          task().then(resolve, reject).finally(() => {
            running--;
            runNext();
          });
        };
        queue.push(exec);
        runNext();
      });
  }

  // 计算每个元素的权重：越大越靠前
  const getPriority = (item: MyOrderOptions) => {
    if (item.supportClaim && item.supportWithdraw) return 2;
    if (item.supportClaim || item.supportWithdraw) return 1;
    return 0;
  }

  const fetchShareholderInfosForOrders = async (orders: MyOrderOptions[]) => {
    if (!isConnected) {
      toast("Please connect your wallet first to log in.", { id: 'matches' })
      return orders;
    }
    // 1) 按 chain_id 分组，减少切网
    const groupByChain = orders.reduce((acc, o) => {
      const id = o.chain_id;
      (acc[id] ||= []).push(o);
      return acc;
    }, {} as Record<number, any[]>);

    const limiter = createLimiter(8); // 并发度按你的 RPC 限流调
    const merged: any[] = [];
    const abi = [
      {
        "type": "function",
        "name": "getShareholderInfo",
        "inputs": [
          {
            "internalType": "address",
            "name": "_shareholder",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "shareID",
            "type": "uint256"
          }
        ],
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "shareID",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "grantedReward",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "claimedReward",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "grantedPrincipal",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "claimedPrincipal",
                "type": "uint256"
              }
            ],
            "internalType": "struct ShareCore.ShareholderInfo",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view"
      }
    ]
    for (const idStr of Object.keys(groupByChain)) {
      const id = Number(idStr);
      if (chainId !== id) {
        try { await switchNetwork(id); } catch (e) { console.warn('Failed to switch networks', id, e); }
      }

      // 当前链上的订单
      const bucket = groupByChain[id];

      // 2) 受控并发请求
      const tasks = bucket.map(o => limiter(async () => {
        try {
          const contractAddress = o.subscription_address || o.sharecore_address as string;
          const _shareID = BigInt(o.share_id)
          const res = await callContract(
            contractAddress,
            abi,
            'getShareholderInfo',
            [account, _shareID],
          );
          o.granted_reward = res.grantedReward;
          o.claimed_reward = res.claimedReward;
          o.claimable_reward = minus(res.grantedReward, res.claimedReward);
          o.granted_principal = res.grantedPrincipal;
          o.claimed_principal = res.claimedPrincipal;
          o.claimable_principal = minus(res.grantedPrincipal, res.claimedPrincipal);
          // 判断是否支持Claim 和 Withdraw
          o.supportClaim = gt(o.claimable_reward, 0);
          o.supportWithdraw = gt(o.claimable_principal, 0);
          o.deposited_token = o.granted_principal
          return o;
        } catch (e) {
          console.error('getShareholderInfo failed =>', o.share_id, e);
          return { ...o, shareholderInfoError: String((e as any)?.message || e) };
        }
      }));
      const done = await Promise.all(tasks);
      merged.push(...done);
    }
    return merged;
  }

  // All Sell Orders
  const [sellOrders, SetSellOrders] = useState<SalesOrderOptions[]>([]);
  const [sellListLoading, setSellListLoading] = useState(true);
  const getAllOrder = async () => {
    setSellListLoading(true);
    try {
      const {data} = await getAllSalesOrderList()
      for (let i = 0; i < data.length; i++) {
        const order = data[i];
        // 获取token及usdt的精度，用于后续计算
        const chainName = order.chain_name;
        const tokenAddress = order.token_address;
        if (!decimalsMaps[tokenAddress]) {
          await getDecimals(chainName, tokenAddress)
        }
        if (!usdtDecimalsMaps[chainName]) {
          await getDecimals(chainName)
        }
        const tokenDecimals = decimalsMaps[tokenAddress];
        const usdtDecimals = usdtDecimalsMaps[chainName];
        order.tokenDecimals = tokenDecimals;
        order.usdtDecimals = usdtDecimals;

        // 计算剩余未认购本金以token计价的价格和以usdt计价的价格。当以usdt计价的价格小于以usdt计价的最小价格时，取以usdt计价的最小价格
        const remainingProportion = divide(order.remaining_unsold_principal, order.total_principal);
        order.remaining_unsold_price_token = times(order.price_token, remainingProportion);
        if (lt(order.price_usdt, order.min_price_usdt)) {
          order.remaining_unsold_price_usdt = times(order.min_price_usdt, remainingProportion);
        } else {
          order.remaining_unsold_price_usdt = times(order.price_usdt, remainingProportion);
        }

        // 计算订单的质押周期,不足24H按1天计算
        order.staked_period_day = Math.ceil(order.staked_period / 86400)
        // 计算订单已质押的天数,未到质押结束时间时，每24H计为一天
        const now = Date.now();
        const start = 1000 * order.start_time;
        const end = 1000 * order.end_time;
        if (now < start) {
          order.event_time_day = 0;
        } else if (now > end) {
          order.event_time_day = order.staked_period_day;
        } else {
          order.event_time_day = Math.floor((now - start) / 86400000);
        }
      }
      // 已认购完的订单排后边
      data.sort((a, b) => gt(a.remaining_unsold_principal, b.remaining_unsold_principal) ? -1 : 1);
      SetSellOrders(data)
      setSellListLoading(false);
    } catch (e) {
      console.log(e)
      setSellListLoading(false);
    }
  };
  const getSellOrders = async () => {
    setSellListLoading(true);
    try {
      const {data} = await getSalesOrderList()
      for (let i = 0; i < data.length; i++) {
        const order = data[i];
        // 获取token及usdt的精度，用于后续计算
        const chainName = order.chain_name;
        const tokenAddress = order.token_address;
        if (!decimalsMaps[tokenAddress]) {
          await getDecimals(chainName, tokenAddress)
        }
        if (!usdtDecimalsMaps[chainName]) {
          await getDecimals(chainName)
        }
        const tokenDecimals = decimalsMaps[tokenAddress];
        const usdtDecimals = usdtDecimalsMaps[chainName];
        order.tokenDecimals = tokenDecimals;
        order.usdtDecimals = usdtDecimals;

        // 计算剩余未认购本金以token计价的价格和以usdt计价的价格。当以usdt计价的价格小于以usdt计价的最小价格时，取以usdt计价的最小价格
        const remainingProportion = divide(order.remaining_unsold_principal, order.total_principal);
        order.remaining_unsold_price_token = times(order.price_token, remainingProportion);
        if (lt(order.price_usdt, order.min_price_usdt)) {
          order.remaining_unsold_price_usdt = times(order.min_price_usdt, remainingProportion);
        } else {
          order.remaining_unsold_price_usdt = times(order.price_usdt, remainingProportion);
        }

        // 计算订单的质押周期,不足24H按1天计算
        order.staked_period_day = Math.ceil(order.staked_period / 86400)
        // 计算订单已质押的天数,未到质押结束时间时，每24H计为一天
        const now = Date.now();
        const start = 1000 * order.start_time;
        const end = 1000 * order.end_time;
        if (now < start) {
          order.event_time_day = 0;
        } else if (now > end) {
          order.event_time_day = order.staked_period_day;
        } else {
          order.event_time_day = Math.floor((now - start) / 86400000);
        }
      }
      // 已认购完的订单排后边
      data.sort((a, b) => gt(a.remaining_unsold_principal, b.remaining_unsold_principal) ? -1 : 1);
      SetSellOrders(data)
      setSellListLoading(false);
    } catch (error) {
      console.log(error)
      setSellListLoading(false);
    }
  }
  useEffect(() => {
    if (isConnected) {
      getSellOrders()
    } else {
      if (tabValue !== 'all') setTabValue('all')
      getAllOrder()
    }
  }, [isConnected]);

  // My SubOrder
  const [subOrders, SetSubOrders] = useState<MyOrderOptions[]>([]);
  const [subOrderLoading, setSubOrderLoading] = useState(true);
  const getPurchaseOrder = async () => {
    setSubOrderLoading(true);
    try {
      const response = await getPurchaseOrderList()
      for (let i = 0; i < response.data.length; i++) {
        const order = response.data[i];
        // 获取token及usdt的精度，用于后续计算
        const chainName = order.chain_name;
        const tokenAddress = order.token_address;
        if (!decimalsMaps[tokenAddress]) {
          await getDecimals(chainName, tokenAddress)
        }
        if (!usdtDecimalsMaps[chainName]) {
          await getDecimals(chainName)
        }
        const tokenDecimals = decimalsMaps[tokenAddress];
        const usdtDecimals = usdtDecimalsMaps[chainName];
        order.tokenDecimals = tokenDecimals;
        order.usdtDecimals = usdtDecimals;

        // 计算订单的质押周期,不足24H按1天计算
        order.staked_period_day = Math.ceil(order.staked_period / 86400)
        // 计算订单已质押的天数,未到质押结束时间时，每24H计为一天
        const now = Date.now();
        const start = 1000 * order.start_time;
        const end = 1000 * order.end_time;
        if (now < start) {
          order.event_time_day = 0;
        } else if (now > end) {
          order.event_time_day = order.staked_period_day;
        } else {
          order.event_time_day = Math.floor((now - start) / 86400000);
        }
      }
      // 拉详情并合并
      const list = await fetchShareholderInfosForOrders(response.data);
      list.sort((a, b) => getPriority(b) - getPriority(a));
      SetSubOrders(list)
      setSubOrderLoading(false);
    } catch (error) {
      console.log(error)
      setSubOrderLoading(false);
    }
  }

  // My Share Order
  const [shareOrders, SetShareOrders] = useState<MyOrderOptions[]>([]);
  const [shareOrderLoading, setShareOrderLoading] = useState(true);
  const getShareCoreOrder = async () => {
    setShareOrderLoading(true);
    try {
      const response = await getSharecoreOrderList()
      for (let i = 0; i < response.data.length; i++) {
        const order = response.data[i];
        // 获取token及usdt的精度，用于后续计算
        const chainName = order.chain_name;
        const tokenAddress = order.token_address;
        if (!decimalsMaps[tokenAddress]) {
          await getDecimals(chainName, tokenAddress)
        }
        if (!usdtDecimalsMaps[chainName]) {
          await getDecimals(chainName)
        }
        const tokenDecimals = decimalsMaps[tokenAddress];
        const usdtDecimals = usdtDecimalsMaps[chainName];
        order.tokenDecimals = tokenDecimals;
        order.usdtDecimals = usdtDecimals;

        // 计算订单的质押周期,不足24H按1天计算
        order.staked_period_day = Math.ceil(order.staked_period / 86400)
        // 计算订单已质押的天数,未到质押结束时间时，每24H计为一天
        const now = Date.now();
        const start = 1000 * order.start_time;
        const end = 1000 * order.end_time;
        if (now < start) {
          order.event_time_day = 0;
        } else if (now > end) {
          order.event_time_day = order.staked_period_day;
        } else {
          order.event_time_day = Math.floor((now - start) / 86400000);
        }
      }
      // 拉详情并合并
      const list = await fetchShareholderInfosForOrders(response.data);
      list.sort((a, b) => getPriority(b) - getPriority(a));
      SetShareOrders(list)
      setShareOrderLoading(false);
    } catch (error) {
      console.log(error)
      setShareOrderLoading(false);
    }
  }

  // Claim Rewards
  const callClaimRewards = async (order: MyOrderOptions) => {
    if (!isConnected) {
      toast("Please connect your wallet first to log in.", { id: 'matches' })
      return;
    }
    setPageLoading(true);
    try {
      if (chainId !== order.chain_id) {
        await switchNetwork(order.chain_id)
      }
      // 合约地址
      const contractAddress = order.subscription_address || order.sharecore_address as string;
      const _shareID = BigInt(order.share_id)
      const stakeAbi = [
        {
          "type": "function",
          "name": "ClaimStakeRewards",
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
      const receipt1 = await sendTransaction(
        contractAddress,
        stakeAbi,
        'ClaimStakeRewards',
        [_shareID],
      );

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
      const receipt = await sendTransaction(
        contractAddress,
        abi,
        'claimRewards',
        [_shareID],
      );
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
    }
  }

  // Withdraw Principal
  const callClaimPrincipal = async (order: MyOrderOptions) => {
    if (!isConnected) {
      toast("Please connect your wallet first to log in.", { id: 'matches' })
      return;
    }
    setPageLoading(true);
    try {
      if (chainId !== order.chain_id) {
        await switchNetwork(order.chain_id)
      }
      // 合约地址
      const contractAddress = order.subscription_address || order.sharecore_address as string;
      const _shareID = BigInt(order.share_id)
      const stakeAbi = [
        {
          "type": "function",
          "name": "ClaimStakePrincipal",
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
      const receipt1 = await sendTransaction(
        contractAddress,
        stakeAbi,
        'ClaimStakePrincipal',
        [_shareID],
      );
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
      const receipt = await sendTransaction(
        contractAddress,
        abi,
        'claimPrincipal',
        [_shareID],
      );
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
    }
  }

  return (
    <>
      <GlobalLoading open={pageLoading} />
      <div className="min-h-screen bg-zinc-950 bg-[url(../assets/images/bg.png)] bg-no-repeat bg-[position:bottom_left] bg-full-auto pb-[97px]">
        <Header page="sell-orders" />

        <main className="max-w-[1280px] mx-auto pl-[85px] pr-[80px]">
          <MainTop page="sell-orders" />

          <Tabs.Root value={tabValue} onValueChange={handleTabChange} className="w-full">
            <div className="flex items-center justify-between border-b-[1px] border-solid border-[#424242] pb-[8px]">
              <div className="flex items-center space-x-8">
                <Tabs.List className="flex space-x-[36px]">
                  <Tabs.Trigger
                    value="all"
                    className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-[#DEDEDE] transition-colors"
                  >
                    All Sell Orders
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="subOrder"
                    className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-[#DEDEDE] transition-colors"
                  >
                    My SubOrder
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="shareOrder"
                    className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-[#DEDEDE] transition-colors"
                  >
                    My Share Order
                  </Tabs.Trigger>
                </Tabs.List>
              </div>

              {postSell && (
                <motion.button
                  className="bg-gradient-orange text-[#FFF3F3] text-[14px] px-[14px] py-[8px] rounded-[5px] font-bold transition-colors"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {setOpenSell(true)}}
                >
                  Post Sell Order
                </motion.button>
              )}
            </div>

            <Tabs.Content value="all">
              <SearchFilters isGrid={gridView} viewChange={setGridView} />
              {sellListLoading ? (
                <SkeletonLoader type={gridView ? "card" : "list"} count={9} />
              ) : sellOrders.length > 0 ? (
                <>
                  {gridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[8px] gap-y-[10px]">
                      {sellOrders.map((order) => (
                        <SellOrderCard
                          key={order.deal_id}
                          order={order}
                          isConnected={isConnected}
                          callInvest={(order) => {
                            setInvestInfo(order)
                            setOpenInvest(true)
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[10px]">
                      {sellOrders.map((order) => (
                        <SellOrderList
                          key={order.deal_id}
                          order={order}
                          isConnected={isConnected}
                          callInvest={(order) => {
                            setInvestInfo(order)
                            setOpenInvest(true)
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

            <Tabs.Content value="subOrder">
              <SearchFilters isGrid={gridView} viewChange={setGridView} />
              {subOrderLoading ? (
                <SkeletonLoader type={gridView ? "card" : "list"} count={9} />
              ) : subOrders.length > 0 ? (
                <>
                  {gridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[8px] gap-y-[10px]">
                      {subOrders.map((order) => (
                        <SubOrderCard
                          key={`${order.subscription_id}_${order.share_id}`}
                          order={order}
                          callClaimRewards={callClaimRewards}
                          callClaimPrincipal={callClaimPrincipal}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[10px]">
                      {subOrders.map((order) => (
                        <SubOrderList
                          key={`${order.subscription_id}_${order.share_id}`}
                          order={order}
                          callClaimRewards={callClaimRewards}
                          callClaimPrincipal={callClaimPrincipal}
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

            <Tabs.Content value="shareOrder">
              <SearchFilters isGrid={gridView} viewChange={setGridView} />
              {shareOrderLoading ? (
                <SkeletonLoader type={gridView ? "card" : "list"} count={9} />
              ) : shareOrders.length > 0 ? (
                <>
                  {gridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[8px] gap-y-[10px]">
                      {shareOrders.map((order) => (
                        <ShareOrderCard
                          key={`${order.subscription_id}_${order.share_id}`}
                          order={order}
                          callClaimRewards={callClaimRewards}
                          callClaimPrincipal={callClaimPrincipal}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[10px]">
                      {shareOrders.map((order) => (
                        <ShareOrderList
                          key={`${order.subscription_id}_${order.share_id}`}
                          order={order}
                          callClaimRewards={callClaimRewards}
                          callClaimPrincipal={callClaimPrincipal}
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
          </Tabs.Root>
        </main>
      </div>
      <PostSellModal open={openSell} setOpen={setOpenSell}/>
      {investInfo && <InvestModal order={investInfo} open={openInvest} setOpen={setOpenInvest}/>}
    </>
  );
}
