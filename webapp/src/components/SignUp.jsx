import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, Form, Icon, Input, Button, message, Divider } from 'antd';
import OpeningHoursList from './OpeningHoursFields';

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

const formItemLabelledLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 12
  }
};

const formItemLayout = {
  wrapperCol: {
    span: 12,
    offset: 6
  },
}

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
      <Form layout="horizontal" onSubmit={this.handleSubmit} className="signup-form">
        <Divider>Account Details</Divider>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid email!',
            }, {
              required: true, message: 'Please input your email!',
            }],
          })(
            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email (Account only)" />
          )}
        </FormItem>
        <FormItem {...formItemLayout}>
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
        <FormItem {...formItemLayout}>
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
        <Divider>Clinic Details</Divider>
        <FormItem {...formItemLabelledLayout} label="Clinic Name" >
          {getFieldDecorator('clinicname', {
            rules: [{ required: true, message: 'Please input your clinic name!' }],
          })(
            <Input prefix={<Icon type="medicine-box" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Input name of clinic" />
          )}
        </FormItem>
        <FormItem {...formItemLabelledLayout} label="Clinic Contact Number" >
          {getFieldDecorator('cliniccontact', {
            rules: [{ required: true, message: 'Please input your clinic\'s contact number!' }],
          })(
            <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Input contact number of clinic" />
          )}
        </FormItem>
        <Divider>Clinic Address</Divider>
        <FormItem {...formItemLabelledLayout} label="Unit/Block Number" >
        {getFieldDecorator('clinicblockno', {
          rules: [{ required: true, message: 'Please input your clinic\'s unit/block number!' }],
        })(
          <Input prefix={<Icon type="environment-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Input unit or block number of clinic" />
        )}
      </FormItem>
      <FormItem {...formItemLabelledLayout} label="Street Name" >
        {getFieldDecorator('clinicstreetname', {
          rules: [{ required: true, message: 'Please input the street name of your clinic\'s location!' }],
        })(
          <Input prefix={<Icon type="environment-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Input street name of clinic's location" />
        )}
      </FormItem>
      <FormItem {...formItemLabelledLayout} label="Postal Code" >
        {getFieldDecorator('clinicpostalcode', {
          rules: [{ required: true, message: 'Please input your clinic\'s postal code!' }],
        })(
          <Input prefix={<Icon type="environment-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Input postal code of clinic" />
        )}
      </FormItem>
      <Divider>Clinic Opening Hours</Divider>
      <OpeningHoursList keys={[]} />
      <FormItem {...formItemLayout}>
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
