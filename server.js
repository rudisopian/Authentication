const express = require('express');
const authRoutes = require('./server/routes/authRoutes');
const cookieParser = require('cookie-parser');
const bodyparser = require("body-parser");
const { checkUser } = require('./server/middleware/authMiddleware');
const dotenv = require('dotenv')
const connectDB = require('./server/database/connection');
const path = require('path');
const morgan = require('morgan');
const { requireAuth } = require('./server/middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// log request
app.use(morgan('tiny'));

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// declare dotenv
dotenv.config( { path : 'config.env'} )

// database connection
connectDB();

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use(express.static(path.join(__dirname, "assets")))

app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard'));
app.use(authRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});