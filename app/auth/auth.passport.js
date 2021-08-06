module.exports = (app) => {
    const passport = require("passport");
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    const keys = require("../../config/keys.js");
    const User = require("../models/user.model.js");
    const UserAccount = require("../models/user-account.model.js");
    const cookieSession = require("cookie-session");

    app.use(cookieSession({
        // milliseconds of a day
        maxAge: 24*60*60*1000,
        keys:[keys.session.cookieKey]
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user);
        });
    });

    passport.use(
        new GoogleStrategy({
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: 'https://expense-tracker-crud-app.willmcmahan.repl.co/auth/google/callback'
        }, (accessToken, refreshToken, profile, done) => {
            // passport callback function
            //check if user already exists in our db with the given profile ID
            User.findOne({googleId: profile.id}).then((currentUser)=>{
                if(currentUser){
                //if we already have a record with the given profile ID
                    // done(null, currentUser);
                    UserAccount.findOne({userId: currentUser._id}).then((currentAccount) => {
                        if(currentAccount) {
                            done(null, currentUser)
                        } else {
                            new UserAccount({
                                userId: currentUser._id
                            }).save().then((newAccount) => {
                                return currentUser;
                            })
                        }
                    });
                } else{
                    //if not, create a new user 
                    new User({
                    googleId: profile.id,
                    }).save().then((newUser) =>{
                        // done(null, newUser);
                        UserAccount.findOne({userId: newUser._id}).then((currentAccount) => {
                            if(currentAccount) {
                                done(null, newUser)
                            } else {
                                new UserAccount({
                                        userId: newUser._id
                                }).save().then((newAccount) => {
                                    return newUser;
                                })
                            }
                        });
                    });
                } 
            })
        })
    );

    const accessProtectionMiddleware = (req, res, next) => {  
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login')
        }
    };

    app.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: '/', successRedirect: '/', cookieSession: true }), (req,res) => {
    });

    app.get("/login", (req, res) => {
        res.redirect("/auth/google")
    })

    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }));

    app.get("/auth/logout", (req, res) => {
        req.logout();
        res.send(req.user);
    });
}