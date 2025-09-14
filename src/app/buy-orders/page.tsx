"use client";

import {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight, LayoutList, LayoutGrid, Search} from 'lucide-react';
import { useWeb3Store } from '@/hooks/useWeb3Store';
import {ethers, BrowserProvider, JsonRpcSigner, formatUnits, parseUnits} from "ethers";
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from "framer-motion";
import Header from "@/components/Header";
import MainTop from "@/components/MainTop";
import PostOrderModal from "@/components/PostOrderModal";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {toast} from "sonner";
import { BuyOrderCardArguments, LayoutIconArguments } from "@/interface";

import LogoIcon from "@/assets/images/logo.png";
import EmptyIcon from "@/assets/images/empty.svg";
import {getSalesOrderList} from "@/api/modules";
import GlobalLoading from "@/components/GlobalLoading";
import SkeletonLoader from "@/components/SkeletonLoader";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// 买单数据类型
interface BuyOrder {
  id: string;
  amount: string;
  offerAmount: string;
  currency: string;
  maturityPeriod: number;
  chain: string;
}

// 模拟买单数据
const buyOrders: BuyOrder[] = [
  { id: '1', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '2', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '3', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '4', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '5', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '6', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '7', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '8', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '9', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '10', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '11', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
  { id: '12', amount: '1,000,000', offerAmount: '8000', currency: 'USDT', maturityPeriod: 180, chain: 'Merlin' },
];

const SearchFilters = ({ isGrid, viewChange }: LayoutIconArguments) => (
  <div className="flex items-center justify-end gap-[10px] my-[24px] pr-[15px]">
    <div className="flex border-[1px] border-solid border-[#2C2C2C] rounded-[5px] h-[36px] px-[15px] pt-[10px]">
      {isGrid ? (
        <LayoutGrid className="w-4 h-4 text-[#DEDEDE] cursor-pointer" onClick={() => viewChange(false)} />
      ) : (
        <LayoutList className="w-4 h-4 text-[#DEDEDE] cursor-pointer" onClick={() => viewChange(true)} />
      )}
    </div>
  </div>
)

// 买单卡片组件
const BuyOrderCard = ({ order, type, setOpen, callCancel, callClaimRewards, callClaimPrincipal }: BuyOrderCardArguments) => (
  <motion.div
    className="border border-[#333333] rounded-[16px] p-[40px] hover:border-[#FFA200] transition-colors cursor-pointer"
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
    <div className="flex text-nowrap">
      <div className="w-[90px]">
        <Image src={LogoIcon} alt="" className="size-[57px]"/>
        <div className="mt-[15px] h-[17px] leading-[17px] text-[#848484] text-[14px]">Merlin Chain</div>
        <div className="mt-[5px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.chain}</div>
      </div>

      <div className="ml-[50px] flex-1 space-y-[20PX]">
        <div>
          <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Amount</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.amount}</div>
        </div>

        <div>
          <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Offer Amount</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.offerAmount} {order.currency}</div>
        </div>

        <div>
          <div className="h-[15px] leading-[15px] text-[#848484] text-[12px]">Maturity Period</div>
          <div className="mt-[3px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">
            <span className="text-[16px]">{order.maturityPeriod}</span>
            <span className="text-[#848484] text-[12px] ml-1">Day</span>
          </div>
        </div>
      </div>
    </div>
    {type === "listings" && (
      <div className="mt-[26px] flex space-x-[20px]">
        <Button
          className="h-[37px] pl-[20px] pr-[16px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
          onClick={() => setOpen && setOpen(true)}
        >
          <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Edit</span>
          <ChevronRight className="size-[12px] text-[#F4F4F4]" />
        </Button>
        <Button
          className="h-[37px] pl-[20px] pr-[16px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
          onClick={() => callCancel && callCancel()}
        >
          <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Cancel</span>
          <ChevronRight className="size-[12px] text-[#F4F4F4]" />
        </Button>
      </div>
    )}
    {type === "matches" && (
      <div className="mt-[26px] flex space-x-[20px]">
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
      </div>
    )}
  </motion.div>
);

