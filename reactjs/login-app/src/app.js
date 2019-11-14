import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Redirect, Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
// import createHistory from 'history/createBrowserHistory';
// import { fromJS } from 'immutable';
// import configureStore from './redux/store';
import Home from './components/Home';
import Login from './components/Login';
import Main from './components/Main';


cacheInvalidator();
// const history = createHistory();
// const initialState = fromJS({});
// const store = configureStore(initialState);
// history.listen(historyListener);

const App = () => (
  <Provider store={store}>
    <Router>
      <Main>
    {/* <Router history={history}>
      <Main history={history}> */}
        {/* <Toast top /> */}
        <Switch>
          <Route exact path="/index.html" render={() => <Redirect to="/" />} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
          {/* <GuestRoute exact path="/:locale/login" component={Login} /> */}
          {/* <GuestRoute exact path="/:locale/signup" component={Signup} /> */}
          {/* <ProtectedRoute exact path="/:locale/profile" component={CompleteProfile} /> */}
          {/* <NoonRoute exact path="/:locale/password-reset" component={PasswordReset} noFooter /> */}
          {/* <NoonRoute path="/notFound" noHeader noFooter component={NotFound} /> */}
          {/* <NoonRoute path="*" noHeader noFooter component={NotFound} /> */}
        </Switch>
      </Main>
    </Router>
  </Provider>
);

const AppModule = hot(module)(App);
export { AppModule };
// export { store, AppModule };
