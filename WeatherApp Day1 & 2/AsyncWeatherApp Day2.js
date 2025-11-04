var fs = require('fs').promises;
var events = require('events');
var myEmitter = new events.EventEmitter();
function fetchWeather() {
    console.log('Starting to fetch weather...');
    setTimeout(function() {
        console.log('Finished waiting, now reading file...');
        fs.readFile('weather.json')
            .then(function(fileData) {
                myEmitter.emit('data_is_ready', fileData.toString());
            })
            .catch(function(err) {
                console.log('oops, could not read the file');
            });

    }, 2000);
}
async function main() {
    myEmitter.on('data_is_ready', function(data) {
        var weather = JSON.parse(data);
        console.log('--- Weather Report ---');
        console.log('City: ' + weather.city);
        console.log('Temperature: ' + weather.temperature);
        console.log('Condition: ' + weather.condition);
    });
    fetchWeather();
}
main();