import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Layout} from 'antd';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './Home';
import AccountPage from './Account';

import TestPage from './TestPage';

import * as routes from '../constants/routes';
import withAuthentication from './withAuthentication';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleNavChange = this.handleNavChange.bind(this);
    this.handleNavStyle = this.handleNavStyle.bind(this);
    this.state = {
      collapsed: true,
      contentStyle: {}
    };
  }

  handleNavChange() {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  }

  handleNavStyle(marginLeft) {
    const style = Object.assign({}, { marginLeft : marginLeft });
    this.setState({ contentStyle : style });
  }

  render() {
    const { collapsed, contentStyle } = this.state;
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Navigation 
            collapsed={collapsed} 
            onNavChange={this.handleNavChange}
            onNavStyleChange={this.handleNavStyle}
            />
          <Layout style={contentStyle}>
            <Route exact path={routes.HOME} component={() => <HomePage />} />
            <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
            <Route exact path={routes.TEST} component={() => <TestPage />} />
            <Route exact path={routes.LANDING} component={() => <LandingPage />} />
            <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
            <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
            <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default compose(
  withAuthentication,
  connect(mapStateToProps)
)(App);