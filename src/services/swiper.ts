import request from '@/utils/request';

/**
 * 轮播图状态改变(启用/禁用)
 * @param id 轮播图id
 */
export const toggleSwiperStatus = (id: number) => {
  return request(`/admin/slides/${id}/status`, {
    method: 'PATCH',
  });
};

/**
 * 删除轮播图
 * @param id 轮播图id
 */
export const deleteSwiper = (id: number) => {
  return request(`/admin/slides/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 获取轮播图
 * @param params 参数
 */
export const getSwipers = (params: Record<string, any>) => {
  return request('/admin/slides', { params });
};

export type AddSwiperParamType = {
  title?: string;
  img?: string;
  url?: string;
  status?: 0 | 1;
  img_url?: string;
};

/**
 * 添加轮播
 * @param data 数据
 */
export const addSwiper = (data: AddSwiperParamType) => {
  //添加轮播必启用
  data.status = 1;
  data.img = data.img_url;
  return request('/admin/slides', {
    method: 'POST',
    data,
  });
};

/**
 * 更新轮播
 * @param data 数据
 */
export const updateSwiper = (id: number, data: AddSwiperParamType) => {
  //添加轮播必启用
  console.log(id, data);
  data.img = data.img_url;
  return request(`/admin/slides/${id}`, {
    method: 'PUT',
    data,
  });
};
