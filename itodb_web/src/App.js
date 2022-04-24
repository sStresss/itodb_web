import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import Main from "./components/Main";

class App extends Component {
  render() {
    return (
      <Fragment >
        <Main />
      </Fragment>
    );
  }
}

export default App;