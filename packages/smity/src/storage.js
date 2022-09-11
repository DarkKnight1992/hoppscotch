const settings = require('electron-settings');

const localStorage = {
  getItem: function (key) {
    return settings.getSync(key);
  },
  setItem: function (key, value) {
    settings.setSync(key, value);
  },
  removeItem: function (key) {
    settings.unsetSync(key);
  },
  settings
};

//Then redefine the local storage
module.exports = localStorage;