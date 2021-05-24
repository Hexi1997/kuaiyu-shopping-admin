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

export { getCategories };
