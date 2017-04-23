
const fixKey = (key) => '_rochamar_nightlife_' + key;
export default {  
  set: function(key, value) {
    window.localStorage.setItem(fixKey(key), value);
  },
  get: function(key) {
    return window.localStorage[fixKey(key)];
  }
};