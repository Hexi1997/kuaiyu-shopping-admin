import type { Effect } from 'umi';
import { history } from 'umi';

import { accountLogin, accountLogout } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import StorageUtils from '@/utils/storageUtils';
import storageUtils from '@/utils/storageUtils';

export type StateType = {};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {};
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      const { access_token } = response;
      if (access_token) {
        //更新token到localStorage
        StorageUtils.setOrUpdateToken(access_token);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (window.routerBase !== '/') {
              redirect = redirect.replace(window.routerBase, '/');
            }
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout({ payload }, { call, put }) {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        //退出登录
        yield call(accountLogout);
        //删除本地token
        storageUtils.deleteToken();
        //删除内存中user信息，会触发SecurityLayout刷新，重定向到首页
        yield put({
          type: 'user/deleteCurrentUser',
        });
        message.success('退出成功!');
      }
    },
  },

  reducers: {},
};

export default Model;
