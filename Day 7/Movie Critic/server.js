const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const { loggerMiddleware } = require('./middleware/loggerMiddleware');
const { errorHandlerMiddleware } = require('./middleware/errorHandlerMiddleware');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

mongoose.connect('mongodb://localhost:27017/cinecritic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use('/api/movies', movieRoutes);
app.use(errorHandlerMiddleware);

app.listen(5000, () => console.log('Server running on port 5000'));
