"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, LayoutList, LayoutGrid } from 'lucide-react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react'
import {ethers, BrowserProvider, JsonRpcSigner, formatUnits, parseUnits} from "ethers";
import * as Tabs from '@radix-ui/react-tabs';
import Header from "@/components/Header";
import PostOrderModal from "@/components/PostOrderModal";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {toast} from "sonner";
import { BuyOrderCardArguments, LayoutIconArguments } from "@/interface";

import MainBg1 from "@/assets/images/main-background-1.png";
import MainBg2 from "@/assets/images/main-background-2.png";
import LogoIcon from "@/assets/images/logo.png";
import EmptyIcon from "@/assets/images/empty.svg";
import {getSalesOrderList} from "@/api/modules";
import GlobalLoading from "@/components/GlobalLoading";

// 买单数据类型
interface BuyOrder {
  id: string;
  amount: string;
  offerAmount: string;
  currency: string;
  maturityPeriod: number;
  chain: string;
}

// 买单卡片组件
const BuyOrderCard = ({ order, type, setOpen, callCancel, callClaimRewards, callClaimPrincipal }: BuyOrderCardArguments) => (
  <div className="border border-[#494949] rounded-[16px] p-[40px] hover:border-[#FFA200] transition-colors">
    <div className="flex items-start space-x-[50px]">
      <div>
        <Image src={LogoIcon} alt="" className="size-[57px]"/>
        <div className="mt-[15px] h-[17px] leading-[17px] text-[#848484] text-[14px]">Merlin Chain</div>
        <div className="mt-[5px] h-[19px] leading-[19px] text-[#DEDEDE] text-[16px] font-semibold">{order.chain}</div>
      </div>

      <div className="flex-1 space-y-[20PX]">
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
    <div className="mt-[26px] flex space-x-[20px]">
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
);

// 买单列表组件
const BuyOrderList = ({ order, type, setOpen, callCancel, callClaimRewards, callClaimPrincipal }: BuyOrderCardArguments) => (
  <div className="border border-[#494949] rounded-[16px] p-[20px] hover:border-[#FFA200] transition-colors">
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
  <div className="h-[38px] flex items-center justify-end pr-[15px]">
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

export default function BuyOrdersPage() {
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // 是否以卡片形式显示
  const [viewSell, setViewSell] = useState(true);
  const [tabValue, setTabValue] = useState('all');

  const handleTabChange = (nextValue: string) => {
    if (nextValue === 'listings' || nextValue === 'matches') {
      if (!address) {
        toast("请先登录", { id: 'tabChange' })
        return;
      }
    }
    setTabValue(nextValue);
  };

  const [allOrders, SetAllOrders] = useState<BuyOrder[]>([]);
  const [listingOrders, SetListingOrders] = useState<BuyOrder[]>([]);
  const [matchesOrders, SetMatchesOrders] = useState<BuyOrder[]>([]);

  const searchAction = async () => {
    setLoading(true);
    try {
      const {data} = await getSalesOrderList()
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  const callCancel = () => {}

  const callClaimRewards = () => {}

  const callClaimPrincipal = () => {}

  return (
    <>
      <GlobalLoading open={loading} />
      <div className="min-h-screen bg-zinc-950 bg-[url(../assets/images/bg.png)] bg-no-repeat bg-[position:bottom_left] bg-full-auto pb-[97px]">
        <Header page="buy-orders" />

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

          {/* Buy Orders 区域 */}
          <div className="mt-[71px] h-[44px] leading-[44px] text-[36px] font-bold">Buy Orders</div>
          <div className="mt-[15px]">
            <Tabs.Root value={tabValue} onValueChange={handleTabChange} className="w-full">
              <div className="flex items-center justify-between border-b-[1px] border-solid border-[#424242] pb-[10px]">
                <div className="flex items-center space-x-8">
                  <Tabs.List className="flex space-x-[36px]">
                    <Tabs.Trigger
                      value="all"
                      className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-white transition-colors"
                    >
                      All Buy Orders
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="listings"
                      className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-white transition-colors"
                    >
                      My Listings
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="matches"
                      className="text-[16px] font-medium data-[state=active]:text-[#ffa200] data-[state=inactive]:text-white transition-colors"
                    >
                      My Matches
                    </Tabs.Trigger>
                  </Tabs.List>
                </div>

                <button
                  className="bg-gradient-orange text-white text-[14px] px-[15px] py-[10px] rounded-[5px] font-bold transition-colors"
                  onClick={() => setOpen(true)}
                >
                  Post Buy Order
                </button>
              </div>

              <Tabs.Content value="all">
                {allOrders.length > 0 ? (
                  <>
                    <LayoutIcon isGrid={viewSell} viewChange={setViewSell} />
                    {viewSell ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
                        {allOrders.map((order) => (
                          <BuyOrderCard key={order.id} order={order} type="all"  />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[15px]">
                        {allOrders.map((order) => (
                          <BuyOrderList key={order.id} order={order} type="all" />
                        ))}
                      </div>
                    )}

                    {/* 分页 */}
                    <Pagination />
                  </>
                ) : (
                  <ListEmpty />
                )}
              </Tabs.Content>

              <Tabs.Content value="listings">
                {listingOrders.length > 0 ? (
                  <>
                    <LayoutIcon isGrid={viewSell} viewChange={setViewSell} />
                    {viewSell ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
                        {listingOrders.map((order) => (
                          <BuyOrderCard key={order.id} order={order} type="listings" setOpen={setOpen} callCancel={callCancel} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[15px]">
                        {listingOrders.map((order) => (
                          <BuyOrderList key={order.id} order={order} type="listings" setOpen={setOpen} callCancel={callCancel} />
                        ))}
                      </div>
                    )}
                    {/* 分页 */}
                    <Pagination />
                  </>
                ) : (
                  <ListEmpty />
                )}
              </Tabs.Content>

              <Tabs.Content value="matches">
                {matchesOrders.length > 0 ? (
                  <>
                    <LayoutIcon isGrid={viewSell} viewChange={setViewSell} />
                    {viewSell ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
                        {matchesOrders.map((order) => (
                          <BuyOrderCard key={order.id} order={order} type="matches" callClaimRewards={callClaimRewards} callClaimPrincipal={callClaimPrincipal} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[15px]">
                        {matchesOrders.map((order) => (
                          <BuyOrderList key={order.id} order={order} type="matches" callClaimRewards={callClaimRewards} callClaimPrincipal={callClaimPrincipal} />
                        ))}
                      </div>
                    )}
                    {/* 分页 */}
                    <Pagination />
                  </>
                ) : (
                  <ListEmpty />
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </main>
      </div>
      <PostOrderModal open={open} setOpen={setOpen}/>
    </>
  );
}
