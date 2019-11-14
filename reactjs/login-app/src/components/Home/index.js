import React from 'react';
import { render } from 'react-dom';

class Home extends React.Component {
  render() {
    return (
      <div> 
        <p> I am home</p>
      </div>
    )
  }
}

// const mapStateToProps = state => ({
//   // noonText: state.toJS().translation.noonText,
// });

export default Home;

// export default connect(mapStateToProps)(Home);