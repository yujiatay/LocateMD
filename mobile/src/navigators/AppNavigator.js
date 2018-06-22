import React from 'react'; 
import { connect } from 'react-redux'; 
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { 
  reduxifyNavigator, 
  createReactNavigationReduxMiddleware, 
} from 'react-navigation-redux-helpers'; 

import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import MainNavigator from './MainNavigator';

const middleware = createReactNavigationReduxMiddleware( 
  'root', 
  state => state.nav 
); 
 
const AuthNavigator = createStackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp }
});

const RootNavigator = createSwitchNavigator({
  AuthNav: { screen: AuthNavigator },
  MainNav: { screen: MainNavigator },
});
 
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');
 
const mapStateToProps = state => ({ 
  state: state.nav
}); 
 
const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);
 
export { RootNavigator, AppNavigator, middleware };