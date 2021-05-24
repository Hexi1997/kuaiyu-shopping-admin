import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';

import styles from './index.less';

export type LoginProps = {
  dispatch: Dispatch;
  submitting?: boolean;
};

const Login: React.FC<LoginProps> = (props) => {
  let { submitting } = props;
  const intl = useIntl();

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };
  return (
    <div className={styles.main}>
      <ProForm
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values as LoginParamsType);
          return Promise.resolve();
        }}
      >
        <Tabs>
          <Tabs.TabPane
            key="account"
            tab={intl.formatMessage({
              id: 'pages.login.accountLogin.tab',
              defaultMessage: 'Account password login',
            })}
          />
        </Tabs>
        <>
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.email.placeholder',
              defaultMessage: 'Email: super@a.com',
            })}
            rules={[
              {
                type: 'email',
                message: (
                  <FormattedMessage
                    id="pages.login.email.type"
                    defaultMessage="Email type is not correct!"
                  />
                ),
              },
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.email.required"
                    defaultMessage="Please enter email!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
              defaultMessage: 'Password:123123',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="Please enter password！"
                  />
                ),
              },
            ]}
          />
        </>
      </ProForm>
    </div>
  );
};

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['login/login'],
}))(Login);
