import React from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from './withAuthorization';
import { MapView } from "expo";
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
  }
})