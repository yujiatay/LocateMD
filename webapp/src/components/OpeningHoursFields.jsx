import { Form, TimePicker, Input, Icon, Button, Row, Col } from 'antd';
import moment from 'moment'
import React, { Component } from 'react';
import './OpeningHoursFields.css';

const FormItem = Form.Item;
const format = 'HH:mm';

let uuid = 0;

class OpeningSlotInput extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      start: value.start || null,
      end: value.end || null
    };
  }


  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleStartChange = (start_moment, string) => {
    if (!('value' in this.props)) {
      this.setState({start: start_moment})
    }
    this.triggerChange({start: start_moment})
  }

  handleEndChange = (end_moment, string) => {
    if (!('value' in this.props)) {
      this.setState({end: end_moment})
    }
    this.triggerChange({end: end_moment})
  }

  removeSlot = () => {
    this.props.remove()
  }

  triggerChange = (changedState) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedState))
    }
  }

  render() {
    const state = this.state;
    return (
      <span>
        <TimePicker value={state.start} format={format} onChange={this.handleStartChange}/>
        <Icon className="to-icon"
              type="arrow-right"
        />
        <TimePicker value={state.end} format={format} onChange={this.handleEndChange} />
        <Icon className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.removeSlot()}
        />
      </span>
    )
  }
}

class OpeningHours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: 'key_' + props.day,
      values: 'slots_' + props.day
    };
    this.remove.bind(this);
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

  validateOpeningHours = (rule, value, callback) => {
    let isValidSlot = (slot) => {
      return !(slot === undefined || slot === null || value.start === null || value.end === null);
    };

    let timeValue = (time) => {
      return time.hour() * 60 + time.minute();
    };

    const { form } = this.props;

    if (!isValidSlot(value)) {
      callback("Please fill in both start and end time!")
    } else if (timeValue(value.start) >= timeValue(value.end)) {
      callback("End time cannot be before start time!")
    } else {
      console.log(form.getFieldValue(this.state.keys).map((key) => form.getFieldValue(`${this.state.values}[${key}]`)));
      let validSlots = form.getFieldValue(this.state.keys).map((key) => form.getFieldValue(`${this.state.values}[${key}]`)).filter(isValidSlot);
      if (validSlots.some((slot) => {
        return slot !== value &&
          ((timeValue(slot.start) >= timeValue(value.start) && timeValue(slot.start) <= timeValue(value.end)) ||
            (timeValue(slot.start) <= timeValue(value.start) && timeValue(slot.end) >= timeValue(value.end)) ||
            (timeValue(slot.end) >= timeValue(value.start) && timeValue(slot.end) <= timeValue(value.end)));
      })) {
        callback("One or more time-slots overlap!")
      } else {
        callback();
      }
    }
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
          <FormItem
            {...(index === 0 ? hoursLabelledLayout : hoursUnlabelledLayout)}
            label={index === 0 ? this.getDay() : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`${this.state.values}[${k}]`, {
              rules: [{
                required: true,
                validator: this.validateOpeningHours
              }],
            })(
              <OpeningSlotInput remove={() => this.remove(k)}/>
            )
            }
          </FormItem>
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