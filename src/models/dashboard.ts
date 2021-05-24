import { getIndexStatistics } from '@/services/dashboard';
import { Effect, Reducer } from 'umi';

export type StatisticsType = {
  usercount: number;
  goodscount: number;
  ordercount: number;
};
export type DashBoardModelType = {
  namespace: string;
  state: StatisticsType;
  effects: {
    fetchCount: Effect;
  };
  reducers: {
    changeCount: Reducer<StatisticsType>;
  };
};

const DashBoardModel: DashBoardModelType = {
  namespace: 'dashboard',
  state: {
    usercount: 0,
    goodscount: 0,
    ordercount: 0,
  },
  effects: {
    *fetchCount(_, { call, put }) {
      const res = yield call(getIndexStatistics);
      yield put({
        type: 'changeCount',
        payload: {
          usercount: res.users_count,
          goodscount: res.goods_count,
          ordercount: res.order_count,
        },
      });
    },
  },
  reducers: {
    changeCount(state, action) {
      console.log(action.payload);
      return { ...state, ...action.payload };
    },
  },
};

export default DashBoardModel;
