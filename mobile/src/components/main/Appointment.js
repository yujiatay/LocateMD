import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
        backgroundColor: '#fff', borderRadius: 10, flexDirection: 'column',
        marginBottom: 20}}>
        <View style={{margin:10}}>
          <Text style={{fontFamily: 'Roboto_light', fontSize: 24}}>{appt.clinicName}</Text>
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
    if (response != null) {
      this.setState({ appointments: response });
    }
  };
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {
          this.state.appointments.map((appointment, i) =>
            <AppointmentCard appointment={appointment} key={i}/>
          )
        }
      </ScrollView>
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
    justifyContent: 'flex-start',
    padding: 20,
    // backgroundColor: '#fff'
  },
});