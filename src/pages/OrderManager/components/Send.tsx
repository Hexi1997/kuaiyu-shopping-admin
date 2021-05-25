import { memo, FC } from 'react';
import { Modal, Select, Form, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';

import { OrderItem } from '../index';
import { postOrder } from '@/services/order';
const { Option } = Select;
type PropType = {
  currentItem: OrderItem;
  setType: React.Dispatch<React.SetStateAction<string | undefined>>;
  closeModalAndUpdateTable: () => void;
};

const Send: FC<PropType> = memo(({ currentItem, setType, closeModalAndUpdateTable }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="订单发货"
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
      <ProForm
        form={form}
        onReset={() => {
          form.setFieldsValue({
            express_type: null,
            express_no: '',
          });
        }}
        onFinish={async (values) => {
          //执行发送快递
          console.log('点击了发送快递', values);
          const res = await postOrder(currentItem.id, values);
          if (res.status === undefined) {
            message.success('发货成功');
            closeModalAndUpdateTable();
          }
        }}
      >
        <ProForm.Item
          name="express_type"
          label="快递类型"
          rules={[{ required: true, message: '快递类型不得为空' }]}
        >
          <Select
            placeholder="请选择快递类型"
            onChange={(value) => {
              console.log(value);
            }}
          >
            <Option value="SF">顺丰</Option>
            <Option value="YD">韵达</Option>
            <Option value="YTO">圆通</Option>
          </Select>
        </ProForm.Item>
        <ProFormText
          name="express_no"
          label="快递单号"
          placeholder="请输入快递单号"
          rules={[{ required: true, message: '快递单号不得为空' }]}
        />
      </ProForm>
    </Modal>
  );
});

export default Send;
