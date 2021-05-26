import { memo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Avatar, Switch, message } from 'antd';
import { AccountBookOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getGoodsList, toggleGoodOn, toggleGoodRecommend } from '@/services/goods';
import GoodAddOrUpdate from './components/GoodAddOrUpdate';

export type GoodItem = {
  // "id": 1,
  // "title": "电脑11111电脑",
  // "category_id": 7,
  // "description": "这是一个电脑1111",
  // "price": 5000,
  // "stock": 999,
  // "sales": 2,
  // "cover": "100x100.jpg",
  // "cover_url": "https://laravel-shop-api.oss-cn-beijing.aliyuncs.com/100x100.jpg",
  // "pics": [
  //     "a.png",
  //     "b.png"
  // ],
  // "pics_url": [
  //     "https://laravel-shop-api.oss-cn-beijing.aliyuncs.com/a.png",
  //     "https://laravel-shop-api.oss-cn-beijing.aliyuncs.com/b.png"
  // ],
  // "details": "这是一个电脑这是一个电脑这是一个电脑这是一个电脑",
  // "is_on": 1,
  // "is_recommend": 1,
  // "created_at": "2020-12-12T07:38:37.000000Z",
  // "updated_at": "2020-12-12T10:13:45.000000Z"
  id: number;
  category?: { id: number; name: string; pid: number };
  title: string;
  category_id: number;
  description: string;
  price: number;
  stock: number;
  sales: number;
  cover: string;
  cover_url: string;
  pics: string[];
  pics_url: string[];
  details: string;
  is_on: number;
  is_recommend: number;
  created_at: Date;
  updated_at: Date;
};

const GoodsManager = memo(() => {
  const [type, setType] = useState<'add' | 'update'>('add');
  const [modalVisibile, setModalVisibile] = useState(false);
  const ref = useRef<ActionType>();
  const [editItem, setEditItem] = useState<GoodItem>();
  const handleAdd = () => {
    //新建，弹出新建页面
    setModalVisibile(true);
    setEditItem(undefined);
    setType('add');
  };

  const closeModalAndUpdateTable = () => {
    setModalVisibile(false);
    console.log(ref);
    ref.current?.reload();
  };

  /**
   * 切换商品状态（推荐或者上架）
   * @param id 商品id
   * @param type 更新类型，上架状态还是推荐状态
   */
  const handleGoodStatusChange = (id: number, type: 'on' | 'recommend') => {
    return async () => {
      //修改指定id的上架，下架状态状态
      let response = null;
      if (type === 'on') {
        response = await toggleGoodOn(id);
      } else {
        response = await toggleGoodRecommend(id);
      }
      if (response.status) {
        message.error('修改失败');
        ref.current?.reload();
      } else {
        //成功，成功返回204，提示更新成功
        message.success('修改成功');
      }
    };
  };

  const columns: ProColumns<GoodItem>[] = [
    {
      title: '商品图',
      dataIndex: 'cover_url',
      hideInSearch: true,
      render: (_, item) => {
        return <Avatar src={item.cover_url} icon={<AccountBookOutlined />} />;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      hideInSearch: true,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      hideInSearch: true,
    },
    {
      title: '是否上架',
      dataIndex: 'is_on',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '上架中',
          status: 1,
        },
        0: {
          text: '未上架',
          status: 0,
        },
      },
      render: (_, item) => {
        return (
          <Switch
            checkedChildren="已上架"
            unCheckedChildren="未上架"
            defaultChecked={item.is_on === 1}
            onChange={handleGoodStatusChange(item.id, 'on')}
          />
        );
      },
    },
    {
      title: '是否推荐',
      dataIndex: 'is_recommend',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '推荐',
          status: 1,
        },
        0: {
          text: '不推荐',
          status: 0,
        },
      },
      render: (_, item) => {
        return (
          <Switch
            checkedChildren="已推荐"
            unCheckedChildren="未推荐"
            defaultChecked={item.is_recommend === 1}
            onChange={handleGoodStatusChange(item.id, 'recommend')}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            console.log(record);
            setModalVisibile(true);
            setType('update');
            setEditItem(record);
          }}
        >
          编辑
        </a>,
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
          params.include = 'category';
          const res = await getGoodsList(params);
          console.log(res);
          return {
            total: res.meta.pagination.total,
            success: true,
            data: res.data,
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
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="商品列表"
        toolBarRender={() => [
          <Button key="button" onClick={handleAdd} icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
      {modalVisibile && (
        <GoodAddOrUpdate
          type={type}
          setModalVisibile={setModalVisibile}
          closeModalAndUpdateTable={closeModalAndUpdateTable}
          editItem={editItem}
        />
      )}
    </PageContainer>
  );
});

export default GoodsManager;
