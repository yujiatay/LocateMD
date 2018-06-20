import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import sessionReducer from './session';
import userReducer from './user';
import { RootNavigator } from '../navigators/AppNavigator';

const navReducer = createNavigationReducer(RootNavigator);
const AppReducer = combineReducers({ 
  nav: navReducer,
  sessionState: sessionReducer,
  userState: userReducer
}); 
 
export default AppReducer;