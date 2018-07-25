import { Form, TimePicker, Input, Icon, Button, Row, Col } from 'antd';
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

  getDay= () => {
    switch(this.props.day) {
      case "mon":
        return "Monday";
      case "tue":
        return "Tuesday";
      case "wed":
        return "Wednesday";
      case "thu":
        return "Thursday";
      case "fri":
        return "Friday";
      case "sat":
        return "Saturday";
      case "sun":
        return "Sunday";
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
    const formItemLabelledLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 12
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 12,
        offset: 6
      },
    };
    const hoursLabelledLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 12
      }
    };
    const hoursUnlabelledLayout = {
      wrapperCol: {
        span: 12,
        offset: 6
      },
    };
    getFieldDecorator(this.state.keys, { initialValue: [] });
    const keys = getFieldValue(this.state.keys);

    const formItems = (keys.length === 0) ?
      <FormItem
        {...formItemLabelledLayout}
        label={this.getDay()}
        required={false}
      >
       <Input disabled={true} placeholder="Closed"/>
      </FormItem>
      : keys.map((k, index) => {
      return (
        <Row type="flex" justify={"center"}>
            <Col span={7}>
              <FormItem
                {...(index === 0 ? hoursLabelledLayout : hoursUnlabelledLayout)}
                label={index === 0 ? this.getDay() : ''}
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
            <Col span={6}>
              <FormItem
                wrapperCol={{
                  span: 13
                }}
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
        </Row>
      );
    });
    return (
      <div>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add time slot
          </Button>
        </FormItem>
      </div>
    );
  }
}

export default OpeningHours