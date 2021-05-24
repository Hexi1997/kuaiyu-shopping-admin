import React, { memo, FC } from 'react';
import { message, Modal } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { addUser, updateUser } from '@/services/user';
import { UserItem } from '../index';

type PropTypes = {
  type: 'add' | 'update';
  setModalVisibile: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAndUpdateTable: () => void;
  editItem: UserItem | undefined;
};
const UserAddOrUpdate: FC<PropTypes> = memo((props) => {
  const { type, setModalVisibile, closeModalAndUpdateTable, editItem } = props;

  return (
    <Modal
      title={type === 'add' ? '新增用户' : '更新用户'}
      visible={true}
      //使用高级表单自带的提交按钮，不用Modal的底部按钮
      footer={null}
      onCancel={() => {
        setModalVisibile(false);
      }}
      //关闭后销毁
      destroyOnClose={true}
    >
      <ProForm
        onFinish={async (values) => {
          console.log(values);
          if (type === 'add') {
            //新增
            const res = await addUser(values);
            if (res.status === undefined) {
              //代表成功
              message.success('添加成功');
              closeModalAndUpdateTable();
            }
          } else if (type === 'update') {
            //更新
            if (editItem) {
              const res = await updateUser(editItem.id, values);
              if (res.status === undefined) {
                //更新成功
                message.success('更新成功');
                closeModalAndUpdateTable();
              }
            }
          }
        }}
      >
        <ProFormText
          name="name"
          placeholder="请输入姓名"
          initialValue={type === 'update' ? editItem?.name : ''}
          rules={[
            {
              required: true,
              message: '姓名不得为空',
            },
          ]}
        />
        <ProFormText
          name="email"
          placeholder="请输入邮箱"
          initialValue={type === 'update' ? editItem?.email : ''}
          rules={[
            {
              required: true,
              message: '邮箱不得为空',
            },
            {
              type: 'email',
              message: '邮箱格式不正确',
            },
          ]}
        />
        {type === 'add' && (
          <ProFormText.Password
            name="password"
            placeholder="请输入密码"
            rules={[
              { required: true, message: '密码不得为空' },
              { min: 6, message: '密码至少为6位' },
            ]}
          />
        )}
      </ProForm>
    </Modal>
  );
});

export default UserAddOrUpdate;
