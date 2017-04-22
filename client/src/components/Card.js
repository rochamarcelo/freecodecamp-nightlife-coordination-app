import React from 'react';

export default (props) => {
    let dimensions = ['356/356/', '356/420/', '356/264/'];
    let position = Math.floor(Math.random() * dimensions.length);
    let src = "http://lorempixel.com/" + dimensions[position] + '?h=' + props.id;
    let btnClass = position > 1 ? "btn btn-primary" : "btn btn-outline-primary";
    return (
    <div className="card">
        <img className="card-img-top img-fluid" src={src} alt="A good sample" />
        <div className="card-block">
          <h4 className="card-title">Card title</h4>
          <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
          <button href="#" className={btnClass}>{position} going</button>
          <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
        </div>
    </div>);
}