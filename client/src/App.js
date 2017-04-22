import React, { Component } from 'react';
import Card from './components/Card.js';
import Jumbotron from './components/Jumbotron.js';

class App extends Component {
  render() {
    let cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(key => <Card key={key} id={key} />);
    return (
      <div className="container">
        <Jumbotron />
        <div className="card-columns">
          {cards}
        </div>
      </div>
    );
  }
}

export default App;
