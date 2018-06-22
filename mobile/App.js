import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import WrappedAuthNavigator from './src/navigators/NavigatorWithAuthState';
import configureStore from './src/reducers/configureStore';

console.ignoredYellowBox = [
  'Setting a timer'
];

const { store, persistor } = configureStore();
class App extends React.Component {
  render() {
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