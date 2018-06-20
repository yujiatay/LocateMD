import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth } from '../firebase';
import { NavigationActions } from 'react-navigation';

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleSignUp = () => {
    auth
      .doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MainNav'})))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Login'}))}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})