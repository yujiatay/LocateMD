import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Icon, Input, Button, message } from 'antd';

import { auth } from '../firebase';
import './PasswordForget.css';

const FormItem = Form.Item;

const PasswordForgetPage = () => (
  <div className="password-forget">
    <Card title="Password Reset">
      <WrappedPasswordForgetForm />
    </Card>
  </div>
);

class PasswordForgetForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email } = values;

        auth
          .doPasswordReset(email)
          .then(() => { 
            message.success('Your password has been reset successfully. Please check your email.');
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
      <Form onSubmit={this.handleSubmit} className="password-reset-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email address" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Reset My Password
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedPasswordForgetForm = Form.create()(PasswordForgetForm);

const PasswordForgetLink = () => (
  <Link to="/pw-forget">Forgot Password</Link>
);

export default PasswordForgetPage;

export { WrappedPasswordForgetForm, PasswordForgetLink };