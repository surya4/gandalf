const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const dotenv = require('dotenv');
var passport = require('passport');

// Load environment variables from .env file
dotenv.load();

// Routers
const index = require('./src/routes/index');

require('./src/controllers/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, './src/public', '/images/favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(express.static(path.join(__dirname, './src/public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    // res.render('pages/404', {
    //     'message': 'Page not found'
    // });
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