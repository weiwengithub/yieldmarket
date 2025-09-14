// Request response parameters (excluding data)
export interface Result {
  code: string;
  msg: string;
}

// Request response parameters (including data)
export interface ResultData<T = any> extends Result {
  data: T;
}

// paging response parameters
export interface ResPage<T> {
  list: T[];
  current: number;
  pageSize: number;
  total: number;
}

export interface ResAuthInfo {
  id: string;
  auth_info: string;
}

export interface ReqAuthSignature {
  id: string;
  signature: string;
  addr: string;
}

export interface ResAuthSignature {
  token: string;
}

export interface SalesOrderOptions {
  deal_id: number;
  subscription_id: number;
  stakecore_address: string;
  stake_id: number;
  start_time: number;
  end_time: number;
  staked_period: number;
  apy: string;
  total_reward: string;
  daily_reward: string;
  total_principal: string;
  price_token: string;
  price_usdt: string;
  min_price_usdt: string;
  allow_partial_purchase: boolean;
  remaining_unsold_principal: string;
  remaining_unsold_reward: string;
  token_symbol: string;
  token_name: string;
  token_address: string;
  subscription_address: string;
  chain_name: string;
  usdt_address: string;
  remaining_unsold_price_token: string;
  remaining_unsold_price_usdt: string;
  staked_period_day: number;
  event_time_day: number;
  project_log: string;
  tokenDecimals: number;
  usdtDecimals: number;
}

export interface reqSubscribe {
  stake_id: number;
  subscription_id: number;
  sender: string;
  owner: string;
  amount: string;
}

export interface resSubscribe {
  granted_reward: string;
  granted_principal: string;
  signature: string;
  nonce: number;
  epoch_issued: string;
  epoch_valid_until: string;
  action: string;
}

export interface MyOrderOptions {
  chain_name: string;
  chain_id: number;
  project_name: string;
  project_logo: string;
  token_name: string;
  token_address: string;
  subscription_id?: number;
  subscription_address?: string;
  sharecore_id?: number;
  sharecore_address?: string;
  share_id: number;
  granted_reward: string;
  claimed_reward: string;
  claimable_reward: string;
  granted_principal: string;
  claimed_principal: string;
  claimable_principal: string;
  deposited_token?: string;
  deposited_usdt?: string;
  daily_reward: string;
  start_time: number;
  end_time: number;
  staked_period: number;
  staked_period_day: number;
  event_time_day: number;
  tokenDecimals: number;
  usdtDecimals: number;
  supportClaim: boolean;
  supportWithdraw: boolean;
}

export interface SharecoreOrderOptions {
  chain_name: string;
  project_name: string;
  project_logo: string;
  token_name: string;
  token_address: string;
  sharecore_id: number;
  sharecore_address: string;
  share_id: number;
  granted_reward: string;
  claimed_reward: string;
  claimable_reward: string;
  granted_principal: string;
  claimed_principal: string;
  claimable_principal: string;
  daily_reward: string;
  start_time: number;
  end_time: number;
  staked_period: number;
}

export interface reqTokenInfo {
  chain_name: string;
  address?: string;
}

export interface resTokenInfo {
  chain_name: string;
  address?: string;
  name?: string;
  symbol?: string;
  decimals: number;
}
