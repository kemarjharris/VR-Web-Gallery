import React from 'react';

class Reload extends React.Component {
    componentDidMount() {
      window.location.reload();
    }
  
    render() {
      return null;
    }
  }

export default Reload;