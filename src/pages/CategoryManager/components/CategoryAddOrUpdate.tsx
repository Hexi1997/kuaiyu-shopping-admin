import { addCategory, AddCategoryParamType, updateCategory } from '@/services/category';
import ProForm, { ProFormText } from '@ant-design/pro-form';

import { Form, message } from 'antd';
import { Modal, Cascader } from 'antd';
import { memo, FC, useState } from 'react';
import { CategoryInfoType } from '../index';

type PropTypes = {
  type: 'add' | 'update';
  editItem: CategoryInfoType | undefined;
  setModalVisibile: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAndUpdate: () => void;
  categoryData: CategoryInfoType[];
};

const CategoryAddOrUpdate: FC<PropTypes> = memo(
  ({ type, editItem, setModalVisibile, categoryData, closeModalAndUpdate }) => {
    const [options] = useState<object[]>(
      //移除二级分类，创建的分类只能是一级分类或者二级分类。所以父级分类可以为空
      categoryData.map((item) => {
        const newItem = { ...item };
        newItem.children = [];
        return newItem;
      }),
    );

    const [form] = Form.useForm();

    return (
      <Modal
        maskClosable={false}
        title={type === 'add' ? '添加分类' : '更新分类'}
        visible={true}
        //使用高级表单自带的提交按钮，不用Modal的底部按钮
        footer={null}
        onCancel={() => {
          setModalVisibile(false);
        }}
        //关闭后销毁
        destroyOnClose={true}
        //宽度
        width={300}
      >
        <ProForm
          form={form}
          initialValues={
            type === 'add' ? {} : { ...editItem, pid: editItem?.pid === 0 ? '' : [editItem?.pid] }
          }
          onReset={() => {
            form.setFieldsValue({
              name: '',
              pid: '',
            });
          }}
          onFinish={async (values) => {
            //执行添加分类
            if (values.pid && typeof values.pid !== 'string' && values.pid.length > 0) {
              values.pid = values.pid[0];
            }
            if (!String(values.pid)) {
              delete values.pid;
            }
            console.log(values);
            if (type === 'add') {
              const res = await addCategory(values as AddCategoryParamType);
              if (res.status === undefined) {
                //成功
                message.success('添加分类成功');
                closeModalAndUpdate();
              }
            } else if (type === 'update' && editItem) {
              if (editItem.pid === 0 && values.pid) {
                message.error('不能将一级菜单修改为二级菜单');
                return;
              }
              const res = await updateCategory(editItem.id, values);
              if (res.status === undefined) {
                message.success('更新分类信息成功');
                closeModalAndUpdate();
              }
            }
          }}
        >
          <ProForm.Item name="pid" label="父级分类">
            <Cascader
              onChange={(value) => {
                console.log(value);
              }}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              options={options}
              placeholder="请选择分类，不选则创建顶级分类"
            />
          </ProForm.Item>
          <ProFormText
            name="name"
            label="分类名称"
            placeholder="请输入分类名称"
            rules={[{ required: true }]}
          />
        </ProForm>
      </Modal>
    );
  },
);

export default CategoryAddOrUpdate;
