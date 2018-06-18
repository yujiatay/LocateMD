import React from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from './withAuthorization';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const user = this.props.authUser;
    return (
      <View style={styles.container}>
        <Text>
          Hi {user.email}!
        </Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const authCondition = authUser => !!authUser;

export default compose(withAuthorization(authCondition), connect(mapStateToProps))(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})