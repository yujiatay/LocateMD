import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { database } from "../../firebase";

class AppointmentCard extends React.Component {
  constructor(props) {
    super(props);
  }
  _generateDateTime(datetime) {
  }
  render() {
    const appt = this.props.appointment;
    return (
      <View style={{width: '100%', height: null, elevation: 3,
        backgroundColor: '#fff', borderRadius: 10, flexDirection: 'column'}}>
        <View style={{margin:10}}>
          <Text style={{fontFamily: 'Roboto_light', fontSize: 24}}>{appt.clinic}</Text>
        </View>

        <View style={{flexDirection:'row', margin: 10, justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <Ionicons name="md-calendar" size={30} color="#525a66"/>
            <Text style={{fontFamily: 'Roboto_light', fontSize: 14, marginLeft: 10}}>7 July 18 5.00PM</Text>
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name="x" size={30} color="#b72c2c" />
              <Text style={{fontFamily: 'Roboto_light', fontSize: 14}}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: []
    }
  }
  componentDidMount() {
    this._getAppointments();
  }
  _getAppointments = async () => {
    let response = await database.getAppointments(this.props.authUser);
    throw response
    if (response != null) {
      this.setState({ appointments: response });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        {
          this.state.appointments.map(appointment =>
            <AppointmentCard appointment={appointment}/>
          )
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});
export default connect(mapStateToProps)(Appointment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    // backgroundColor: '#fff'
  },
});