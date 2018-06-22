import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Main from '../components/main/Main';
import DrawerSideBar from '../components/main/DrawerSideBar'

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
        </TouchableHighlight>
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
  contentComponent: DrawerSideBar,
});

export default MainNavigator;

