import React from 'react';
import { StyleSheet, View, Dimensions, Platform, Text, TouchableOpacity, Button, FlatList, Keyboard, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MapView, Constants, Location, Permissions } from "expo";
import { Marker } from 'react-native-maps';
import { Item, Input, Icon, Card, List, ListItem } from 'native-base';
import Swiper from '../../react-native-swiper/Swiper';
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
      userLocationLat: 1.3521,
      userLocationLon: 103.8198,
      errorMessage: '',
      clinicsObj: {},
      clinicList: [],
      searchSuggestions: []
    };
    this._animateMapToMarker = this._animateMapToMarker.bind(this);
  }
  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
      this._getClinics();
      this._getTravelTimes();
      this._allowNotifs();
    }
  }
  componentWillUnmount() {
    this.clinicsRef.off();
  }
  _allowNotifs = async () => {
    let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to send notifications was denied',
      });
    }
  }
  _getClinics = async () => {
    // TODO: Store object using redux
    this.clinicsRef.on("value", (snapshot) => {
      let newData = snapshot.val();
      this.setState({
        clinicList: database.parseClinics(newData, this.state.userLocationLat, this.state.userLocationLon),
        clinicsObj: newData
      });
    }, function(error) {
      console.log(error);
    });
  };
  _getTravelTimes = async () => {
    let res = await database.getTravelTimes(this.state.clinicList, this.state.userLocationLat, this.state.userLocationLon)
    this.setState({
      clinicList: res,
    })
  }
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
      },
      userLocationLat: location.coords.latitude,
      userLocationLon: location.coords.longitude,
    }));
  };
  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _filterByClinicName = (searchString) => {
    let validClinics = {};
    let clinicObj = this.state.clinicsObj;
    let regSearch = new RegExp(searchString, 'i' );
    Object.keys(clinicObj).forEach((key) => {
      if (clinicObj[key].clinicName.search(regSearch) !== -1) {
        validClinics[key] = {...clinicObj[key]};
      }
    });
    this.setState({
      clinicList: database.parseClinics(validClinics)
    });
    // return validClinics;
  };
  _searchSuggestions = (searchString) => {
    if (searchString === "") {
      return this._clearSearchSuggestions();
    }
    let validNames = [];
    let clinicObj = this.state.clinicsObj;
    let regSearch = new RegExp(searchString, 'i' );
    Object.keys(clinicObj).forEach((key) => {
      if (clinicObj[key].clinicName.search(regSearch) !== -1) {
        validNames.push(clinicObj[key].clinicName);
      }
    });
    this.setState({
      searchSuggestions: validNames
    });
  };
  _clearSearchSuggestions = () => {
    this.setState({searchSuggestions: []});
  };
  _animateMapToMarker = (index) => {
    let markerCoord = {
      latitude: this.state.clinicList[index].coords.lat,
      longitude: this.state.clinicList[index].coords.lon
    };
    this._map.animateToCoordinate(markerCoord, 100);
  };
  render() {
    return (
      // Overarching container
      <View style={styles.container}>
        <MapView
          ref={(el) => this._map = el}
          style={{ position: "absolute", width: "100%", height: "100%"}}
          region={this.state.mapRegion}
          showsUserLocation={true}
          customMapStyle={MapStyleDefault}
          onRegionChangeComplete={this._handleMapRegionChange}
          onPress={() => {
            this._clearSearchSuggestions();
            Keyboard.dismiss();
          }}
        >
          {this.state.clinicList.map((clinic, i) => (
            <Marker
              coordinate={{latitude: clinic.coords.lat, longitude: clinic.coords.lon}}
              title={clinic.clinicName}
              key={i}
            />
          ))}
        </MapView>
        <View style={{top: "10%", position: "absolute", width: "90%"}} >
          <Item regular style={styles.searchbox}>
            <Icon active name="ios-search"/>
            <Input
              onSubmitEditing={(e) => {
                this._filterByClinicName(e.nativeEvent.text);
                this._clearSearchSuggestions();
              }}
              clearTextOnFocus
              onChangeText={(searchText) => this._searchSuggestions(searchText)}
              placeholder='Search Clinics'
              style={styles.text}
            />
          </Item>
          <FlatList
            data={this.state.searchSuggestions}
            renderItem={({item}) =>
              <ListItem noIndent style={{backgroundColor: "#fff"}}
                        onPress={() => {
                          this._filterByClinicName(item);
                          this._clearSearchSuggestions();
                          Keyboard.dismiss();
                        }}
              >
                <Text style={styles.suggestions}>{item}</Text>
              </ListItem>
            }
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps='always'
          />

        </View>
        <View style={styles.swiper}>
          <Swiper showsPagination={false} loop={false}
            onIndexChanged={this._animateMapToMarker}>
            {
              this.state.clinicList.map((item, i) =>
                <ClinicInfo
                  clinic={item}
                  navigation={this.props.navigation}
                  key={i}/>)
            }
          </Swiper>
        </View>
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
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchbox: {
    backgroundColor: '#fff',
    zIndex: 10,
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
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    height: 150,
    width: '100%',
    backgroundColor: 'transparent',
  },
  suggestions: {
    fontSize: 20,
    fontFamily: 'Roboto_light'
  },
  text: {
    fontSize: 20,
    fontFamily: 'Roboto_light'
  }
});
