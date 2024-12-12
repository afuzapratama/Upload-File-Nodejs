const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const uploadRoute = require('./routes/upload');
const downloadRoute = require('./routes/download');
const homeController = require('./controllers/homeController');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS & Layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Routes
app.use('/upload', uploadRoute);
app.use('/download', downloadRoute);

app.get('/', homeController.renderHome);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
