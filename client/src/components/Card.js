import React from 'react';

export default (props) => {
    let btnClass = props.going ? "btn btn-primary" : "btn btn-outline-primary";
    let titleGoing = props.going ? "You are going" : "You are not going";
    let totalGoing = props.total_going ? window.parseInt(props.total_going) : 0;
    let addresInfo = '';
    if (props.location && props.location.display_address) {
        addresInfo = props.location.display_address.map((l, key) => <p key={props.id + key} className='card-text'>{l}</p>);
    } 
    return (
    <div className="card">
        <img className="card-img-top img-fluid" src={props.image_url} alt={props.name} />
        <div className="card-block">
          <h4 className="card-title">{props.name}</h4>
          {addresInfo}
          {props.saving_going ?
            <button href="#" title="Saving" className={btnClass}>saving ...</button>
            :
            <button href="#" title={titleGoing} className={btnClass} onClick={props.onToggleGoing}>{totalGoing} going</button>
          }
          {" "}
          <a target="blank" href={props.url} className="btn btn-outline-primary"><i className="fa fa-map-marker" aria-hidden="true"> details</i></a>
        </div>
    </div>);
}