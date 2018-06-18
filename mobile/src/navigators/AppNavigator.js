import React from 'react'; 
import { connect } from 'react-redux'; 
import { createStackNavigator } from 'react-navigation'; 
import { 
  reduxifyNavigator, 
  createReactNavigationReduxMiddleware, 
} from 'react-navigation-redux-helpers'; 
import { compose } from 'recompose';
 
import Login from '../components/Login';
import Main from '../components/Main';
import SignUp from '../components/SignUp';
import withAuthentication from '../components/withAuthentication';
 
const middleware = createReactNavigationReduxMiddleware( 
  'root', 
  state => state.nav 
); 
 
const RootNavigator = createStackNavigator({ 
  Login: { screen: Login }, 
  Main: { screen: Main }, 
  SignUp: { screen: SignUp }, 
}, {
  initialRouteName: 'Login'
}); 
 
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root'); 
 
const mapStateToProps = state => ({ 
  state: state.nav
}); 
 
const AppNavigator = connect(mapStateToProps)(AppWithNavigationState); 
 
export { RootNavigator, AppNavigator, middleware };