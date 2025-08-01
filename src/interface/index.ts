export interface SellOrder {
  id: string;
  amount: string;
  offerAmount: string;
  currency: string;
  maturityPeriod: number;
  chain: string;
}

export interface SellOrderCardArguments {
  order: SellOrder;
  type: string;
  callInvest?: (order: SellOrder) => void;
  callClaimRewards?: () => void;
  callClaimPrincipal?: () => void;
}

export interface InvestModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: SellOrder;
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
