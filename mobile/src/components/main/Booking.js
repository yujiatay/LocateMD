import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Card, CardItem, Text, Body } from 'native-base';
import { database } from '../../firebase';
import * as datelib from '../../datelib';

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
import clinicPlaceHolderImage from '../../assets/clinic_placeholder.jpg'
class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeslots: datelib.filterDaySlots((datelib.genDaySlots()), this.props.navigation.state.params.clinic.bookedSlots),
      chosenSlot: -1
    };
    this.bookingSlotHandler = this.bookingSlotHandler.bind(this);
  }

  bookingSlotHandler(chosenSlot) {
    this.setState({
      chosenSlot: parseInt(chosenSlot) - 1
    });
  }

  render() {
    const clinic = this.props.navigation.state.params.clinic;
    const address = clinic.address.blockNo + " " + clinic.address.streetName + " S" + clinic.address.postalCode;
    return (
      <View style={styles.container}>
        <View style={{flex: 2}}>
          <Image source={clinicPlaceHolderImage} style={{ flex: 1, width: '100%', height: null, resizeMode: 'cover' }}/>
        </View>
        <View style={styles.detailsContainer}>
          <DetailItem name="Address" item={address}/>
          <DetailItem name="Opening hours" item="9am to 5pm"/>
          <DetailItem name="Phone" item={clinic.contactNumber}/>
          <BookingSlots bookingSlotHandler={this.bookingSlotHandler} timeslots={datelib.parseForDisplay(this.state.timeslots)}/>
        </View>
        <View style={styles.buttonContainer}>
          <Card style={styles.card}>
            <CardItem button onPress={() => database.joinQueue(clinic.clinicID)} style={styles.cardItem}>
              <Body style={styles.cardItem}>
              <Text style={styles.cardText}>Queue now</Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={styles.card}>
            <CardItem button
                      onPress={() => database.bookAppointment(this.state.timeslots[this.state.chosenSlot],
                        clinic.clinicID)}
                      style={styles.cardItem}>
              <Body style={styles.cardItem}>
              <Text style={styles.cardText}>Book in advance</Text>
              </Body>
            </CardItem>
          </Card>
        </View>
      </View>
    );
  }
}

Booking.navigationOptions = ({navigation}) => ({
  headerTitle: navigation.state.params.clinic.clinicName,
});

export default Booking;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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