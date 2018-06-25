import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Expo from "expo";
import WrappedAuthNavigator from './src/navigators/NavigatorWithAuthState';
import configureStore from './src/reducers/configureStore';

console.ignoredYellowBox = [
  'Setting a timer'
];

const { store, persistor } = configureStore();
class App extends React.Component {
  state = {
    isReady: false
  };
  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Roboto_light': require('./src/assets/Roboto-Light.ttf'),
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <WrappedAuthNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
AppRegistry.registerComponent('LocateMD', () => App);