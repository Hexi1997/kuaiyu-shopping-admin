import { memo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Switch, message, Image, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import SwiperAddOrUpdate from './components/SwiperAddOrUpdate';
import { deleteSwiper, getSwipers } from '@/services/swiper';
import { updateSwiper } from '../../services/swiper';

export type SwiperItem = {
  /**
   * 轮播图id
   */
  id: number;
  /**
   * 轮播图名称
   */
  title: string;
  /**
   * 跳转地址
   */
  url: string;
  /**
   * 轮播图图片
   */
  img: string;
  /**
   * 轮播图图片地址
   */
  img_url: string;
  /**
   * 排序
   */
  seq: number;
  /**
   * 状态：0禁用 1正常
   */
  status: 0 | 1;
  /**
   * 添加时间
   */
  created_at: Date;
  /**
   * 修改时间
   */
  updated_at: Date;
};

const SwiperManager = memo(() => {
  const [type, setType] = useState<'add' | 'update'>('add');
  const [modalVisibile, setModalVisibile] = useState(false);
  const ref = useRef<ActionType>();
  const [editItem, setEditItem] = useState<SwiperItem>();
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
   * 切换轮播图状态（禁用或者启用）
   * @param status 当前商品状态
   * @param id 商品id
   * @param type 更新类型，上架状态还是推荐状态
   */
  const handleSwiperStatusChange = (item: SwiperItem) => {
    return async () => {
      //修改指定id的轮播图的启用和禁用状态
      const response = await updateSwiper(item.id, {
        title: item.title,
        img: item.img_url,
        img_url: item.img_url,
        status: item.status === 0 ? 1 : 0,
      });
      if (response.status) {
        // message.error('修改失败');
        ref.current?.reload();
      } else {
        //成功，成功返回204，提示更新成功
        message.success('修改成功');
      }
    };
  };

  const columns: ProColumns<SwiperItem>[] = [
    {
      title: '轮播图片',
      dataIndex: 'img_url',
      hideInSearch: true,
      render: (_, item) => {
        return (
          <Image
            width={160}
            height={80}
            src={item.img_url}
            style={{ borderRadius: '5%' }}
            fallback="data:image/png;base64,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"
          />
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      hideInSearch: true,
    },
    {
      title: '跳转链接',
      dataIndex: 'url',
      hideInSearch: true,
    },
    {
      title: '是否禁用',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, item) => {
        return (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={item.status === 0}
            onChange={handleSwiperStatusChange(item)}
          />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'seq',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
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
        <Popconfirm
          title="确认删除?"
          onConfirm={async () => {
            console.log(record, '点击了删除');
            //网络请求执行删除
            const res = await deleteSwiper(record.id);
            if (res.status === undefined) {
              message.success('删除成功');
            }
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        search={false}
        actionRef={ref}
        columns={columns}
        request={async (params = {}, sort, filter) => {
          console.log(params, sort, filter);
          const res = await getSwipers(params);
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
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="轮播列表"
        toolBarRender={() => [
          <Button key="button" onClick={handleAdd} icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
      {modalVisibile && (
        <SwiperAddOrUpdate
          type={type}
          setModalVisibile={setModalVisibile}
          closeModalAndUpdateTable={closeModalAndUpdateTable}
          editItem={editItem}
        />
      )}
    </PageContainer>
  );
});

export default SwiperManager;
