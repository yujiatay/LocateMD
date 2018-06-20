import React from 'react'; 
import { createDrawerNavigator, createStackNavigator, DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import Main from '../components/Main';

const MainStack = createStackNavigator({
  MainScreen: {
    screen: Main,
    navigationOptions: ({navigation}) => ({
      headerLeft: <Icon name="menu" size={30} color="#000" onPress={ () => { navigation.dispatch(DrawerActions.openDrawer())} }/>,
    })
  }
}, {
  initialRouteName: 'MainScreen',
  navigationOptions: {
    headerMode: 'screen',
    headerStyle: {
      backgroundColor: "transparent",
      position: 'absolute',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0
    }
  }
});

const MainNavigator = createDrawerNavigator({
  Home: { screen: MainStack }
}, {
  initialRouteName: 'Home',
});

export default MainNavigator;

