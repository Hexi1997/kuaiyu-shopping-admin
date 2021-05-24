import request from '@/utils/request';

export type LoginParamsType = {
  email: string;
  password: string;
};

/**
 * 登录账户
 * @param params 登录参数
 */
export async function accountLogin(params: LoginParamsType) {
  return request('/auth/login', {
    method: 'POST',
    data: params,
  });
}

/**
 * 退出登录
 */
export async function accountLogout() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

/**
 * 获取oss token
 */
export async function getOSSToken() {
  return request('/auth/oss/token');
}
