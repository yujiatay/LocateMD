import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Affix, Menu, Icon } from 'antd';

import SignOutButton from './SignOut';
import * as routes from '../constants/routes';
import LogoPng from '../assets/logo_raster_300x59.png';
import './Navigation.css';

const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={routes.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={routes.HOME}>Home</Link>
    </li>
    <li>
      <Link to={routes.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={routes.TEST}>Test</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <Affix>
  <div className="nonauth-menu">
    <div className="logo">
      <img src={LogoPng}/>
    </div>
    <div className="menu-container">
    <Menu mode="horizontal">
      <Menu.Item key="landing">
        <Link to={routes.LANDING}>Home</Link>
      </Menu.Item>
      <Menu.Item key="signin">
        <Link to={routes.SIGN_IN}>Sign In</Link>
      </Menu.Item>
    </Menu>
    </div>
  </div>
  </Affix>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Navigation);
