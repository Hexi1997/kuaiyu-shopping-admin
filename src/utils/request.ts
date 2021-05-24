/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend, RequestOptionsInit } from 'umi-request';
import { message } from 'antd';
import storageUtils from './storageUtils';

/**
 * 请求基地址
 */
export const BASE_URL = 'https://api.shop.eduwork.cn/api';

const codeMessage: Record<number, string> = {
  200: '（成功）服务器已成功处理了请求',
  201: '（已创建）请求成功并且服务器创建了新的资源',
  204: '（无内容）服务器成功处理了请求，但没有返回任何内容',
  301: '（永久移动）请求的网页已永久移动到新位置',
  302: '（临时移动）服务器目前从不同的位置响应请求',
  400: '（错误请求）服务器不理解请求的语法',
  401: '（未授权）请求要求身份验证',
  403: '（禁止）无权限, 服务器拒绝请求',
  404: '（未找到） 服务器找不到请求的资源',
  408: '（超时） 请求超时',
  422: '（验证错误） 请求参数未通过验证',
  429: '（被限制）请求次数过多',
  500: '（服务器内部错误） 服务器遇到错误，无法完成请求',
  501: '（尚未实施） 服务器不具备完成请求的功能',
  502: '（错误网关） 服务器作为网关或代理，从上游服务器收到无效响应',
  503: '（服务不可用） 服务器目前无法使用(由于超载或停机维护), 通常，这只是暂时状态',
  504: '（网关超时） 服务器作为网关或代理，但是没有及时从上游服务器收到请求',
  505: '（HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本',
};

/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */
const errorHandler = async (error: { response: Response }): Promise<Response> => {
  const { response } = error;
  if (response && response.status) {
    let errorText = codeMessage[response.status] || response.statusText;
    const res = await response.json();
    const { status } = response;
    if (status === 422) {
      let errorMsg = '';
      const errors: Record<string, string[]> = (res as any).errors;
      for (let key in errors) {
        errorMsg += `，${errors[key][0]}`;
      }
      if (errorMsg) {
        console.log(errorMsg);
        errorText = errorMsg.startsWith('，') ? errorMsg.substring(1) : errorMsg;
      }
    }
    if (status === 400) {
      const message: string = (response as any).message;
      if (message) {
        errorText = message;
      }
    }
    message.error(errorText);
  } else if (!response) {
    message.error('网络异常，无法连接服务器');
  }
  return response;
};

/**
 * @en-US Configure the default parameters for request
 * @zh-CN 配置request请求时的默认参数
 */
const request = extend({
  //请求基地址设置
  prefix: BASE_URL,
  //超时时间
  timeout: 3000,
  // 'headers' 请求头
  headers: { 'Content-Type': 'application/json' },
  //错误处理
  errorHandler,
  // 'credentials' 发送带凭据的请求
  // 为了让浏览器发送包含凭据的请求（即使是跨域源），需要设置 credentials: 'include'
  // 如果只想在请求URL与调用脚本位于同一起源处时发送凭据，请添加credentials: 'same-origin'
  // 要改为确保浏览器不在请求中包含凭据，请使用credentials: 'omit'
  // credentials: 'omit',
});

//拦截器,条件token
request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
  const token = storageUtils.getToken() || '';
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    url,
    options: { ...options, headers },
  };
});
export default request;
