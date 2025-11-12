// Get all movies (with advanced filtering)
exports.getMovies = async (req, res) => {
  try {
    // Destructure query parameters
    let { name, year, limit, sort } = req.query;
    let query = {};

    // 🔍 1. Search by name (case-insensitive)
    if (name) {
      query.title = { $regex: name, $options: 'i' }; // 'i' = ignore case
    }

    // 📅 2. Filter by release year
    if (year) {
      query.releaseYear = Number(year);
    }

    // Build the base query
    let moviesQuery = Movie.find(query);

    // 🔤 3. Sort alphabetically
    if (sort === 'asc') {
      moviesQuery = moviesQuery.sort({ title: 1 }); // A → Z
    } else if (sort === 'desc') {
      moviesQuery = moviesQuery.sort({ title: -1 }); // Z → A
    }

    // 🔢 4. Limit the number of results (e.g., top 3)
    if (limit) {
      moviesQuery = moviesQuery.limit(Number(limit));
    }

    // Execute query
    const movies = await moviesQuery;

    // ✅ Return results
    res.status(200).json(movies);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
