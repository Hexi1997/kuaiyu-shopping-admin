import { memo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Avatar, Switch, message } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getUserList, toggleUserLocked } from '@/services/user';
import UserAddOrUpdate from './components/UserAddOrUpdate';

export type UserItem = {
  url: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  avatar_url: string;
  is_locked: number;
  created_at: string;
  updated_at: string;
};

const UserManager = memo(() => {
  const [type, setType] = useState<'add' | 'update'>('add');
  const [modalVisibile, setModalVisibile] = useState(false);
  const ref = useRef<ActionType>();
  const [editItem, setEditItem] = useState<UserItem>();
  const handleAdd = () => {
    //新建，弹出新建页面
    setModalVisibile(true);
    setType('add');
  };

  const closeModalAndUpdateTable = () => {
    setModalVisibile(false);
    console.log(ref);
    ref.current?.reload();
  };

  const handleLockChange = (id: number) => {
    return async () => {
      //修改指定id的lock状态
      const response = await toggleUserLocked(id);
      if (response.status) {
        message.error('修改失败');
      } else {
        //成功，成功返回204，提示更新成功
        message.success('修改成功');
      }
    };
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: '头像',
      dataIndex: 'avatar_url',
      hideInSearch: true,
      render: (_, item) => {
        return <Avatar src={item.avatar_url} icon={<UserOutlined />} />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '是否禁用',
      dataIndex: 'is_locked',
      hideInSearch: true,
      render: (_, item) => {
        return (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={item.is_locked === 0}
            onChange={handleLockChange(item.id)}
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
          const res = await getUserList(params);
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
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" onClick={handleAdd} icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
      {modalVisibile && (
        <UserAddOrUpdate
          type={type}
          setModalVisibile={setModalVisibile}
          closeModalAndUpdateTable={closeModalAndUpdateTable}
          editItem={editItem}
        />
      )}
    </PageContainer>
  );
});

export default UserManager;
