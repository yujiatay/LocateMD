import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Tabs, Icon, Layout } from 'antd';

import withAuthorization from './withAuthorization';
import AppointmentTable from './AppointmentTable';
import AppointmentCalendar from './AppointmentCalendar';
import './Appointments.css';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Jim Red',
  age: 32,
  address: 'London No. 2 Lake Park',
}];

class AppointmentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }

  render() {
    return (
      <div className="appointments">
        <Layout>
          <Header>
            <p>Appointments</p>
          </Header>
          <Content>
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon type="table" />Table</span>} key="1">
                <AppointmentTable data={data} onChange={this.onChange} />
              </TabPane>
              <TabPane tab={<span><Icon type="calendar" />Calendar</span>} key="2">
                <AppointmentCalendar />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps)
)(AppointmentsPage);
