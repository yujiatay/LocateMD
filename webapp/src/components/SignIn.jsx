import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Form, Icon, Input, Button, Checkbox, message } from 'antd';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import './SignIn.css';

const FormItem = Form.Item;

const SignInPage = ({ history }) => (
  <div className="sign-in">
    <Card title="Sign In">
      <WrappedSignInForm history={history} />
    </Card>
  </div>
);

class SignInForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password, remember } = values;
        const { history } = this.props;

        auth
          .doSignInWithEmailAndPassword(email, password)
          .then(() => {
            history.push(routes.HOME);
          })
          .catch(error => {
            message.error(error.message);
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <div className="login-form-forgot">
            <PasswordForgetLink/>
          </div>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <SignUpLink />
        </FormItem>
      </Form>
    );
  }
}

const WrappedSignInForm = Form.create()(SignInForm);

export default withRouter(SignInPage);