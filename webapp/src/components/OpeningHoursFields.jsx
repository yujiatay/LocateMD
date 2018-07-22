import { Form, Input, Icon, Button } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 12,
    offset: 6
  },
};

const OpeningHoursList = ({keys, moments, onRemove}) => {
  // return keys.map((k, index) => {
  if (keys.length === 0) {
  return <FormItem
    {...formItemLayoutWithOutLabel}
    required={false}
    >
      <Input placeholder="Not operating" disabled style={{ width: '90%', marginRight: 8 }}/>
    </FormItem>;
  } else {
    return keys.map((k, index) => {
      return <FormItem
        {...formItemLayoutWithOutLabel}
        required={false}
        key={k}
        >
          <Input placeholder="passenger name" style={{ width: '90%', marginRight: 8 }} />

          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.onRemove(1)}
          />

        </FormItem>
      });
    }
  };

  export default OpeningHoursList;
