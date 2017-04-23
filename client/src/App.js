import React, { Component } from 'react';
import Card from './components/Card.js';
import Jumbotron from './components/Jumbotron.js';
import * as api from './api/index.js';
import storage from './utility/storage.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      businesses: [],
      inputLocation: "",
    }
  }
  componentDidMount() {
    let location = storage.get("lastLocation");
    this.setState({inputLocation: location});
    this.search(location);
  }
  search(location) {
    if (location && location.length >= 2) {
      storage.set("lastLocation", location);
      api.search(location).then(data => {
        this.setState(data);
      });
    }
  }
  onSearch() {
    this.search(this.state.inputLocation);
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
      let totalGoing = item.total_going;
      api.going(id, going).then(response => {
        this.onSavedGoing(id, going, response.total_going);
      }).catch(err => {
        if (err && err.response && err.response.status === 401) {
          window.location.href = "/auth/twitter";
        } else {
          this.onSavedGoing(id, !going, totalGoing);
          window.alert("Error saving, please try again");
        }
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
