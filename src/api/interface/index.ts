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
}
