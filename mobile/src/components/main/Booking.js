import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import {connect} from 'react-redux';
import { Card, CardItem, Body } from 'native-base';
import { database } from '../../firebase';
import * as datelib from '../../datelib';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const DetailItem = ({name, item}) => (
  <View>
    <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto_light' }}>{name}</Text>
    <Text style={{ fontFamily: 'Roboto_light' }}>{item}</Text>
  </View>
);
class Slot extends React.Component {
  constructor(props) {
    super(props);
  }
  _onPress = () => {
    this.props.selectHandler(this.props.val);
  };
  render() {
    return (
      <TouchableOpacity onPress={this._onPress}
                        style={
                          { borderRadius: 20,
                            borderColor: this.props.active ? '#901148' : '#db1168',
                            borderWidth: 1,
                            backgroundColor: this.props.active ? '#901148' : '#fff',
                            padding: 5,
                            marginLeft: 2,
                            marginRight: 2,
                            marginTop: 1,
                            marginBottom: 1
                          }}>
        <Text style={{ color: this.props.active ? '#fff' : '#db1168', fontFamily: 'Roboto_light' }}>{this.props.time}</Text>
      </TouchableOpacity>
    )
  }
}

class BookingSlots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
    this.selectHandler = this.selectHandler.bind(this);
  }
  selectHandler(index) {
    this.setState({
      selected: parseInt(index)
    }, () => this.props.bookingSlotHandler(parseInt(index)))
  }
  render() {
    return (
      <View>
        <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto_light' }}>Available slots</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            this.props.timeslots.map((time, i) =>
              <Slot time={time} selectHandler={this.selectHandler} active={this.state.selected === i} val={i} key={i}/>
            )
          }
        </View>
      </View>
    );
  }
}
import clinicPlaceHolderImage from '../../assets/clinic_placeholder.jpg';
import PopupDialog, { ScaleAnimation, DialogButton } from 'react-native-popup-dialog';
import { ActivityIndicator, Modal } from 'react-native';

class SpinnerOverlay extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const loading = this.props.loading;
    return (
      <Modal transparent={true} animationType={'none'} visible={loading} onRequestClose={()=>{}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around',
          backgroundColor: '#00000040'}}>
          <View style={{backgroundColor: '#fff', height: 100, width: 100,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
            <ActivityIndicator size="large" animating={loading}/>
          </View>
        </View>
      </Modal>
    );
  }
}

class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeslots: datelib.filterDaySlots((datelib.genBookingSlots(this.props.navigation.state.params.clinic.openingHours)),
      this.props.navigation.state.params.clinic.bookedSlots),
      isOpen: datelib.checkQueueOpening(this.props.navigation.state.params.clinic),
      chosenSlot: -1,
      loading: false,
      bookingResult: '',
      queueNumber: '',
      waitingTime: ''
    };
    this.bookingSlotHandler = this.bookingSlotHandler.bind(this);
  }
  bookingSlotHandler(chosenSlot) {
    if (this.state.isOpen) {
      this.setState({
        chosenSlot: parseInt(chosenSlot) - 1
      });
    } else {
      this.setState({
        chosenSlot: parseInt(chosenSlot)
      });
    }
  }
  _bookAppointment = async () => {
    this.setState({ loading : true });
    let response = await database.bookAppointment(this.state.timeslots[this.state.chosenSlot],
      this.props.navigation.state.params.clinic.clinicID, this.props.authUser);
    setTimeout(() => {
      this.setState({ loading: false, bookingResult: response === null ? false : true });
      this.popupDialog.show();
    }, 2500);
  };
  _joinQueue = async () => {
    this.setState({ loading : true });
    let response = await database.joinQueue(this.props.navigation.state.params.clinic.clinicID, this.props.authUser);
    let waitingTime = Math.round((new Date(response.appointment.startTime) - new Date(Date.now())) / 60000);
    setTimeout(() => {
      this.setState({
        loading: false,
        bookingResult: response === null ? false : true,
        queueNumber: '' + response.appointment.queueNum,
        waitingTime: '' + waitingTime + ' min'
      });
      this.popupDialog.show();
    }, 2500);
    throw response.appointment
  };
  _closeDialog = () => {
    this.popupDialog.dismiss();
    this.props.navigation.goBack();
  };
  render() {
    const scaleAnimation = new ScaleAnimation();
    const clinic = this.props.navigation.state.params.clinic;
    const address = clinic.address.blockNo + " " + clinic.address.streetName + " S" + clinic.address.postalCode;
    return (
      <View style={styles.container}>
        <SpinnerOverlay loading={this.state.loading}/>
        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{width: '80%', borderRadius: 10}}
          containerStyle={{elevation: 10, flex: 1, alignItems: 'center', flexDirection: 'column'}}
          actions={[
            <DialogButton text="DONE"
              textStyle={{fontFamily: 'Roboto_light'}}
              onPress={() => {this._closeDialog();}}
              key="done-button"
            />,
          ]}
        >
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10}}>
            { this.state.bookingResult
              ? <SimpleLineIcons name="check" size={100} color="#00cd00"/>
              : <SimpleLineIcons name="close" size={100} color="#e50000"/>}
            <Text style={{fontFamily: 'Roboto_light'}}>{this.state.bookingResult ? "Booking was successful" : "Booking failed. Please try again."}</Text>
            {this.state.queueNumber.length > 0 && <Text style={{fontFamily: 'Roboto_light'}}>Your queue number is {this.state.queueNumber}</Text> }
            {this.state.waitingTime.length > 0 && <Text style={{fontFamily: 'Roboto_light'}}>Estimated waiting time: {this.state.waitingTime}</Text> }
          </View>
        </PopupDialog>
        <View style={{flex: 2}}>
          <Image source={clinicPlaceHolderImage} style={{ flex: 1, width: '100%', height: null, resizeMode: 'cover' }}/>
        </View>
        <View style={styles.detailsContainer}>
          <DetailItem name="Address" item={address}/>
          <DetailItem name="Opening hours" item={datelib.getOpeningHoursForToday(clinic.openingHours)}/>
          <DetailItem name="Phone" item={clinic.contactNumber}/>
          <BookingSlots bookingSlotHandler={this.bookingSlotHandler} timeslots={datelib.parseForDisplay(this.state.timeslots, this.state.isOpen)}/>
        </View>
        <View style={styles.buttonContainer}>
          { this.state.chosenSlot < 0
          ? <Card style={styles.card}>
              <CardItem button onPress={this._joinQueue} style={styles.cardItem}>
                <Body style={styles.cardItem}>
                <Text style={styles.cardText}>Queue now</Text>
                </Body>
              </CardItem>
            </Card>
          : <Card style={styles.card}>
              <CardItem button
                        onPress={this._bookAppointment}
                        style={styles.cardItem}>
                <Body style={styles.cardItem}>
                <Text style={styles.cardText}>Book in advance</Text>
                </Body>
              </CardItem>
            </Card>
          }
        </View>
      </View>
    );
  }
}

Booking.navigationOptions = ({navigation}) => ({
  headerTitle: navigation.state.params.clinic.clinicName,
});

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Booking);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
  },
  card: {
    height: 50,
    backgroundColor: '#db1168',
    borderRadius: 10
  },
  cardItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#db1168'
  },
  cardText: {
    color: '#fff',
    fontSize: 14
  },
  text: {
    fontFamily: 'Roboto_light',
    fontSize: 14
  }
});
