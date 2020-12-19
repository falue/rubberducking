// Get name of project folder for deploay to subfolder on FTP server
const path = require("path");
console.log('!!! Name which the subfolder on the server should have: "', path.basename(path.resolve()), '" !!! Change this in vue.config.js');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  // Remove this option if deployed & served directly on the root folder on my server:
  publicPath: process.env.NODE_ENV === 'production'
    ? "/" + path.basename(path.resolve())
    : ''
}