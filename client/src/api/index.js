import 'whatwg-fetch';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    console.log(response);
    return response;
  } 

  var error = new Error(response.statusText)
  error.response = response
  throw error;
}
const jsonHdlr = response => response.json();

export const going = (id, go) => {
    return fetch('/api/going.json', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, go})
    }).then(checkStatus).then(jsonHdlr);
}

export const search = (location) => {
    console.log('searching in location: ' + location);

    return fetch('/api/search.json?location=' + location, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(checkStatus).then(jsonHdlr);
}