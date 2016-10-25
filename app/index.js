var $ = require('jquery');
var moment = require('moment');

var sub = require('./sub');
require('./main.css');

var app  = document.createElement('div');
app.innerHTML = '<h1>Hello World111</h1>';
app.appendChild(sub());
document.body.appendChild(app);

$('body').append('<p>look at me! now is ' + moment().format() + '</p>');
