import { Form, TimePicker, DatePicker, Icon, Button, Row, Col } from 'antd';
import moment from 'moment'
import React, { Component } from 'react';
import './OpeningHoursFields.css';

const FormItem = Form.Item;
const format = 'HH:mm';

let uuid = 0;
class OpeningHours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: 'key_' + props.day,
      values: 'slots_' + props.day
    }
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(this.state.keys);

    // can use data-binding to set
    form.setFieldsValue({
      [this.state.keys]: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(this.state.keys);
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      [this.state.keys]: nextKeys,
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 12,
        offset: 6
      },
    };
    const formItemLabelledLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 3
      }
    };
    getFieldDecorator(this.state.keys, { initialValue: [] });
    const keys = getFieldValue(this.state.keys);
    const formItems = keys.map((k, index) => {
      return (
        <Row type="flex" justify="center">
        <Col span={18}>
            <Col span={9}>
              <FormItem
                {...formItemLabelledLayout}
                label={index === 0 ? 'Passengers' : ''}
                required={false}
                key={k}
              >
                {getFieldDecorator(`${this.state.values}[${k}].start`, {
                  rules: [{
                    required: true,
                    message: "Please choose a time slot or delete this field.",
                  }],
                })(
                  <TimePicker format={format}/>
                )
                }
              </FormItem>
            </Col>
            <Col span={3}>
              <Icon className="to-icon"
                    type="arrow-right"
              />
            </Col>
            <Col span={3}>
              <FormItem
                required={false}
                key={k}
              >
                {getFieldDecorator(`${this.state.values}[${k}].end`, {
                  rules: [{
                    required: true,
                    message: "Please choose a time slot or delete this field.",
                  }],
                })(
                  <TimePicker format={format}/>
                )
                }
                <Icon className="dynamic-delete-button"
                      type="minus-circle-o"
                      onClick={() => this.remove(k)}
                />
              </FormItem>
            </Col>
        </Col>
        </Row>
      );
    });
    return (
      <div>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
            <Icon type="plus" /> Add time slot
          </Button>
        </FormItem>
      </div>
    );
  }
}

export default OpeningHours