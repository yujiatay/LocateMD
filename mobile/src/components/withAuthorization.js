import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { firebase } from '../firebase';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Login'}));
        }
      });
    }

    render() {
      return this.props.authUser ? <Component /> : null;
    }
  }

  const mapStateToProps = state => ({
    authUser: state.sessionState.authUser
  });

  return connect(mapStateToProps)(WithAuthorization);
};

export default withAuthorization;
