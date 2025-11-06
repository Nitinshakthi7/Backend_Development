exports.getHome = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the Place where you get punished for your sins. The Hell!!!</h1>');
};

exports.getAbout = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>This is a place created so people can get punished for their sins after their death.</h1>');
};

exports.getNotFound = (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
};
