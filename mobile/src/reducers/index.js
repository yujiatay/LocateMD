import { combineReducers } from 'redux'; 
import navReducer from './navigation';
import sessionReducer from './session';
import userReducer from './user';
 
const AppReducer = combineReducers({ 
  nav: navReducer,
  sessionState: sessionReducer,
  userState: userReducer
}); 
 
export default AppReducer;