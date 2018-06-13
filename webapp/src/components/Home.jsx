import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Layout, Card, Row, Col, Icon} from 'antd';

import withAuthorization from './withAuthorization';
import { database } from '../firebase';
import './Home.css';

const { Header, Content } = Layout;

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null
    };
  }

  componentDidMount() {
    // const { onSetUsers } = this.props;
    // database.onceGetUsers().then(snapshot =>
    //   onSetUsers(snapshot.val())
    // );
  }

  render() {
    return (
      <div className="home">
        <Layout>
          <Header>
            <p>Welcome { this.props.authUser.email }</p>
          </Header>
          <Content>
          <Row gutter={16}>
            <Col span={8}>
              <Card bordered={false}>
                <Icon type="smile-o" />
                <p className="big-number">40</p>
                <p>patients in queue</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Icon type="smile-o" />
                <p className="big-number">100</p>
                <p>patients served today</p>
              </Card>
            </Col>
          </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users })
});

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomePage);
