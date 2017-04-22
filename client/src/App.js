import React, { Component } from 'react';
import Card from './components/Card.js';
import Jumbotron from './components/Jumbotron.js';
import * as api from './api/index.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      businesses: [],
      inputLocation: "",
    }
  }
  componentDidMount() {
    this.setState(window.__NIGHTLIFE_STATE__);
  }
  onSearch() {
    if (this.state.inputLocation && this.state.inputLocation.length >= 3) {
      api.search(this.state.inputLocation).then(data => {
        this.setState(data);
      });
    }
  }
  onChangeLocation(e) {
    this.setState({inputLocation: e.target.value});
  }
  onSavedGoing(id, going, total) {
    let businesses = this.state.businesses.map(item => {
      if (item.id !== id) {
        return item;
      }
      return {
        ...item,
        going: going,
        total_going: total,
        saving_going: false
      };
    });
    this.setState({businesses: businesses});
  }
  onToggleGoing(id) {
    let businesses = this.state.businesses.map(item => {
      if (item.id !== id) {
        return item;
      }
      let going = !item.going;
      api.going(id, going).then(response => {
        this.onSavedGoing(id, going, response.total_going);
      });
      
      return {
        ...item,
        saving_going: true
      };
    });
    this.setState({businesses: businesses});
    
  }
  render() {
    let cards = this.state.businesses.map((item, key) => {
      return <Card onToggleGoing={() => this.onToggleGoing(item.id)} key={key} {...item} />;
    });
    return (
      <div className="container">
        <Jumbotron 
          location={this.state.inputLocation} 
          onSearch={this.onSearch.bind(this)}
          onChangeLocation={this.onChangeLocation.bind(this)} />
        <div className="card-columns">
          {cards}
        </div>
      </div>
    );
  }
}

export default App;
