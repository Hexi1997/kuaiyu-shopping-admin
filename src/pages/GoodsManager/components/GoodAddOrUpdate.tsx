import React, { memo, FC, useState } from 'react';
import { message, Modal, Cascader, Form } from 'antd';
import Skeleton from '@ant-design/pro-skeleton';
import ProForm, { ProFormDigit, ProFormText, StepsForm } from '@ant-design/pro-form';
import { GoodItem } from '../index';
import AliyunOssUpload, { OSSReturnType } from '@/components/AliyunOssUpload';
import { useMount, useToggle } from 'ahooks';
import { getCategories } from '@/services/category';
import { Button } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Editor from '@/components/BraftEditor';
import { addGood, GoodAddType, updateGood } from '@/services/goods';
import styles from './GoodAddOrUpdate.less';

type PropTypes = {
  type: 'add' | 'update';
  setModalVisibile: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAndUpdateTable: () => void;
  editItem: GoodItem | undefined;
};

const GoodAddOrUpdate: FC<PropTypes> = memo((props) => {
  const [loading, { toggle }] = useToggle(true);
  const [showImg, setShowImg] = useState(true);
  const [options, setOptions] = useState<object[]>();
  const { type, setModalVisibile, closeModalAndUpdateTable, editItem } = props;
  const [form] = Form.useForm();

  useMount(async () => {
    //同时发送请求访问网络请求获取分类标签数据和阿里云oss配置，全部获取成功
    const res = await getCategories();
    if (res.status === undefined) {
      //获取分类数据成功
      setOptions(res);
      toggle(false);
    }
  });

  const updateCover = (url: string) => {
    console.log(url);
    form.setFieldsValue({
      cover: url,
    });
    setShowImg(false);
  };
  const updateDesc = (param: string) => {
    //代表更新的详情
    form.setFieldsValue({
      details: param,
    });
  };

  /**
   * 初始化值
   */
  const getInitValue = () => {
    console.log(editItem);
    if (type === 'update' && editItem && editItem.category) {
      if (editItem.category.pid === 0) {
        return { ...editItem, category_id: [editItem.category_id] };
      }
      return { ...editItem, category_id: [editItem.category.pid, editItem.category_id as number] };
    } else {
      return {};
    }
  };

  return (
    <Modal
      maskClosable={false}
      title={type === 'add' ? '新增商品' : '更新商品'}
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
      {loading ? (
        //加载中图标
        <Skeleton type="list" />
      ) : (
        <StepsForm
          onFinish={async (values) => {
            values.category_id =
              values.category_id.length > 1 ? values.category_id[1] : values.category_id[0];
            if (type === 'add') {
              const res = await addGood(values as GoodAddType);
              console.log(res, values);
              if (res.status === undefined) {
                //添加成功
                message.success('添加商品成功');
                closeModalAndUpdateTable();
              }
            } else if (type === 'update' && editItem) {
              const res = await updateGood(editItem.id, values as GoodAddType);
              console.log(res, values);
              if (res.status === undefined) {
                //更新成功
                message.success('更新商品信息成功');
                closeModalAndUpdateTable();
              }
            }
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm
            initialValues={getInitValue()}
            name="base"
            title="基础信息"
            onFinish={async () => {
              return true;
            }}
          >
            <ProFormText
              placeholder="请输入名称"
              name="title"
              label="商品名称"
              rules={[{ required: true }]}
            />
            <ProForm.Item name="category_id" label="商品分类" rules={[{ required: true }]}>
              <Cascader
                onChange={(value) => {
                  console.log(value);
                }}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                options={options}
                placeholder="请选择分类"
              />
            </ProForm.Item>
            <ProFormText
              name="description"
              label="简单描述"
              placeholder="请输入简单描述"
              rules={[{ required: true }]}
            />
            <ProFormDigit
              placeholder="请输入商品价格"
              label="商品价格"
              name="price"
              min={1}
              max={100000000}
              rules={[{ required: true, message: '此项为必填项' }]}
            />
            <ProFormDigit
              placeholder="请输入商品库存"
              label="商品库存"
              name="stock"
              min={1}
              max={100000000}
              rules={[{ required: true, message: '此项为必填项' }]}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm
            initialValues={getInitValue()}
            name="other"
            title="详细信息"
            form={form}
          >
            <ProForm.Item
              name="cover"
              label="商品主图"
              rules={[{ required: true, message: '请上传商品主图' }]}
            >
              <div>
                <AliyunOssUpload type="image" callback={updateCover} from="GoodAddOrUpdate">
                  <Button icon={<UploadOutlined />}>
                    点击{type === 'add' ? '上传' : '更新'}商品主图
                  </Button>
                </AliyunOssUpload>
              </div>
              {type === 'update' && showImg ? (
                <div className={styles.editorImgContainer}>
                  <img
                    className={styles.img}
                    src={editItem?.cover_url}
                    onClick={() => {
                      window.open(editItem?.cover_url);
                    }}
                  />
                  <DeleteOutlined
                    className={styles.deleteicon}
                    onClick={() => {
                      form.setFieldsValue({
                        cover: '',
                      });
                      setShowImg(false);
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </ProForm.Item>

            <ProForm.Item
              name="details"
              label="商品详情"
              rules={[{ required: true, message: '请输入商品详情' }]}
            >
              <div>
                <Editor
                  callback={updateDesc}
                  initValue={type === 'update' && editItem ? editItem.details : ''}
                />
              </div>
            </ProForm.Item>
          </StepsForm.StepForm>
        </StepsForm>
      )}
    </Modal>
  );
});

export default GoodAddOrUpdate;
