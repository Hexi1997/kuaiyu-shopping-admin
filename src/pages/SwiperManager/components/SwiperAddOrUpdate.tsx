import React, { memo, FC, useState } from 'react';
import { Modal, Form, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { SwiperItem } from '../index';
import AliyunOssUpload from '@/components/AliyunOssUpload';
import { Button } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './SwiperAddOrUpdate.less';
import { addSwiper, updateSwiper } from '@/services/swiper';

type PropTypes = {
  type: 'add' | 'update';
  setModalVisibile: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAndUpdateTable: () => void;
  editItem: SwiperItem | undefined;
};

const SwiperAddOrUpdate: FC<PropTypes> = memo((props) => {
  const [showImg, setShowImg] = useState(true);
  const { type, setModalVisibile, closeModalAndUpdateTable, editItem } = props;
  const [form] = Form.useForm();

  const updateCover = (url: string) => {
    console.log(url);
    form.setFieldsValue({
      img_url: url,
    });
    setShowImg(false);
  };

  return (
    <Modal
      maskClosable={false}
      title={type === 'add' ? '新增轮播' : '更新轮播'}
      visible={true}
      //使用高级表单自带的提交按钮，不用Modal的底部按钮
      footer={null}
      onCancel={() => {
        setModalVisibile(false);
      }}
      //关闭后销毁
      destroyOnClose={true}
      //宽度
      width={700}
    >
      <ProForm
        form={form}
        initialValues={editItem}
        onReset={() => {
          form.setFieldsValue({
            title: '',
            url: '',
            img_url: '',
          });
          setShowImg(false);
        }}
        onFinish={async (values) => {
          console.log('提交', values);
          if (type === 'add') {
            const res = await addSwiper(values);
            if (res.status === undefined) {
              message.success('添加成功');
              closeModalAndUpdateTable();
            }
          } else if (type === 'update' && editItem) {
            const res = await updateSwiper(editItem.id, values);
            if (res.status === undefined) {
              message.success('更新成功');
              closeModalAndUpdateTable();
            }
          }
        }}
      >
        <ProFormText
          placeholder="请输入名称"
          name="title"
          label="轮播名"
          rules={[{ required: true }]}
        />

        <ProFormText placeholder="请输入跳转的URL" name="url" label="跳转的URL" />
        <ProForm.Item
          name="img_url"
          label="轮播图"
          rules={[{ required: true, message: '请上传轮播图' }]}
        >
          <div>
            <AliyunOssUpload type="image" callback={updateCover} from="GoodAddOrUpdate">
              <Button icon={<UploadOutlined />}>
                点击{type === 'add' ? '上传' : '更新'}轮播图
              </Button>
            </AliyunOssUpload>
          </div>
          {type === 'update' && showImg ? (
            <div className={styles.editorImgContainer}>
              <img
                className={styles.img}
                src={editItem?.img_url}
                onClick={() => {
                  window.open(editItem?.img_url);
                }}
              />
              <DeleteOutlined
                className={styles.deleteicon}
                onClick={() => {
                  form.setFieldsValue({
                    img_url: '',
                  });
                  setShowImg(false);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </ProForm.Item>
      </ProForm>
    </Modal>
  );
});

export default SwiperAddOrUpdate;
