import React from 'react';
import { SwitchNavigator } from 'react-navigation';

import Loading from './src/components/Loading'
import SignUp from './src/components/SignUp'
import Login from './src/components/Login'
import Main from './src/components/Main'

const App = SwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main
  },
  {
    initialRouteName: 'Loading'
  }
)
export default App