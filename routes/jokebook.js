const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');

router.get('/categories', jokeController.getCategories); // GET
router.get('/category/:category', jokeController.getJokesByCategory); // GET 
router.get('/random', jokeController.getRandomJoke); // GET 
router.post('/joke/add', jokeController.addJoke); // POST 

module.exports = router;