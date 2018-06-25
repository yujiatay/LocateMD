import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MapView, Constants, Location, Permissions } from "expo";
import { Item, Input, Icon } from 'native-base';
import Swiper from 'react-native-swiper';
import withAuthorization from '../auth/withAuthorization';
import { MapStyleDefault } from "./MapStyles";
import ClinicInfo from './ClinicInfo';
import { auth, database, firebase } from '../../firebase';

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
  render() {
    return (
      <View style={styles.container}>
        <Item regular style={styles.searchbox}>
          <Icon active name="ios-search"/>
          <Input placeholder='Clinics Near Me' style={styles.text}/>
        </Item>
        <View style={styles.swiper}>
          <Swiper showsPagination={false} loop={false}>
            {
              this.state.clinicList.map((item, i) =>
                <ClinicInfo
                clinic={item}
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

      </View>
    )
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const authCondition = authUser => !!authUser;

export default compose(withAuthorization(authCondition), connect(mapStateToProps))(Main);

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
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
  },
  swiper: {
    bottom: 0,
    position: 'absolute',
    zIndex: 10,
    height: 300,
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 20,

  }
});
