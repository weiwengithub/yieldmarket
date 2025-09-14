import {
  ResAuthInfo,
  ReqAuthSignature,
  ResAuthSignature,
  SalesOrderOptions,
  reqSubscribe,
  resSubscribe,
  MyOrderOptions,
  reqTokenInfo,
  resTokenInfo
} from "@/api/interface";
import http from "@/api";

// 获取验证信息
export const getAuthInfo = () => {
  return http.post<ResAuthInfo>('/app/v1/rpc/login/get_auth_info');
};

// 验证签名
export const authSignature = (params: ReqAuthSignature) => {
  return http.post<ResAuthSignature>('/app/v1/rpc/login/auth_signature', params);
};

// 所有售卖订单列表
export const getAllSalesOrderList = () => {
  return http.post<SalesOrderOptions[]>('/app/v1/rpc/project/get_all_sales_order_list');
};

// 销售订单列表
export const getSalesOrderList = () => {
  return http.post<SalesOrderOptions[]>('/app/v1/rpc/project/get_sales_order_list', undefined, {headers: {needToken: true}});
};

// 通过token认购
export const subscribeByToken = (params: reqSubscribe) => {
  return http.post<resSubscribe>('/app/v1/rpc/sign/subscribe_by_token', params, {headers: {needToken: true}});
};

// 通过usdt认购
export const subscribeByUsdt = (params: reqSubscribe) => {
  return http.post<resSubscribe>('/app/v1/rpc/sign/subscribe_by_usdt', params, {headers: {needToken: true}});
};

// 已购买订单列表
export const getPurchaseOrderList = () => {
  return http.post<MyOrderOptions[]>('/app/v1/rpc/project/get_purchase_order_list', undefined, {headers: {needToken: true}});
};

// sharecore订单列表
export const getSharecoreOrderList = () => {
  return http.post<MyOrderOptions[]>('/app/v1/rpc/project/get_sharecore_order_list', undefined, {headers: {needToken: true}});
};

// 获取代币信息
export const getTokenInfo = (params: reqTokenInfo) => {
  return http.post<resTokenInfo>('/app/v1/rpc/chain/get_token_info', params);
};

// 获取USDT信息
export const getUsdtInfo = (params: reqTokenInfo) => {
  return http.post<resTokenInfo>('/app/v1/rpc/chain/get_usdt_info', params);
};
