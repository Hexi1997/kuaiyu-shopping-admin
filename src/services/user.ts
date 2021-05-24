import request from '@/utils/request';

export async function queryCurrent(): Promise<any> {
  return request('/admin/user');
}

type UserListQueryType = {
  current?: number;
  name?: string;
  email?: string;
  phone?: string;
};

/**
 * 根据条件查询列表
 * @param params 搜索条件
 */
export async function getUserList(params: UserListQueryType) {
  let url = '/admin/users';
  // const qsStr = queryString.stringify(params);
  // if (qsStr) {
  //   url += `?${qsStr}`;
  // }
  // console.log('url', url);
  return request(url, { params });
}
/**
 * 切换用户的禁用和启用状态
 * @param id 用户id
 */
export async function toggleUserLocked(id: number) {
  return request.patch(`/admin/users/${id}/lock`);
}
/**
 * 添加用户
 * @param params 用户对象
 */
export async function addUser(params: Record<string, string>) {
  return request('/admin/users', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户
 * @param id 用户id
 * @param params 用户对象
 */
export async function updateUser(id: number, params: Record<string, string>) {
  return request(`/admin/users/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
