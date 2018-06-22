import React from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MapView } from "expo";
import { Item, Input } from 'native-base';
import withAuthorization from './withAuthorization';
import { MapStyleDefault } from "./MapStyles";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 1.3521,
        longitude: 103.8198,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
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
    shadowRadius: 10,
    elevation: 5,
  }
});