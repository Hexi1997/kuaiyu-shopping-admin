import { useState, memo, FC } from 'react';

import { ContentUtils } from 'braft-utils';
// 引入编辑器组件
import BraftEditor, { EditorState, ExtendControlType } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { PictureOutlined } from '@ant-design/icons';
import AliyunOssUpload from '../AliyunOssUpload';

type PropTypes = {
  callback: Function;
  initValue: string;
};

const Editor: FC<PropTypes> = memo(({ callback, initValue }) => {
  // 创建一个空的editorState作为初始值
  const [value, setValue] = useState(BraftEditor.createEditorState(initValue));

  const uploadSus = (params: string[]) => {
    //回调出图片地址
    console.log('上传的图片地址是', params);
    setValue(
      ContentUtils.insertMedias(value, [
        {
          type: 'IMAGE',
          url: params[params.length - 1],
        },
      ]),
    );
  };

  const handleChange = (value: EditorState) => {
    const html = value.toHTML();

    console.log('触发onChange', html);
    setValue(value);
    if (html.trim() === `<p></p>`) {
      callback('');
    } else {
      callback(html);
    }
  };

  const extendControls: ExtendControlType[] = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <AliyunOssUpload type="image" callback={uploadSus} from="Editor">
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            <PictureOutlined />
          </button>
        </AliyunOssUpload>
      ),
    },
  ];
  return (
    <div className="my-component">
      <BraftEditor
        controls={['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']}
        contentStyle={{ height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
        extendControls={extendControls}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
});

export default Editor;
