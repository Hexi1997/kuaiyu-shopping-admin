import type { Effect, Reducer } from 'umi';

import { queryCurrent } from '@/services/user';

export type CurrentUser = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  is_locked?: 0 | 1;
  created_at?: string;
  updated_at?: string;
};

export type UserModelState = {
  currentUser?: CurrentUser;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    deleteCurrentUser: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    //保存用户
    saveCurrentUser(state, action) {
      console.log(action);
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    //删除当前用户
    deleteCurrentUser(state) {
      return { ...state, currentUser: {} };
    },
    //修改通知数量
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
