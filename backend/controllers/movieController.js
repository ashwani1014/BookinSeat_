const movieService = require('../services/movieService');

class MovieController {
  async getAllMovies(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await movieService.getAllMovies(page, limit);

      res.status(200).json({
        success: true,
        data: result.movies,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMovieById(req, res, next) {
    try {
      const { movieId } = req.params;

      const movie = await movieService.getMovieById(movieId);

      res.status(200).json({
        success: true,
        data: movie,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMovieSeats(req, res, next) {
    try {
      const { movieId } = req.params;

      const result = await movieService.getMovieSeats(movieId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableSeats(req, res, next) {
    try {
      const { movieId } = req.params;

      const seats = await movieService.getAvailableSeats(movieId);

      res.status(200).json({
        success: true,
        data: seats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MovieController();
