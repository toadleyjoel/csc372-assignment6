const pool = require('../db');

async function getCategories() {
    const result = await pool.query('SELECT name FROM categories');
    return result.rows.map(row => row.name);
}

async function getJokesByCategory(category, limit) {
    let query = `
        SELECT j.setup, j.delivery
        FROM jokes j
        JOIN categories c ON j.category_id = c.id
        WHERE c.name = $1
    `;
    const params = [category];
    
    if (limit) {
        query += ` LIMIT $2`;
        params.push(limit);
    }
    
    const result = await pool.query(query, params);
    return result.rows;
}

async function getRandomJoke() {
    const result = await pool.query('SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1');
    return result.rows[0];
}

async function addJoke(categoryName, setup, delivery) {
    // Extra credit section.
    let catRes = await pool.query('SELECT id FROM categories WHERE name = $1', [categoryName]);
    let categoryId;
    
    if (catRes.rows.length === 0) {
        const insertCat = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [categoryName]);
        categoryId = insertCat.rows[0].id;
    } else {
        categoryId = catRes.rows[0].id;
    }
    
    await pool.query('INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3)', [categoryId, setup, delivery]);
}

module.exports = { getCategories, getJokesByCategory, getRandomJoke, addJoke };