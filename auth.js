// if you forget to do express generator, 
// express . --hbs

const passport = require('passport'); // helps you link in google, or faceebook for authorization and login
const GitHubStrategy = require('passport-github').Strategy; // accesss the strategy class via .stategy
const session = require('express-session');
const cookieParser = require('cookie-parser')
const User = require('./models/user');

const setupAuth = (app) => {
 // We accept the express `app` as an argument.
 // It will be created somewhere else; we
 // are just adding middleware to it.

    // app.use binds the middleware
    app.use(cookieParser()); 

    app.use(session({
        secret: 'secretserverword',
        resave: true,
        saveUninitialized: true
    }));

    // you'll find the ID and secret when you go to https://github.com/settings/applications/new
    passport.use(new GitHubStrategy({ 
        clientID: '7ec1b12dd9c3d42e7d68',
        clientSecret: '1dd37cd1b24006de3a87814899c0e72fb70a7c67',
        callbackURL: 'http://localhost:3000/github/auth'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({
            where: {
                github_id: profile.id
            }
        })
        .then(result => {
            return done(null, result[0]);
        })
        // catches the error, could also write .catch(done);
        .catch(err => {
            done(err);
        })
    }));

    // helps you see if you need to provide any info for the users // done is a callback
    passport.serializeUser((user, done) => { 
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        done(null, id);
    });

    app.use(passport.initialize());

    app.use(passport.session());

    app.get('/login', passport.authenticate('github'));
    
    app.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });

    app.get('/github/auth', 
        passport.authenticate('github', { 
            failureRedirect: '/login'
        }),
        (req, res) => {
            res.redirect('/');
        }
    );
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next;
    }
    // denied redirect to login
    res.redirect('/login');
};

// allows you to reference in another file
module.exports = setupAuth;
module.exports.ensureAuthenticated = ensureAuthenticated 