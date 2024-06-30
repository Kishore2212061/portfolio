const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const View = require('./models/VIew');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// MongoDB Atlas connection string
const uri = 'mongodb+srv://mersal:Kishorekumar@cluster0.ogdni4m.mongodb.net/mersal?retryWrites=true&w=majority&appName=Cluster0';

// Connect to the MongoDB database using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(error => {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1); // Exit the application if connection fails
    });

// Endpoint to handle contact form submission (POST method)
app.post('/contact', async (req, res) => {
 

    const { fullName, email, phoneNumber, emailSubject, message } = req.body;

    
    try {
        // Insert contact form data into 'posts1' collection
        const newPost = new Post({ fullName, email, phoneNumber, emailSubject, message });
        const result = await newPost.save();

 

        // Check if the insert was successful
        if (result) {
            // Send a success response
            res.status(201).send('Message sent successfully');
        } else {
            // Log and send an error response if the insert was not successful
            console.error('Error: Insert not acknowledged:', result);
            res.status(500).send('Failed to send message');
        }
    } catch (error) {
        console.error('Error handling contact form submission:', error);
        res.status(500).send('Failed to send message');
    }
});

// Endpoint to handle view count increment
app.get('/view-count', async (req, res) => {
    try {
        // Increment view count in the database
        let viewDoc = await View.findOne();
        if (!viewDoc) {
            viewDoc = new View({ viewCount: 0 });
        }
        viewDoc.viewCount += 1;
        await viewDoc.save();

        // Return current view count
        res.status(200).json({ viewCount: viewDoc.viewCount });
    } catch (error) {
        console.error('Error updating/viewing view count:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware for handling 404 errors
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
