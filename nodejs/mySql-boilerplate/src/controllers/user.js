const express = require('express');
var models = require('../models');
var passport = require('passport');
var sequelize = require('sequelize');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

// Login required middleware
exports.ensureAuthenticated = function(req, res, next) {
    console.log("Calling to check authenticated");
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

/* GET Log In page. */
exports.loginGet = function(req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('pages/account/login', {
        'title': 'Log In'
    });
};

/* POST Log In page. */
exports.loginPost = function(req, res, next) {

    // validating login input
    req.assert('email', 'Email field cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be atleast 6 characters long').len(6);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        req.flash('error', { msg: errors });
        return res.redirect('/login');
    }

    // checking user entred sigin values
    console.log("User email data -- > " + req.body.email + " , " + req.body.password);

    passport.authenticate('local', function(err, user, info) {
        console.log("Checking user " + user);
        console.log("Checking info " + info);
        if (!user) {
            console.log("Login user authenticate --> " + info);
            req.flash('error', { msg: info });
            return res.redirect('/login')
        }

        req.logIn(user, function(err) {
            res.redirect('/');
        });
    })(req, res, next);
};

/*  GET logout */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/login');
};

/* POST Sign Up page. */
exports.signupGet = function(req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('pages/account/signup', {
        'title': 'Sign Up'
    });
};

/* POST Sign Up page. */
exports.signupPost = function(req, res, next) {
    // validating userdata
    console.log("validating shignup userdata");

    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('username', 'Username cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be atleast 6 characters long').len(6);
    // req.assert('con-password', 'Passwords are not matching').equals(req.body.password);

    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        console.log("Validating errors" + errors);
        return res.redirect('/signup');
    }

    // finding user email and saving it 
    console.log("finding user email and saving it");

    console.log("Calling model --> " + models['User']);
    console.log("Calling model --> " + models['schema']);
    console.log("Calling model --> " + models.userTables);
    console.log("Calling model --> " + models['userTables']);

    // sequelize.sync({}).then(function() {
    models.userTables.findOne({
            where: {
                'email': req.body.email,
                'username': req.body.username
            }
        })
        .then(function(user) {
            // user data of exists
            console.log("user data -- >" + user);
            if (user == null) {
                models.userTables.create({
                        name: req.body.name,
                        username: req.body.username,
                        email: req.body.email,
                        password: create_hashPassword(req.body.password)
                    })
                    .then(function(user) {
                        console.log("Adding user -- >" + user);
                        // saving user in db
                        req.logIn(user, function(err) {
                            res.redirect('/login');
                        });
                    })
            }
        })
        .catch(function(err) {
            // console.log("user data -- >" + user);
            if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
                req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
                return res.redirect('/signup');
            }
        });

};


//  GET account
exports.profileGet = function(req, res) {
    console.log("Calling Profile Get");
    res.render('pages/account/profile', {
        title: 'My Account'
    });
};

// PUT account
exports.profilePut = function(req, res, next) {
    console.log("Calling Profile Put");
    if ('password' in req.body) {
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.assert('confirm', 'Passwords must match').equals(req.body.password);
    } else {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('email', 'Email cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({ remove_dots: false });
    }

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/profile');
    }

    console.log("Calling SQL Quesry in Profile Update-->");

    models.userTables.updateAttributes({
            where: {
                id: id
            }
        }).then(function(user) {
            console.log("User data from PUT 1-->" + user)
            if ('password' in req.body) {
                user.password = req.body.password;
            } else {
                user.email = req.body.email;
                user.name = req.body.name;
                user.gender = req.body.gender;
                user.location = req.body.location;
                user.website = req.body.website;
                console.log("User data from PUT 2 -->" + user);
            }
            console.log("User data from PUT 3-->" + user);
            user.save().
            then(function(err) {
                if ('password' in req.body) {
                    req.flash('success', { msg: 'Your password has been changed.' });
                } else if (err && err.code === 11000) {
                    req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
                } else {
                    req.flash('success', { msg: 'Your profile information has been updated.' });
                }
                res.redirect('/profile');
            })
        })
        .catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
                message: 'Something went wrong with your Profile Update'
            });
        });
};

// delete account
exports.accountDelete = function(req, res, next) {
    User.remove({ _id: req.user.id }, function(err) {
        req.logout();
        req.flash('info', { msg: 'Your account has been permanently deleted.' });
        res.redirect('/');
    });
};

/* GET forgot */
exports.forgotGet = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('pages/account/forgot', {
        title: 'Forgot Password'
    });
};

// POST forgot
exports.forgotPost = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/forgot');
    }

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            })
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', { msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
                    return res.redirect('/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000;
                user.save(function(err) {
                    done(err, token, user);
                })
            })
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'support@yourdomain.com',
                subject: '✔ Reset your password on Title',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('info', { msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
                res.redirect('/forgot');
            });
        }
    ])
};

// GET RESET
exports.resetGet = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
                return res.redirect('/forgot');
            }
            res.render('pages/account/reset', {
                title: 'Password Reset'
            });
        })
};

// Get POST
exports.resetPost = function(req, res) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('back');
    };

    async.waterfall([
        function(done) {
            User.findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec(function(err, user) {
                    if (!user) {
                        req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
                        return res.redirect('back');
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                })
        },
        function(user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD
                }
            });
            var mailOptions = {
                from: 'support@yourdomain.com',
                to: user.email,
                subject: 'Your Mega Boilerplate password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('success', { msg: 'Your password has been changed successfully.' });
                res.redirect('/account');
            });
        }
    ])
};

// Profile Get
exports.profileGet = function(req, res) {
    res.render('pages/account/profile', {
        title: 'My Account'
    });
};

// Profile Put
exports.profilePut = function(req, res) {
    if ('password' in req.body) {
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.assert('confirm', 'Passwords must match').equals(req.body.password);
    } else {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('email', 'Email cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({ remove_dots: false });
    }
    var errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/profile');
    }
    User.findById(req.user.id, function(err, user) {
        if ('password' in req.body) {
            user.password = req.body.password;
        } else {
            user.email = req.body.email;
            user.name = req.body.name;
            user.gender = req.body.gender;
            user.location = req.body.location;
            user.website = req.body.website;
        }
        user.save(function(err) {
            if ('password' in req.body) {
                req.flash('success', { msg: 'Your password has been changed.' });
            } else if (err && err.code === 11000) {
                req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
            } else {
                req.flash('success', { msg: 'Your profile information has been updated.' });
            }
            res.redirect('/profile');
        });
    });
};

/**
 * DELETE /account
 */
exports.profileDelete = function(req, res, next) {
    User.remove({ _id: req.user.id }, function(err) {
        req.logout();
        req.flash('info', { msg: 'Your account has been permanently deleted.' });
        res.redirect('/');
    });
};

/**
*
GET / unlink /: provider 
*/
exports.unlink = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        switch (req.params.provider) {
            case 'facebook':
                user.facebook = undefined;
                break;
            case 'google':
                user.google = undefined;
                break;
            case 'twitter':
                user.twitter = undefined;
                break;
            case 'vk':
                user.vk = undefined;
                break;
            case 'github':
                user.github = undefined;
                break;
            default:
                req.flash('error', { msg: 'Invalid OAuth Provider' });
                return res.redirect('/account');
        }
        user.save(function(err) {
            req.flash('success', { msg: 'Your account has been unlinked.' });
            res.redirect('/account');
        });
    });
};

// get hash of password
function create_hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};