import { Button, Result } from 'antd';
import React from 'react';
import { history, useIntl } from 'umi';

const NoFoundPage: React.FC = () => {
  const intl = useIntl();
  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage({
        id: 'pages.404.subTitle',
        defaultMessage: 'Sorry, the page you visited does not exist.',
      })}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({ id: 'pages.404.backhome', defaultMessage: 'Back Home' })}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
