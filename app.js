const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mapremierebdd.gvkgw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

app.use("/api/", apiLimiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/img', express.static(path.join(__dirname, 'img')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;