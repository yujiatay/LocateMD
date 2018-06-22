import React from 'react';
import { ScrollView, StyleSheet, Text, Image, View } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Logo from '../assets/logo_raster_300x59.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
  },
  logo: {
    flex: 1,
    width: null,
    height: null,
    marginLeft: 20,
    marginRight: 20,
    resizeMode: 'contain'
  }
});

const DrawerSideBar = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo}/>
      </View>
      <DrawerItems {...props} activeItemKey="#000"/>
    </SafeAreaView>
  </ScrollView>
);

export default DrawerSideBar;