import { memo, FC } from 'react';
import { Modal, List } from 'antd';

import { OrderItem } from '../index';

type PropType = {
  currentItem: OrderItem;
  setType: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const Detail: FC<PropType> = memo(({ currentItem, setType }) => {
  return (
    <Modal
      title="订单详情"
      //查看订单详情界面，不需要Modal的底部按钮
      footer={null}
      //关闭后销毁
      destroyOnClose={true}
      onCancel={() => {
        setType('');
      }}
      //宽度
      width={500}
      //必须设置才能显示
      visible={true}
      //点击空白区域不显示
      maskClosable={false}
    >
      <List
        itemLayout="horizontal"
        dataSource={currentItem.goods.data}
        split
        renderItem={(item, index) => {
          const num = currentItem.orderDetails.data[index].num;
          return (
            <List.Item style={{ justifyContent: 'flex-start' }}>
              <img src={item.cover_url} style={{ width: '100px', height: '100px' }} />
              <div
                style={{
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <div>{item.title}</div>
                <div>
                  <span>
                    单价：{item.price} 数量：{num} 总价：{item.price * num}
                  </span>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </Modal>
  );
});

export default Detail;
