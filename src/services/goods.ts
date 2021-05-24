import request from '@/utils/request';

/**
 * 获取商品列表
 * @param params 请求参数
 */
const getGoodsList = (params: Record<string, string>) => {
  return request('/admin/goods', { params });
};
/**
 * 商品上架、下架状态切换
 * @param id 商品id
 */
const toggleGoodOn = (id: number) => {
  return request.patch(`/admin/goods/${id}/on`);
};
/**
 * 商品推荐，不推荐状态切换
 * @param id 商品id
 */
const toggleGoodRecommend = (id: number) => {
  return request.patch(`/admin/goods/${id}/recommend`);
};

export type GoodAddType = {
  category_id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  cover: string;
  pics?: string[];
  details: string;
};

/**
 * 添加商品
 * @param params 商品参数
 */
const addGood = (params: GoodAddType) => {
  return request('/admin/goods', {
    method: 'POST',
    data: params,
  });
};

/**
 * 更新商品
 * @param id 商品id
 * @param params 更新内容
 */
const updateGood = (id: number, params: GoodAddType) => {
  return request(`/admin/goods/${id}`, {
    method: 'PUT',
    data: params,
  });
};

export { getGoodsList, toggleGoodOn, toggleGoodRecommend, addGood, updateGood };
