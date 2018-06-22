import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth } from '../../firebase/index';
import { NavigationActions } from 'react-navigation';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', errorMessage: null }
  }
  componentDidMount() {
    if (this.props.authUser) {
      this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MainNav' }))
    }
  }
  handleLogin = () => {
    const { email, password } = this.state;
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MainNav' }))
      })
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'SignUp'}))}
        />
      </View>
    )
  }
}

Login.navigationOptions = {
  headerLeft: null
};

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