const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Public routes
router.get('/', movieController.getAllMovies);
router.get('/:movieId', movieController.getMovieById);
router.get('/:movieId/seats', movieController.getMovieSeats);
router.get('/:movieId/seats/available', movieController.getAvailableSeats);

module.exports = router;
