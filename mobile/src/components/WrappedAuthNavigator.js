import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { AppNavigator } from '../navigators/AppNavigator';
import withAuthentication from './withAuthentication';

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const WrappedAuthNavigator = () => (
    <AppNavigator />
);

export default compose(withAuthentication, connect(mapStateToProps))(WrappedAuthNavigator);