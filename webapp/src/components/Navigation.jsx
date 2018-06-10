import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter, Link } from 'react-router-dom';
import { Layout, Affix, Menu, Icon } from 'antd';

import * as routes from '../constants/routes';
import { auth } from '../firebase';

import LogoPng from '../assets/logo_raster_300x59.png';
import SmallLogoPng from '../assets/favicon_64x64.png';
import './Navigation.css';

const { Sider } = Layout;

const Navigation = ({ authUser, collapsed, onNavChange, onNavStyleChange, history }) => (
  <div>
    {authUser ? <NavigationAuth 
                  collapsed={collapsed} 
                  onNavChange={onNavChange}
                  onNavStyleChange={onNavStyleChange}
                  history={history}
                  /> 
              : <NavigationNonAuth onNavStyleChange={onNavStyleChange}/>}
  </div>
);

class NavigationAuth extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setStyle(this.props.collapsed);
    this.props.history.push('/home');
  }

  handleChange() {
    this.props.onNavChange();
    this.setStyle(!this.props.collapsed);
  }

  setStyle(state) {
    const marginLeft = state ? '80px' : '200px';
    this.props.onNavStyleChange(marginLeft);
  }

  render() {
    const collapsed = this.props.collapsed;
    return (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.handleChange}
          style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
        >
          <div className="authmenu-logo">
            { collapsed ? <img className="small" src={SmallLogoPng} alt="Logo"/> 
                        : <img className="normal" src={LogoPng} alt="Logo" />}
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="appstore-o" />
              <span className="nav-text">Home</span>
              <Link to={routes.HOME}></Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span className="nav-text">Account</span>
              <Link to={routes.ACCOUNT}></Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="file" />
              <span className="nav-text">Test</span>
              <Link to={routes.TEST}></Link>
            </Menu.Item>
            <Menu.Item key="4" onClick={auth.doSignOut}>
              <Icon type="poweroff" />
              <span className="nav-text">Logout</span>
            </Menu.Item>
          </Menu>
        </Sider>
    );
  }
}

class NavigationNonAuth extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onNavStyleChange('0px');
  }

  render() {
    return (
      <Affix>
        <div className="nonauth-menu">
          <div className="logo">
            <img src={LogoPng} alt="Logo"/>
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
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default compose(withRouter, connect(mapStateToProps))(Navigation);
