import { AsyncStorage } from 'react-native'; 
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AppReducer from './index';
import { middleware } from '../navigators/AppNavigator';

const persistConfig = {
  key: 'root',
  storage: storage,
};
const middlewares = [];
middlewares.push(middleware);
if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}
const persistedReducer = persistReducer(persistConfig, AppReducer);

export default () => {
  let store = compose(applyMiddleware(...middlewares))(createStore)(persistedReducer);
    // createStore(persistedReducer, applyMiddleware(middleware));
  let persistor = persistStore(store);
  return { store, persistor }
}