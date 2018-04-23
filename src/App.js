import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import { authCheckState } from './store/actions';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncCheckout = asyncComponent(() => import('./containers/Checkout/Checkout'));
const asyncOrders = asyncComponent(() => import('./containers/Orders/Orders'));
const asyncAuth = asyncComponent(() => import('./containers/Auth/Auth'));
const asyncLogout = asyncComponent(() => import('./containers/Auth/Logout/Logout'));


class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSigup();
  }
  

  render() {

    let routes = [
      <Route key="auth" path="/auth" component={asyncAuth}/>,
      <Route key="index" path="/" exact component={BurgerBuilder}/>,
      <Redirect key="notFound" to="/" />
    ];

    if (this.props.isAuthenticated) {
      routes.splice(0, 0, [
        <Route key="checkout" path="/checkout" component={asyncCheckout}/>,
        <Route key="orders" path="/orders" component={asyncOrders} />,
        <Route key="logout" path="/logout" component={asyncLogout}/>
      ]);
    }

    return (
      <div >
        <Layout>
          <Switch>
            {routes}
          </Switch>
        </Layout>  
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null
});

const mapDispatchToProps = dispatch => ({
  onTryAutoSigup: () => dispatch(authCheckState())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));