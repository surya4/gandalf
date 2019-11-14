const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
var methodOverride = require('method-override');
// var session = require('express-session');
// var flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();

const app = express();

// process the images
let homeController = require('./controllers/index');
homeController.kaboom();

// view engine setup

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(methodOverride('_method'));

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

module.exports = app;