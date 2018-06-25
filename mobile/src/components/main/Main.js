import React from 'react';
import { StyleSheet, View, Dimensions, Platform, Text, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MapView, Constants, Location, Permissions } from "expo";
import { Item, Input, Icon, Card } from 'native-base';
import Swiper from 'react-native-swiper';
import withAuthorization from '../auth/withAuthorization';
import { MapStyleDefault } from "./MapStyles";
import ClinicInfo from './ClinicInfo';
import { auth, database, firebase } from '../../firebase';
import Modal from "react-native-modal";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.clinicsRef = firebase.database.ref('clinics');
    this.state = {
      mapRegion: {
        latitude: 1.3521,
        longitude: 103.8198,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      errorMessage: '',
      clinicsObj: {},
      clinicList: [],
      isModalVisible: false
    };
  }
  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
      this._getClinics();
      // Location.watchPositionAsync({ timeInterval: 600, distanceInterval: 50 }, this._locationChanged);
    }
  }
  componentWillUnmount() {
    this.clinicsRef.off();
  }
  _getClinics = () => {
    this.clinicsRef.once("value", (snapshot) => {
      let newData = snapshot.val();
      this.setState({
        clinicList: database.parseClinics(newData),
        clinicsObj: newData
      });
    }, function(error) {
      console.log(error);
    });
  };
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState(prevState => ({
      mapRegion: {
        ...prevState.mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    }));
  };
  _locationChanged = (location) => {
  };
  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });
  render() {
    return (
      <View style={styles.container}>
        <Item regular style={styles.searchbox}>
          <Icon active name="ios-search"/>
          <Input placeholder='Clinics Near Me' style={styles.text}/>
          <TouchableOpacity onPress={this._toggleModal}>
            <Text>Show Modal</Text>
          </TouchableOpacity>
        </Item>
        <View style={styles.swiper}>
          <Swiper showsPagination={false} loop={false}>
            {
              this.state.clinicList.map((item, i) =>
                <ClinicInfo
                  clinic={item}
                  navigation={this.props.navigation}
                  key={i}/>)
            }
          </Swiper>
        </View>
        <MapView
          style={{ alignSelf: 'stretch', flex: 1 }}
          region={this.state.mapRegion}
          showsUserLocation={true}
          customMapStyle={MapStyleDefault}
          onRegionChangeComplete={this._handleMapRegionChange}
        />
        <Modal isVisible={this.state.isModalVisible}
               onSwipe={this._toggleModal} swipeDirection="down" onBackButtonPress={this._toggleModal}
               backdropColor={'transparent'}>
          <View style={{ flex: 1 }}>
            <Card style={styles.modal}>
              <View style={{ flex: 1, }}>
                <Text style={{ fontSize: 24, fontFamily: 'Roboto_light' }}>Tay Family Clinic</Text>
                <TouchableOpacity><Button onPress={() => {}} title="Queue Now" /></TouchableOpacity>
                <TouchableOpacity><Button onPress={() => {}} title="Book for later"/></TouchableOpacity>
              </View>
            </Card>
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const authCondition = authUser => !!authUser;

// export default compose(withAuthorization(authCondition), connect(mapStateToProps))(Main);
export default connect(mapStateToProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchbox: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    top: 100,
    zIndex: 10,
    position: 'absolute',
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: 3,
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  swiper: {
    bottom: 0,
    position: 'absolute',
    zIndex: 10,
    height: 200,
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#cdcdcd',
    elevation: 1
  },
  text: {
    fontSize: 20,
    fontFamily: 'Roboto_light'
  }
});
