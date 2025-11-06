const http = require('http');

const users =[ 
    {
        "course": "Backend Development",
        "module": "Day3 - Structure & Config",
        "status": "Active"
    }
];

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/Info') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Endpoint Not Found');
        }
    }
});

const PORT = process.env.PORT || 3100;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
