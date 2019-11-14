import React from 'react';
import { render } from 'react-dom';

class Login extends React.Component {
  render() {
    return (
      <div> 
        <p> I am login</p>
      </div>
    )
  }
}

export default Login;

// const mapStateToProps = state => ({
//   // noonText: state.toJS().translation.noonText,
// });

// export default connect(mapStateToProps)(Login);