const JokeModel = require('../models/jokeModel');

async function getCategories(req, res) {
    try {
        const categories = await JokeModel.getCategories();
        res.json(categories); 
    } catch (err) {
        res.status(500).json({ error: "Server error retrieving categories." });
    }
}

async function getJokesByCategory(req, res) {
    const category = req.params.category;
    const limit = req.query.limit; 
    
    try {
        const categories = await JokeModel.getCategories();
        if (!categories.includes(category)) {
            return res.status(400).json({ error: `Category '${category}' is not valid.` }); 
        }
        
        const jokes = await JokeModel.getJokesByCategory(category, limit);
        res.json(jokes); 
    } catch (err) {
        res.status(500).json({ error: "Server error retrieving jokes." });
    }
}

async function getRandomJoke(req, res) {
     try {
        const joke = await JokeModel.getRandomJoke();
        res.json(joke); 
    } catch (err) {
        res.status(500).json({ error: "Server error retrieving random joke." });
    }
}

async function addJoke(req, res) {
    const { category, setup, delivery } = req.body;
    
    if (!category || !setup || !delivery) {
        return res.status(400).json({ error: "Missing required parameters. Need category, setup, and delivery." }); 
    }
    
    try {
        await JokeModel.addJoke(category, setup, delivery); 
        const updatedJokes = await JokeModel.getJokesByCategory(category);
        res.json(updatedJokes); 
    } catch (err) {
        res.status(500).json({ error: "Server error adding joke." });
    }
}

module.exports = { getCategories, getJokesByCategory, getRandomJoke, addJoke };