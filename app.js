
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
    res.render('index', { searchResults: null });
});



// Handle Form Submission
app.post('/price', async (req, res) => {
    const { crypto, currency } = req.body;
    

    // Validate inputs
    if (!crypto || !currency) {
        return res.render('error', {
            message: 'Please select both a cryptocurrency and a currency. OR use drop down option.',
        });
    }

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`
        );

        // Check if the response contains valid data
        if (!response.data[crypto] || !response.data[crypto][currency]) {
            throw new Error('Invalid crypto or currency');
        }

        const price = response.data[crypto][currency];
        res.render('result', { crypto, currency, price });
    } catch (error) {
        res.render('error', {
            message: 'Invalid cryptocurrency or currency. Please try again.',
        });
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
