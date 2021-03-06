 import React from 'react';

export default (props) => {
    return (<section className="jumbotron text-center">
      <div className="container">
        <h1 className="jumbotron-heading">Plans tonight?</h1>
        <p className="lead text-muted">See which bars are hoppin' tonight and RSVP ahead of time!</p>
        <p className="lead text-muted">Remember: take a cab and drink responsibly.</p>
        <div className="row justify-content-sm-center">
          <div className="col col-sm-8">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <input 
                type="text" 
                className="form-control" 
                placeholder="WHERE YOU AT" 
                onChange={props.onChangeLocation} 
                onKeyPress={(e) => e.charCode === 13 && props.onSearch(e)}
                value={props.location} />{" "}
              <button type="submit" className="btn btn-primary mb-2 mr-sm-2 mb-sm-0" onClick={props.onSearch}>Go</button>
            </div>
          </div>
        </div>
      </div>
    </section>);
};