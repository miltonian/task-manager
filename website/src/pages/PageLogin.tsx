import { Button, Input, message, Row, Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { makeRequest, CACHED_USER } from '../Request';

const { TabPane } = Tabs;

export const PageLogin = () => {
  return (
    <PageContainer>
      <LoginContainer>
        <Tabs style={{ flex: 1, padding: 10 }}>
          <TabPane tab='Login' key='login'>
            <AuthForm type={'login'} />
          </TabPane>
          <TabPane tab='Register' key='register'>
            <AuthForm type={'register'} />
          </TabPane>
        </Tabs>
      </LoginContainer>
    </PageContainer>
  );
};

type AuthType = 'login' | 'register';
export const authenticateUser = async (
  values: UserAPI.LoginRequest,
  type: AuthType
) => {
  const user = await makeRequest<
    { token: string; userId: number } | { error: string }
  >(`/api/auth/${type}`, 'POST', values);
  if ('error' in user) {
    return message.error(user.error);
  }

  localStorage.setItem(CACHED_USER, user.token);

  window.location.href = '/';
};

const AuthForm: React.FunctionComponent<{ type: AuthType }> = ({ type }) => {
  const [values, setValues] = React.useState<UserAPI.LoginRequest>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const authButtonClicked = async () => {
    if (!values.username || !values.password) {
      return message.warn(`Please fill in all the fields`);
    }
    setLoading(true);
    await authenticateUser(values, type);
    setLoading(false);
  };

  return (
    <>
      <Row>
        <Column>
          Username
          <Input
            placeholder={'johndoe'}
            value={values.username}
            onChange={(e) =>
              setValues((v) => ({ ...v, username: e.target.value }))
            }
          />
        </Column>
      </Row>
      <Row>
        <Column>
          Password
          <Input
            type='password'
            value={values.password}
            onChange={(e) =>
              setValues((v) => ({ ...v, password: e.target.value }))
            }
          />
        </Column>
      </Row>
      <Button
        type='primary'
        loading={loading}
        disabled={loading}
        style={{ width: '100%', margin: 5, marginTop: 10 }}
        onClick={authButtonClicked}
      >
        {type === 'login' ? 'Login' : 'Register'}
      </Button>
    </>
  );
};

const PageContainer = styled.div`
  display: flex;
`;

export const Column = styled.div`
  display: flex;
  flex: 1;
  margin: 5px;
  flex-direction: column;
`;

const LoginContainer = styled.div`
  display: flex;
  margin: auto;
  width: 600px;
  margin-top: 100px;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 0px 10px rgba(30, 30, 35, 0.3);
`;
