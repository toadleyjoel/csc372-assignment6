const express = require('express');
const app = express();
const jokebookRoutes = require('./routes/jokebook');

// Middleware
app.use(express.static('public')); // Static files from public folder.
app.use(express.json()); 

// Routes
app.use('/jokebook', jokebookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});