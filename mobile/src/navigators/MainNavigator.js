import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Main from '../components/main/Main';
import DrawerSideBar from '../components/main/DrawerSideBar';
import Booking from '../components/main/Booking';

const styles = StyleSheet.create({
  menu: {
    marginLeft: 15
  }
});

const MainStack = createStackNavigator({
  MainScreen: {
    screen: Main,
    navigationOptions: ({navigation}) => ({
      headerLeft:
        <TouchableHighlight underlayColor='transparent' style={styles.menu} onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())}}>
          <Icon name="ios-menu-outline" size={30} color="#000" />
        </TouchableHighlight>,
      headerStyle: {
        backgroundColor: "transparent",
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
      }
    })
  },
  BookScreen: {
    screen: Booking
  }
}, {
  initialRouteName: 'MainScreen',
  navigationOptions: {
    mode: 'modal',
    headerMode: 'screen',

  }
});

const MainNavigator = createDrawerNavigator({
  Home: { screen: MainStack }
}, {
  initialRouteName: 'Home',
  contentComponent: DrawerSideBar,
});

export default MainNavigator;

