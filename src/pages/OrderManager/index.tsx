import { memo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tag, message, Popconfirm } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getOrderList } from '@/services/order';
import Detail from './components/Detail';
import Send from './components/Send';

export type OrderItem = {
  id: number;
  order_no: string;
  user_id: number;
  amount: number;
  status: number;
  address_id: number;
  express_type: string;
  express_no: string;
  pay_time: Date;
  pay_type: string;
  trade_no: string;
  created_at: Date;
  updated_at: Date;
  goods: {
    data: {
      cover_url: string;
      title: string;
      price: number;
    }[];
  };
  orderDetails: { data: { num: number }[] };
};

const OrderManager = memo(() => {
  const [type, setType] = useState<string>();
  const ref = useRef<ActionType>();
  const [currentItem, setCurrentItem] = useState<OrderItem>();

  const closeModalAndUpdateTable = () => {
    console.log(ref);
    setType('');
    ref.current?.reload();
  };

  const columns: ProColumns<OrderItem>[] = [
    {
      title: '单号',
      dataIndex: 'order_no',
    },
    {
      title: '用户',
      dataIndex: 'username',
      hideInSearch: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '已下单',
          status: 1,
        },
        2: {
          text: '已支付',
          status: 2,
        },
        3: {
          text: '已发货',
          status: 3,
        },
        4: {
          text: '已收货',
          status: 4,
        },
        5: {
          text: '已过期',
          status: 5,
        },
      },
      render: (_, item) => {
        switch (item.status) {
          case 1:
            return <Tag color="magenta">已下单</Tag>;
            break;
          case 2:
            return <Tag color="green">已支付</Tag>;
            break;
          case 3:
            return <Tag color="purple">已发货</Tag>;
            break;
          case 4:
            return <Tag color="blue">已收货</Tag>;
            break;
          case 5:
            return <Tag color="#ddd">已过期</Tag>;
            break;
          default:
            return <Tag color="#magenta">下单</Tag>;
            break;
        }
      },
    },
    {
      title: '支付时间',
      dataIndex: 'pay_time',
      hideInSearch: true,
    },
    {
      title: '支付类型',
      dataIndex: 'pay_type',
      hideInSearch: true,
    },
    {
      title: '支付单号',
      dataIndex: 'trade_no',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="detail"
          onClick={() => {
            console.log(record, '点击了详情');
            setCurrentItem(record);
            setType('detail');
          }}
        >
          详情
        </a>,
        <Popconfirm
          title="确认发货?"
          onConfirm={() => {
            console.log(record, '点击了发货');
            if (record.status !== 2) {
              message.error('只有已支付未发货的订单可以进行发货');
              return;
            }
            //显示发货信息填写窗口
            setCurrentItem(record);
            setType('send');
          }}
          okText="确定"
          cancelText="取消"
        >
          <a key="sendgood">发货</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={ref}
        columns={columns}
        request={async (params = {}, sort, filter) => {
          console.log(params, sort, filter);
          params.include = 'goods,user,orderDetails';
          const res = await getOrderList(params);
          console.log(res);
          const newData = res.data.map((item: any) => {
            item.username = item.user.name;
            return item;
          });
          return {
            total: res.meta.pagination.total,
            success: true,
            data: newData,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="订单列表"
      />
      {type === 'detail' && <Detail currentItem={currentItem as OrderItem} setType={setType} />}
      {type === 'send' && (
        <Send
          closeModalAndUpdateTable={closeModalAndUpdateTable}
          currentItem={currentItem as OrderItem}
          setType={setType}
        />
      )}
    </PageContainer>
  );
});

export default OrderManager;
