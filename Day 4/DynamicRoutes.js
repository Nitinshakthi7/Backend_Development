var express = require('express');
var app = express();

app.get('/:id', (req, res) => {
  res.send(`The user id you specified is ${req.params.id}`);
});

app.get('/:name/:id', (req, res) => {
  res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});

app.use((req, res) => {
    res.status(404).send('route not found');
});

app.listen(3000);