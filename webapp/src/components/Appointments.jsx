import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Tabs, Icon, Layout } from 'antd';

import withAuthorization from './withAuthorization';
import AppointmentTable from './AppointmentTable';
import AppointmentCalendar from './AppointmentCalendar';
import './Appointments.css';
import { auth, database, firebase } from '../firebase';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

class AppointmentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.appointmentsRef = firebase.database.ref('appointmentsclinic/' + this.props.authUser.uid);
    this.appointmentsGenericRef = firebase.database.ref('appointments').orderByChild('clinic').equalTo(this.props.authUser.uid);
    this.state = {
      data: []
    }
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
                <AppointmentTable data={this.state.data} onChange={this.onChange} />
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

  componentDidMount() {
    this.appointmentsGenericRef.on("value", (snapshot) => {
      let newData = snapshot.val();
      console.log(newData);
      this.setState({
        data: database.parseAppointmentsForDisplay(newData)
      });
      console.log(this.state.data);
    }, function(error) {
      console.log(error);
    });
  }
  componentWillUnmount() {
    this.appointmentsGenericRef.off();
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
