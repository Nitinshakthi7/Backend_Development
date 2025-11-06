const http = require('http');
const handleHomeRoute = require('./routes/home');
const { port, appName } = require('./config/serverConfig');

const server = http.createServer((req, res) => {
    handleHomeRoute(req, res);
});

server.listen(port, () => {
    console.log(`${appName} is running on port ${port}`);
});