export const KEY_TOKEN = 'token';
export const KEY_OSS = 'aliyunossconfig';

/**
 * 设置或者更新localStorage中token值
 * @param token token值
 */
const setOrUpdateToken = (token: string) => {
  localStorage.setItem(KEY_TOKEN, token);
};

/**
 * 移除localStorage中的token值
 */
const deleteToken = () => {
  localStorage.removeItem(KEY_TOKEN);
};

/**
 * 获取localStorage中存储的token值
 */
const getToken = () => {
  let result: string | null = '';
  try {
    result = localStorage.getItem(KEY_TOKEN);
  } catch (e) {
    console.log('获取token值失败', e);
    result = '';
  }
  return result;
};

/**
 * localStorage工具类
 */
export default {
  setOrUpdateToken,
  deleteToken,
  getToken,
};
