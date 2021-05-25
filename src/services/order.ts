import request from '@/utils/request';

/**
 * 获取订单
 * @param params 请求参数
 */
export const getOrderList = (params: Record<string, string>) => {
  return request('/admin/orders', { params });
};

/**
 * 订单发货
 * @param orderId 订单id
 * @param data 订单参数
 */
export const postOrder = (orderId: number, data: { express_type: string; express_no: string }) => {
  return request(`/admin/orders/${orderId}/post`, {
    method: 'PATCH',
    data,
  });
};
