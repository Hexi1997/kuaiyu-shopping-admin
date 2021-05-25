import request from '@/utils/request';

/**
 * 分类查询
 * @param type all代表全部查询，notLocked代表只查询可用的分类
 */
const getCategories = (type: 'all' | 'notLocked' = 'notLocked') => {
  if (type === 'notLocked') {
    return request('/admin/category');
  } else {
    return request('/admin/category', { params: { type } });
  }
};

export type AddCategoryParamType = {
  name: string;
  pid?: number;
  group?: 'goods' | 'menus';
};

/**
 * 添加分类
 * @param params 参数对象
 */
const addCategory = (params: AddCategoryParamType) => {
  return request('/admin/category', {
    method: 'POST',
    data: params,
  });
};

/**
 * 更新分类
 * @param category_id 分类id
 * @param data 更新内容
 */
const updateCategory = (category_id: number, data: { name: string; pid?: number }) => {
  return request(`/admin/category/${category_id}`, {
    method: 'PUT',
    data,
  });
};

export { getCategories, addCategory, updateCategory };
