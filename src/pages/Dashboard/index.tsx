import React, { memo, useEffect } from 'react';
import { Dispatch, connect } from 'umi';
import { StatisticsType } from '@/models/dashboard';
import { Card, Col, Row, Statistic } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

type DashBoradProps = {
  usercount: number;
  goodscount: number;
  ordercount: number;
  dispatch: Dispatch;
};

const Dashboard: React.FC<DashBoradProps> = memo((props) => {
  const { usercount, goodscount, ordercount, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchCount',
    });
  }, []);

  return (
    <PageContainer>
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col sm={8} xs={12}>
          <Card>
            <Statistic
              title="用户数量"
              value={usercount}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col sm={8} xs={12}>
          <Card>
            <Statistic
              title="商品数量"
              value={goodscount}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col sm={8} xs={12}>
          <Card>
            <Statistic
              title="订单数量"
              value={ordercount}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
});

export default connect(
  ({ dashboard: { usercount, goodscount, ordercount } }: { dashboard: StatisticsType }) => ({
    usercount,
    goodscount,
    ordercount,
  }),
)(Dashboard);
