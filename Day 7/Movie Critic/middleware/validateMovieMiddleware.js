function validateMovieMiddleware(req, res, next) {
  const { title, category, releaseYear, rating } = req.body;
  if (!title || !category || !releaseYear || rating === undefined) {
    return res.status(400).json({ message: "Validation failed: Missing fields." });
  }
  if (rating < 0 || rating > 10 || releaseYear < 1900) {
    return res.status(400).json({ message: "Validation failed: Invalid rating or year." });
  }
  next();
}
module.exports = { validateMovieMiddleware };
