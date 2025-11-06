var express = require('express');
var app = express();

var things = require('./routers');


app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

// app.post('/hello', function (req, res) {
//   res.send('Got a POST request');
// });

app.use('./routers.js', things);


app.listen(3000);

// app.put('/', function (req, res) {
//   res.send('Got a PUT request');
// });

// app.delete('/', function (req, res) {
//   res.send('Got a DELETE request');
// });

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });