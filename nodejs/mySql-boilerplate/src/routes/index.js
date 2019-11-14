let express = require('express');
var passport = require('passport');

// mysql constollers
let homeController = require('../controllers/index');
let userController = require('../controllers/user');
let contactController = require('../controllers/contact');

let router = express.Router();

// index home page
router.get('/', homeController.index_get);

// user profile page
router.get('/profile', userController.ensureAuthenticated, userController.profileGet);
router.put('/profile', userController.ensureAuthenticated, userController.profilePut);
router.delete('/profile', userController.ensureAuthenticated, userController.profileDelete);

// user accounts login
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);

// user accounts signup
router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);

// user account logout
router.get('/forgot', userController.forgotGet);
router.post('/forgot', userController.forgotPost);
router.get('/reset/:token', userController.resetGet);
router.post('/reset/:token', userController.resetPost);
router.get('/logout', userController.logout);

// social links
router.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email profile repo'] }));
router.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));

// contacts
router.get('/contact', contactController.contactGet);
router.post('/contact', contactController.contactPost);

module.exports = router;