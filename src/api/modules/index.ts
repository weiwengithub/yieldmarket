import {ReqAuthSignature, ResAuthInfo, ResAuthSignature, SalesOrderOptions} from "@/api/interface";
import http from "@/api";

export const getAuthInfo = () => {
  return http.post<ResAuthInfo>('/app/v1/rpc/login/get_auth_info');
};

export const authSignature = (params: ReqAuthSignature) => {
  return http.post<ResAuthSignature>('/app/v1/rpc/login/auth_signature', params);
};

export const getSalesOrderList = () => {
  return http.post<SalesOrderOptions[]>('/app/v1/rpc/project/get_sales_order_list');
};

export const getAllSalesOrderList = () => {
  return http.post<SalesOrderOptions[]>('/app/v1/rpc/project/get_all_sales_order_list');
};
