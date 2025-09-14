import {SalesOrderOptions, MyOrderOptions} from "@/api/interface";

export interface SellOrderCardArguments {
  order: SalesOrderOptions;
  isConnected: boolean;
  callInvest: (order: SalesOrderOptions) => void;
}

export interface MatchesOrderCardArguments {
  order: MyOrderOptions;
  callClaimRewards: (order: MyOrderOptions) => void;
  callClaimPrincipal: (order: MyOrderOptions) => void;
}

export interface ShareCoreOrderCardArguments {
  order: MyOrderOptions;
  callClaimRewards: (order: MyOrderOptions) => void;
  callClaimPrincipal: (order: MyOrderOptions) => void;
}

export interface InvestModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: SalesOrderOptions;
}

export interface PostSellModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface BuyOrder {
  id: string;
  amount: string;
  offerAmount: string;
  currency: string;
  maturityPeriod: number;
  chain: string;
}

export interface BuyOrderCardArguments {
  order: BuyOrder;
  type: string;
  setOpen?: (open: boolean) => void;
  callCancel?: () => void;
  callClaimRewards?: () => void;
  callClaimPrincipal?: () => void;
}

export interface PostOrderModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  order?: BuyOrder;
}

export interface LayoutIconArguments {
  isGrid: boolean;
  viewChange: (isGrid: boolean) => void;
}
