var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var bcrypt = require('bcrypt-nodejs');

var models = require('../models');

// Serialize sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function(id, done) {
    models.userTables.find({
            where: {
                id: id
            }
        })
        .then(function(user) {
            done(null, user);
        });
});


// Sign in with Email and Password
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    models.userTables.findOne({
            where: {
                email: email
            }
        })
        .then(function(user) {
            if (!user) {
                return done(null, false, {
                    msg: 'The email address ' + email + ' is not associated with any account. ' +
                        'Double-check your email address and try again.'
                });
            }

            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err)
                    console.log('Error while checking password');
                else if (isMatch) {
                    console.log('The password matches!');
                    return done(null, user);
                } else {
                    console.log('The username and password does NOT match!');
                    return done(null, false, { msg: 'Invalid email or password' });
                }

            });

        });
}));


// Sign in with Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'gender', 'location'],
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    console.log("Facebook 1");
    if (req.user) {
        console.log("Facebook 2");
        models.userTables.findOne({
                where: {
                    facebook: profile.id
                }
            })
            .then(function(user) {
                console.log("Facebook 3");
                if (user) {
                    req.flash('error', { msg: 'There is already an existing account linked with Facebook that belongs to you.' });
                    return done(null);
                }
                models.userTables.findOne({
                        where: {
                            id: req.user.id
                        }
                    })
                    .then(function(user) {
console.log("Facebook 4");
                        var new_User = {
                            name: req.user.name || profile.name.givenName + ' ' + profile.name.familyName,
                            gender: req.user.gender || profile._json.gender,
                            picture: req.user.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
                            facebook: profile.id
                        }
                        models.userTables.create(
                                new_User
                            )
                            .then(function() {
                                console.log("Facebook 5");
                                req.flash('success', { msg: 'Your Facebook account has been linked.' });
                                done(null, user);
                            });
                    });
            });
    } else {
        models.userTables.findOne({
                where: {
                    facebook: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    return done(null, user);
                }
                models.userTables.findOne({
                        where: {
                            email: profile._json.email
                        }
                    })
                    .then(function(user) {
                        if (user) {
                            req.flash('error', { msg: user.email + ' is already associated with another account.' });
                            return done();
                        }
                        var new_User = {
                            name: profile.name.givenName + ' ' + profile.name.familyName,
                            email: profile._json.email,
                            gender: profile._json.gender,
                            location: profile._json.location && profile._json.location.name,
                            picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
                            facebook: profile.id
                        }
                        models.userTables.create(
                                new_User
                            )
                            .then(function(user) {
                                done(null, user);
                            });
                    });
            });
    }
}));

// Sign in with Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        models.userTables.findOne({
                where: {
                    google: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    req.flash('error', { msg: 'There is already an existing account linked with Google that belongs to you.' });
                    return done(null);
                }
                models.userTables.findOne({
                        where: {
                            id: req.user.id
                        }
                    })
                    .then(function(user) {
                        var new_User = {
                            name: user.name || profile.displayName,
                            gender: user.gender || profile._json.gender,
                            picture: user.picture || profile._json.image.url,
                            google: profile.id
                        }
                        models.userTables.create(
                                new_User
                            )
                            .then(function() {
                                req.flash('success', { msg: 'Your Google account has been linked.' });
                                done(null, user);
                            });
                    });
            });
    } else {
        models.userTables.findOne({
                where: {
                    google: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    return done(null, user);
                }
                models.userTables.findOne({
                        where: {
                            email: profile.emails[0].value
                        }
                    })
                    .then(function(user) {
                        if (user) {
                            req.flash('error', { msg: user.get('email') + ' is already associated with another account.' });
                            return done();
                        }
                        var new_User = {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            gender: profile._json.gender,
                            location: profile._json.location,
                            picture: profile._json.image.url,
                            google: profile.id
                        }
                        models.userTables.create(
                            new_User
                        ).then(function(user) {
                            console.log(user);
                            done(null, user);
                        });
                    });
            });
    }
}));

// Sign in with Twitter
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
}, function(req, accessToken, tokenSecret, profile, done) {

    if (req.user) {
        models.userTables.findOne({
                where: {
                    twitter: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    req.flash('error', { msg: 'There is already an existing account linked with Twitter that belongs to you.' });
                    return done(null);
                }
                models.userTables.findOne({
                        where: {
                            id: req.user.id
                        }
                    })
                    .then(function(user) {

                        var new_User = {
                            name: user.name || profile.displayName,
                            location: user.location || profile._json.location,
                            picture: user.picture || profile._json.profile_image_url_https,
                            twitter: profile.id
                        }
                        models.userTables.create(
                            new_User
                        )

                        .then(function() {
                            req.flash('success', { msg: 'Your Twitter account has been linked.' });
                            done(null, user);
                        });
                    });
            });
    } else {
        models.userTables.findOne({
                where: {
                    twitter: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    return done(null, user);
                }
                // Twitter does not provide an email address, but email is a required field in our User schema.

                var new_User = {
                    name: profile.displayName,
                    email: profile.username + '@twiiter.com',
                    location: profile._json.location,
                    picture: profile._json.profile_image_url_https,
                    twitter: profile.id
                }
                models.userTables.create(
                    new_User
                )

                .then(function(user) {
                    done(null, user);
                });
            });
    }
}));

// Sign in with Github
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        models.userTables.findOne({
                where: {
                    github: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    req.flash('error', { msg: 'There is already an existing account linked with Github that belongs to you.' });
                    return done(null);
                }

                models.userTables.findOne({
                        where: {
                            id: req.user.id
                        }
                    })
                    .then(function(user) {
                        var new_User = {
                            name: user.name || profile.displayName,
                            picture: user.picture || profile._json.avatar_url,
                            github: profile.id
                        }
                        models.userTables.create(
                                new_User
                            )
                            .then(function() {
                                req.flash('success', { msg: 'Your Github account has been linked.' });
                                done(null, user);
                            });
                    });
            });
    } else {

        models.userTables.findOne({
                where: {
                    github: profile.id
                }
            })
            .then(function(user) {
                if (user) {
                    return done(null, user);
                }
                models.userTables.findOne({
                        where: {
                            email: profile.email
                        }
                    })
                    .then(function(user) {
                        if (user) {
                            req.flash('error', { msg: user.get('email') + ' is already associated with another account.' });
                            return done();
                        }
                        var new_User = {
                            name: profile.displayName,
                            picture: profile._json.avatar_url,
                            github: profile.id
                        }
                        models.userTables.create(
                                new_User
                            )
                            .then(function(user) {
                                done(null, user);
                            });
                    });
            });
    }
}));