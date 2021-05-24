import request from '@/utils/request';

/**
 * 获取首页数据统计
 */
export async function getIndexStatistics() {
  return request('/admin/index');
}
