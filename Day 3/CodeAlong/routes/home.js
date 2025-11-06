const homeController = require('../controllers/homeController');

function handleHomeRoute(req, res) {
    if (req.url === '/' && req.method === 'GET') {
        homeController.getHome(req, res);
    } else if (req.url === '/about' && req.method === 'GET') {
        homeController.getAbout(req, res);
    } else {
        homeController.getNotFound(req, res);
    }
}

module.exports = handleHomeRoute;