// 买单列表组件
const BuyOrderList = ({ order, type, setOpen, callCancel, callClaimRewards, callClaimPrincipal }: BuyOrderCardArguments) => (
  <motion.div
    className="border border-[#333333] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors cursor-pointer"
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
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Image src={LogoIcon} alt="" className="size-[57px]"/>
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
          <div>
            <ChevronRight className="size-[24px] text-[#DEDEDE]" />
          </div>
        )}
        {type === "listings" && (
          <>
            <Button
              className="h-[37px] pl-[20px] pr-[16px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
              onClick={() => setOpen && setOpen(true)}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Edit</span>
              <ChevronRight className="size-[12px] text-[#F4F4F4]" />
            </Button>
            <Button
              className="h-[37px] pl-[20px] pr-[16px] border-[1px] border-solid border-[#4C4C4C] bg-[#1C1C1C] rounded-[30px] hover:border-none hover:bg-gradient-orange"
              onClick={() => callCancel && callCancel()}
            >
              <span className="inline-block text-[12px] text-[#F4F4F4] font-bold">Cancel</span>
              <ChevronRight className="size-[12px] text-[#F4F4F4]" />
            </Button>
          </>
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
  </motion.div>
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

const ListEmpty = () => (
  <div className="mt-[140px] flex flex-col items-center">
    <Image src={EmptyIcon} alt="" className="w-[auto] h-[160px]"/>
    <div className="mt-[8px] text-[30px] text-[#272727]">No Orders Found</div>
  </div>
);

export default function BuyOrdersPage() {
  const {isConnected} = useWeb3Store();

  // 全局loading
  const [pageLoading, setPageLoading] = useState(false);
  // 是否以卡片模式显示
  const [gridView, setGridView] = useState(true);
  // 是否显示搜索组件
  const [search] = useState(false);
  // 是否显示分页组件
  const [pagination] = useState(false);
  // 是否显示 Post Buy Order 弹窗
  const [openBuyOrder, setOpenBuyOrder] = useState(false);

  // tabs
  const [tabValue, setTabValue] = useState('all');
  const handleTabChange = (nextValue: string) => {
    if (nextValue !== 'all' && !isConnected) {
      toast("Please connect your wallet first to log in.", { id: 'tabChange' })
      return;
    }
    switch (nextValue) {
      case 'all':
        getAllOrder();
        break;
      case 'listings':
        getListingOrder();
        break;
      case 'matches':
        getMatchesOrder();
        break;
    }
    setTabValue(nextValue);
  };

  const [allOrders, SetAllOrders] = useState<BuyOrder[]>([]);
  const [allListLoading, setAllListLoading] = useState(true);
  const getAllOrder = async () => {
    setAllListLoading(true);
    try {
      const {data} = await getSalesOrderList()
      console.log(data)
      setAllListLoading(false);
    } catch (error) {
      console.log(error)
      setAllListLoading(false);
    }
  }
  useEffect(() => {
    getAllOrder()
  }, [])

  const [listingOrders, SetListingOrders] = useState<BuyOrder[]>([]);
  const [listingListLoading, setListingListLoading] = useState(true);
  const getListingOrder = async () => {
    setListingListLoading(true);
    try {
      const {data} = await getSalesOrderList()
      console.log(data)
      setListingListLoading(false);
    } catch (error) {
      console.log(error)
      setListingListLoading(false);
    }
  }

  const [matchesOrders, SetMatchesOrders] = useState<BuyOrder[]>([]);
  const [matchesListLoading, setMatchesListLoading] = useState(true);
  const getMatchesOrder = async () => {
    setMatchesListLoading(true);
    try {
      const {data} = await getSalesOrderList()
      console.log(data)
      setMatchesListLoading(false);
    } catch (error) {
      console.log(error)
      setMatchesListLoading(false);
    }
  }

  const callCancel = () => {
    setPageLoading(true)
  }

  const callClaimRewards = () => {
    setPageLoading(true)
  }

  const callClaimPrincipal = () => {
    setPageLoading(true)
  }

  return (
    <>
      <GlobalLoading open={pageLoading} />
      <div className="min-h-screen bg-zinc-950 bg-[url(../assets/images/bg.png)] bg-no-repeat bg-[position:bottom_left] bg-full-auto pb-[97px]">
        <Header page="buy-orders" />

        <main className="max-w-[1280px] mx-auto pl-[85px] pr-[80px]">
          <MainTop page="buy-orders" />

          <Tabs.Root value={tabValue} onValueChange={handleTabChange} className="w-full">
            <div className="flex items-center justify-between border-b-[1px] border-solid border-[#424242] pb-[8px]">
              <div className="flex items-center space-x-8">
                <Tabs.List className="flex space-x-[36px]">
                  <Tabs.Trigger
                    value="all"
                    className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-[#DEDEDE] transition-colors"
                  >
                    All Buy Orders
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="listings"
                    className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-[#DEDEDE] transition-colors"
                  >
                    My Listings
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="matches"
                    className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-[#DEDEDE] transition-colors"
                  >
                    My Matches
                  </Tabs.Trigger>
                </Tabs.List>
              </div>

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
                onClick={() => setOpenBuyOrder(true)}
              >
                Post Buy Order
              </motion.button>
            </div>

            <Tabs.Content value="all">
              {allListLoading ? (
                <SkeletonLoader type={gridView ? "card" : "list"} count={9} />
              ) : buyOrders.length > 0 ? (
                <>
                  {search ? (
                    <SearchFilters isGrid={gridView} viewChange={setGridView} />
                  ) : (
                    <div className="h-[38px]"></div>
                  )}
                  {gridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
                      {buyOrders.map((order) => (
                        <BuyOrderCard key={order.id} order={order} type="all"  />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[15px]">
                      {buyOrders.map((order) => (
                        <BuyOrderList key={order.id} order={order} type="all" />
                      ))}
                    </div>
                  )}
                  {pagination && <Pagination />}
                </>
              ) : (
                <ListEmpty />
              )}
            </Tabs.Content>

            <Tabs.Content value="listings">
              {listingListLoading ? (
                <SkeletonLoader type={gridView ? "card" : "list"} count={9} />
              ) : buyOrders.length > 0 ? (
                <>
                  {search ? (
                    <SearchFilters isGrid={gridView} viewChange={setGridView} />
                  ) : (
                    <div className="h-[38px]"></div>
                  )}
                  {gridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
                      {buyOrders.map((order) => (
                        <BuyOrderCard key={order.id} order={order} type="listings" setOpen={setOpenBuyOrder} callCancel={callCancel} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[15px]">
                      {buyOrders.map((order) => (
                        <BuyOrderList key={order.id} order={order} type="listings" setOpen={setOpenBuyOrder} callCancel={callCancel} />
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
              {matchesListLoading ? (
                <SkeletonLoader type={gridView ? "card" : "list"} count={9} />
              ) : buyOrders.length > 0 ? (
                <>
                  {search ? (
                    <SearchFilters isGrid={gridView} viewChange={setGridView} />
                  ) : (
                    <div className="h-[38px]"></div>
                  )}
                  {gridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
                      {buyOrders.map((order) => (
                        <BuyOrderCard key={order.id} order={order} type="matches" callClaimRewards={callClaimRewards} callClaimPrincipal={callClaimPrincipal} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[15px]">
                      {buyOrders.map((order) => (
                        <BuyOrderList key={order.id} order={order} type="matches" callClaimRewards={callClaimRewards} callClaimPrincipal={callClaimPrincipal} />
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
      <PostOrderModal open={openBuyOrder} setOpen={setOpenBuyOrder}/>
    </>
  );
}
