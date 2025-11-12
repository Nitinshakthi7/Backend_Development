const express = require('express');
const router = express.Router();
const {
  addMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getTopRated,
  getByCategory
} = require('../controllers/movieController');
const { validateMovieMiddleware } = require('../middleware/validateMovieMiddleware');

router.post('/', validateMovieMiddleware, addMovie);
router.get('/', getMovies);
router.get('/top-rated/movies', getTopRated);
router.get('/category/:category', getByCategory);
router.get('/:id', getMovieById);
router.put('/:id', validateMovieMiddleware, updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
