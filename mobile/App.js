import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import AppReducer from './src/reducers';
import { middleware } from './src/navigators/AppNavigator';
import WrappedAuthNavigator from './src/components/WrappedAuthNavigator';

const store = createStore(AppReducer, applyMiddleware(middleware));

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <WrappedAuthNavigator />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('App', () => App);

export default App;