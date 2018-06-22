import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MapView } from "expo";
import { Item, Input } from 'native-base';
import Swiper from 'react-native-swiper';
import withAuthorization from '../auth/withAuthorization';
import { MapStyleDefault } from "./MapStyles";

const Slide = props => {
  return (
    <View style={styles.slide}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  )
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 1.3521,
        longitude: 103.8198,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      clinicList: [{ text: "Hello" }, { text: "Mushimush"}]
    };
  }
  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };
  render() {
    return (
      <View style={styles.container}>
        <Item regular style={styles.searchbox}>
          <Input placeholder='Clinics near me' />
        </Item>
        <View style={styles.swiper}>
          <Swiper showsPagination={false}>
            {
              this.state.clinicList.map((item, i) =>
                <Slide
                text={item.text}
                key={i}/>)
            }
          </Swiper>
        </View>
        <MapView
          style={{ alignSelf: 'stretch', flex: 1 }}
          region={this.state.mapRegion}
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
  slide: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    color: '#9DD6EB',
    fontSize: 30,
    fontWeight: 'bold'
  }
});