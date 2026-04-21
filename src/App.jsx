import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <div className="container" id={this.props.id}>
        <div className="one">
          <div className="two">
            <p>1</p>
            <p>2</p>
          </div>
          <div className="three">
            <p>3</p>
            <p>4</p>
          </div>
        </div>
        <p>this is a tes1</p>
      </div>
    );
  }
}

export default App;