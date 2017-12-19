import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Demo from './Demo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"><code>theCryptoConnect</code></h1>
        </header>
        <Demo />
      </div>
    );
  }
}

export default App;
