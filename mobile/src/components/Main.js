import React from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from './withAuthorization';
import { MapView } from "expo";
import Icon from 'react-native-vector-icons/Feather';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 37.78825,
        longitude: -122.4324,
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
          onRegionChange={this._handleMapRegionChange}
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