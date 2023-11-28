const mongoose = require('mongoose');
// Event handlers for successful and error database connection
async function connectToDatabase() {
try {
// Connect to the MongoDB database using async/await
      await mongoose.connect('mongodb://127.0.0.1:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(`Error connecting to MongoDB: ${err}`);
    }
  }
  
  // Call the async function to establish the connection
connectToDatabase();

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Connected to MongoDB database`);
});

db.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});
