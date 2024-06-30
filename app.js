const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// MongoDB Atlas connection string
const uri = 'mongodb+srv://mersal:Kishorekumar@cluster0.ogdni4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let db;

// Connect to the MongoDB database
async function connectToDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    db = client.db('mersal'); // Specify the database name here
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit the application if connection fails
  }
}

// Call the function to connect to the database
connectToDatabase();

// Endpoint to handle contact form submission (POST method)
app.post('/contact', async (req, res) => {
  // Log the incoming request body
  console.log('Incoming request body:', req.body);

  const { fullName, email, phoneNumber, emailSubject, message } = req.body;

  
  try {
    // Insert contact form data into 'posts' collection
    const result = await db.collection('posts1').insertOne({
      fullName,
      email,
      phoneNumber,
      emailSubject,
      message,
      timestamp: new Date() // Add a timestamp for when the message was sent
    });

  
    // Check if the insert was successful
    if (result.acknowledged) {
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
    let viewDoc = await db.collection('views').findOne();
    if (!viewDoc) {
      viewDoc = { viewCount: 0 };
    }
    viewDoc.viewCount += 1;
    await db.collection('views').updateOne({}, { $set: { viewCount: viewDoc.viewCount } }, { upsert: true });

    // Return current view count
    viewDoc = await db.collection('views').findOne();
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
