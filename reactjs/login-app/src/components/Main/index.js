import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { setAuthorizationHeader, getQueryItem } from '../../helpers';
// import {
//   LIST_PRODUCTS,
//   GET_PAYMENT_HISTORY,
// } from '../../redux/constants';
// import {
//   COUNTRY_LOCALE_PATTERN,
//   LOCALES,
// } from '../../constants';
// import { PaidContentModal } from '../Modals';
// import { userType } from '../../types';
// import Meta from '../../Meta';

class Main extends Component {
  // static propTypes = {
  //   user: userType.isRequired,
  // };

  constructor(props) {
    super(props);

    /* eslint-disable react/prop-types */
    // const { pathname, search } = this.props.history.location;

    // this.updateStoreFromLocalStorage();
    // this.getUser();
    // this.processQueryToken(pathname, search);

    this.state = {
      // isLoading: !localStorage.country,
      // dynamicContentLoaded: {
      //   teachers: null,
      // },
    };
  }

  // componentWillMount() {
  //   // delete localStorage.lastUrl;
  // }

  // componentDidMount() {
  //   // if (localStorage.translation) {
  //   //   const json = JSON.parse(localStorage.translation);
  //   //   this.props.getTranslation(json);
  //   // }
  // }

  // componentWillReceiveProps({ countries, history, location, user, noCreditModal, teacher, token, paymentHistory }) {
//     componentWillReceiveProps({}) {
// }

//   componentDidUpdate(prevProps) {
//     // if (prevProps.location !== this.props.location) {
//     //   this.zohoIntegration();
//     // }
//   }

//   componentWillUnmount() {
//     // delete localStorage.lastUrl;
//   }

  // dynamicRoute(pathName) {
  //   return PATH_NAMES.includes(pathName) && this.dynamicContentLoaded(pathName);
  // }

  // getDynamicPath(path) {
  //   return path.split('/')[2];
  // }

  // updateStoreFromLocalStorage = () => {
  //   if (localStorage.selectedProduct) {
  //     this.props.selectProduct(JSON.parse(localStorage.selectedProduct));
  //   }
  //   if (localStorage.curriculum) {
  //     this.props.selectCurriculum(JSON.parse(localStorage.curriculum));
  //   }
  // };

  render() {
    // const { pathname } = this.props.location;
    // const { dynamicContentLoaded } = this.state;
    // const { noCreditModal, user, location } = this.props;
    // const dynamicPath = this.getDynamicPath(pathname);
    return (
      <React.Fragment>
        <p>I am main index</p>
      </React.Fragment>
    );
  }
}

// const mapStateToProps = state => ({
//   // user: state.toJS().user.loggedUser,
// });

// const mapDispatchToProps = dispatch => ({
//   // updateUser: user => dispatch({ type: LOGIN_USER.SUCCESS, payload: user }),
//   // getProfile: () => dispatch({ type: GET_PROFILE.REQUEST }),
// });

export default Main;

// export default withRouter(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//   )(Main),
// );
