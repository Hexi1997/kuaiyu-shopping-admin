import { memo, FC, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table } from 'antd';
import CategoryAddOrUpdate from './components/CategoryAddOrUpdate';
import { useMount } from 'ahooks';
import { getCategories } from '@/services/category';
import { Spin } from 'antd';

type PropTypes = {};

export type CategoryInfoType = {
  id: number;
  pid: number;
  name: string;
  level: number;
  status: number;
  children: object[];
};

const CategoryManager: FC<PropTypes> = memo((props) => {
  const [type, setType] = useState<'add' | 'update'>('add');
  const [modalVisibile, setModalVisibile] = useState(false);
  const [editItem, setEditItem] = useState<CategoryInfoType>();
  const [data, setData] = useState<CategoryInfoType[]>();
  const [loading, setLoading] = useState<Boolean>(true);

  const getData = async () => {
    const res = await getCategories('all');
    if (res.status === undefined) {
      //获取分类列表成功
      setData(res);
      setLoading(false);
    }
  };

  useMount(() => {
    getData();
  });

  const closeModalAndUpdate = () => {
    setModalVisibile(false);
    getData();
  };

  const handleEdit = (record: CategoryInfoType) => {
    return () => {
      console.log(record);
      setType('update');
      setModalVisibile(true);
      setEditItem(record);
    };
  };

  const handleAdd = () => {
    setType('add');
    setModalVisibile(true);
    setEditItem(undefined);
  };

  const columns = [
    { title: '分类名称', dataIndex: 'name', key: 'id' },
    {
      title: '操作',
      dataIndex: '',
      key: 'id',
      render: (record: any) => <a onClick={handleEdit(record)}>编辑</a>,
    },
  ];

  return (
    <PageContainer>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: '16px' }}>
        添加分类
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        expandable={{
          rowExpandable: (record) => record.children && record.children.length > 0,
        }}
      />
      {modalVisibile && (
        <CategoryAddOrUpdate
          type={type}
          editItem={editItem}
          setModalVisibile={setModalVisibile}
          closeModalAndUpdate={closeModalAndUpdate}
          categoryData={data as CategoryInfoType[]}
        />
      )}
      {loading && (
        <Spin
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      )}
    </PageContainer>
  );
});

export default CategoryManager;
