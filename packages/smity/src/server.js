const express = require('express');
const path = require('path');

const exApp = express();
exApp.use(express.static(path.resolve(__dirname, '..', 'public')));

module.exports = exApp;