const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Set view engine
app.set('view engine', 'ejs');

// Static folder for CSS
app.use(express.static(path.join(__dirname, 'public')));

// Body parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Home Route
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
        const apodData = response.data;
        res.render('index', { apod: apodData });
    } catch (error) {
        console.error("Error fetching data from NASA API:", error.message);
        res.render('error', { errorMsg: "Unable to load data from NASA at the moment. Please try again later!" });
    }
});

// Form Submission Route (POST)
app.post('/search', async (req, res) => {
    const selectedDate = req.body.date; // get the date input
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${selectedDate}`);
        const apodData = response.data;
        res.render('index', { apod: apodData });
    } catch (error) {
        console.error("Error fetching data from NASA API:", error.message);
        res.render('error', { errorMsg: "Could not find a picture for the selected date. Try another one!" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
