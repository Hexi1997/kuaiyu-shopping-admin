import { PageContainer } from '@ant-design/pro-layout';
import { memo, FC } from 'react';

type PropType = {};
const OrderManager: FC<PropType> = memo((props) => {
  return (
    <PageContainer>
      <div>订单管理</div>
    </PageContainer>
  );
});

export default OrderManager;
