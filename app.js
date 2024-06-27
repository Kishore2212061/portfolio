const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const Post = require('./models/Post'); // Import Post model
const View = require('./models/VIew'); // Import View model

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://mersal:Kishorekumar@cluster0.ogdni4m.mongodb.net/mersal?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Endpoint to handle contact form submission (POST method)
app.post('/contact', async (req, res) => {
  const { fullName, email, phoneNumber, emailSubject, message } = req.body;

  try {
    // Create a new post instance
    const newPost = new Post({
      fullName,
      email,
      phoneNumber,
      emailSubject,
      message
    });

    // Save the new post instance to MongoDB
    await newPost.save();

    
    // Send a success response
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error handling contact form submission:', error);

    // Send an error response
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Endpoint to handle view count increment
app.get('/view-count', async (req, res) => {
  try {
    // Check if session has already marked this visit
    if (!req.session.visited) {
      req.session.visited = true;

      // Increment view count in the database
      let viewDoc = await View.findOne();
      if (!viewDoc) {
        viewDoc = new View();
      }
      viewDoc.viewCount += 1;
      await viewDoc.save();
    }

    // Return current view count
    let viewDoc = await View.findOne();
    res.status(200).json({ viewCount: viewDoc.viewCount });
  } catch (error) {
    console.error('Error updating/viewing view count:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
