var express = require('express');
var router = express.Router();

router.get('/hello', function(req, res) {
  res.send('GET route on things');
});

// router.post('/hello', function(req, res) {
//   res.send('Got a POST request');
// });

module.exports = router;