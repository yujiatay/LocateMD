import React from 'react';
import { auth } from '../firebase';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { firebase } from '../firebase';

class Loading extends React.Component {
  componentDidMount() {
    firebase.auth.onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Main' : 'Login')
    })
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})