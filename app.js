const express = require('express');

const app = express();

// Define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server on port 3000
const PORT = 3000;
app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)

);