import React, { memo, FC, useState } from 'react';
import { Upload, Button, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { useMount } from 'ahooks';
import { getOSSToken } from '@/services/login';
type FileTypes = 'image' | 'audio' | 'video' | 'any';
type PropsType = {
  children?: React.ReactNode;
  type?: FileTypes;
  callback: Function;
  from: 'GoodAddOrUpdate' | 'Editor';
};
export type OSSReturnType = {
  accessid: string;
  host: string;
  policy: string;
  signature: string;
  expire: number;
  callback: string;
  dir: string;
};

/**
 * 将文件类型转换为标准的文件类型，
 * 标准参考mdn
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
 * @param type 文件类型
 */
const getAcceptStr = (type: FileTypes) => {
  switch (type) {
    case 'image':
    case 'audio':
    case 'video':
      return `${type}/*`;
      break;
    case 'any':
      return '*/*';
      break;
    default:
      return '*/*';
      break;
  }
};
const AliyunOssUpload: FC<PropsType> = memo((props) => {
  const { type = 'image', children, callback, from } = props;
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [oss, setOss] = useState<OSSReturnType>();

  const getOss = async () => {
    //初始化获取oss
    const res = await getOSSToken();
    if (res.status === undefined) {
      setOss(res);
    }
  };

  useMount(() => {
    getOss();
  });

  const handleChange = (params: any) => {
    const { file, fileList } = params;
    console.log('hanleChange', params);
    // if ((file as UploadFile).status === 'done') {
    //上传完成，更新显示
    if (file.status === 'done') {
      //更新fileList
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].url === file.url) {
          fileList[i].url = file.remoteUrl;
          fileList[i].thumbUrl = file.remoteUrl;
          break;
        }
      }

      file.url = file.remoteUrl;
      file.thumbUrl = file.remoteUrl;

      setFileList([...fileList]);
      if (from === 'Editor') {
        //将当前所选文件的所有url地址回调出去
        const urls: string[] = fileList.map((item: any) => item.url);
        callback(urls);
      } else if (from === 'GoodAddOrUpdate') {
        callback(file.remoteUrl);
      }
      message.success('上传成功');
    } else {
      setFileList([...fileList]);
    }
  };

  const handleRemove = () => {
    callback('');
    message.success('删除成功');
  };

  const beforeUpload = async (file: any) => {
    if (!oss) {
      return;
    }

    //如果oss过期，重新获取
    if (oss.expire * 1000 < Date.now()) {
      await getOss();
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = oss.dir + filename;
    file.remoteUrl = oss.host + filename;
    return file;
  };

  const getExtraData = (file: any) => {
    if (!oss) {
      return;
    }
    return {
      key: file.url,
      OSSAccessKeyId: oss.accessid,
      policy: oss.policy,
      Signature: oss.signature,
    };
  };

  if (!oss) {
    return <Spin />;
  }
  return (
    <Upload
      accept={getAcceptStr(type)}
      listType={type === 'image' ? 'picture' : 'text'}
      fileList={fileList}
      showUploadList={from === 'Editor' ? false : true}
      onChange={handleChange}
      onRemove={handleRemove}
      action={oss.host}
      maxCount={from === 'Editor' ? 99999 : 1}
      data={getExtraData}
      beforeUpload={beforeUpload}
    >
      {children ? children : <Button icon={<UploadOutlined />}>上传文件</Button>}
    </Upload>
  );
});

export default AliyunOssUpload;
