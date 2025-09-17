const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();
const ordersRouter = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');
const seedRouter = require('./routes/seed');

const app = express(); // <-- moved above all app.use calls
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/seed', seedRouter); // <-- moved after app is defined

// routes
app.use('/api/orders', ordersRouter);

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});