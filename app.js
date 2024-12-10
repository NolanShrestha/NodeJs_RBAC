const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const routes = require('./routes/auth'); 

const app = express();
app.use(bodyParser.json());

(async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
})();

app.use('/auth', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
