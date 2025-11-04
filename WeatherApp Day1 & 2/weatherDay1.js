var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.on('fetch', function() {
    console.log('getting the weather');
    fs.readFile('weather.json', function (err, data) {
        if (err) {
            console.log('oops something went wrong');
            return;
        }
        var weather = JSON.parse(data);
        console.log("The temp is: " + weather.temperature);
    });
});
console.log('program started');
eventEmitter.emit('fetch');
console.log('program ended');
