import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { AppNavigator } from './AppNavigator';
import withAuthentication from '../components/auth/withAuthentication';

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const NavigatorWithAuthState = () => (
    <AppNavigator/>
);

export default compose(withAuthentication, connect(mapStateToProps))(NavigatorWithAuthState);