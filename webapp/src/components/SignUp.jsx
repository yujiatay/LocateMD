import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, Form, Icon, Input, Button, Checkbox, message } from 'antd';

import { auth } from '../firebase';
import * as routes from '../constants/routes';
import './SignUp.css';

const FormItem = Form.Item;

const SignUpPage = ({ history }) => (
  <div className="sign-up">
    <Card title="Sign up">
      <WrappedSignUpForm history={history} />
    </Card>
  </div>
);

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { fullname, email, password } = values;
        const { history } = this.props;
        auth
          .doCreateUserWithEmailAndPassword(email, password)
          .then(authUser => {
            history.push(routes.HOME);
          })
          .catch(error => {
            message.error(error.message);
          });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="signup-form">
        <FormItem>
          {getFieldDecorator('fullname', {
            rules: [{ required: true, message: 'Please input your name!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Full Name" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid email!',
            }, {
              required: true, message: 'Please input your email!',
            }],
          })(
            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const SignUpLink = () => (
  <span>Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link></span>
);

const WrappedSignUpForm = Form.create()(SignUpForm);

export default withRouter(SignUpPage);

export { SignUpLink };
