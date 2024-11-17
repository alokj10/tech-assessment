'use strict';

import passport from 'passport';
import { AuthConfig, Constants } from './commons/ServerConfig';
var GoogleTokenStrategy = require('passport-google-token').Strategy;
import users from './users';
var LocalStrategy = require('passport-local').Strategy;

import UserModel from './Models/UserModel';

console.log('passport intitialized');
/*
passport.serializeUser(function(user, done) { //In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.emailId);
});

passport.deserializeUser(function(emailId, done) { //Here you retrieve all the info of the user from the session storage using the user id stored in the session earlier using serialize user.
    let existingUser = users.GetUser(emailId);
    if(existingUser !== null) {
        console.log('user found');
        let userEntity = {
            ...existingUser,
            emailId: emailId,
            name: existingUser.displayName ? existingUser.displayName : emailId,
            role: existingUser.role
        };
        done(null, userEntity);
    }
    
});
*/
var localOptions = {
    usernameField: 'emailId',
    passwordField: 'password'
};
passport.use(new LocalStrategy(localOptions, async function(emailId, password, done) {
        console.log('local strategy being used');
        let userModel = new UserModel();
        let existingUser = await userModel.CheckUserCredentials(emailId, password);

        if(existingUser) {
            console.log('existingUser', existingUser);
            console.log('user_meta', existingUser.user_meta);

            // let userMeta = JSON.parse(existingUser.user_meta);
                                    let userEntity = {
                                        id: existingUser.id,
                                        emailId: emailId,
                                        name: existingUser.user_meta.name ? existingUser.user_meta.name : emailId,
                                        role: existingUser.user_meta.role,
                                        orgId: existingUser.user_meta.orgId
                                    };
                                    console.log('userEntity', userEntity);
            done(null, userEntity);
        }
        else {
            const newUser = {
                emailId: emailId,
                status: 'not found',
                name: emailId,
                role: 'guest'
            }
            
            done(null, newUser);
        }
        /*
        userModel.GetUserByEmail(emailId)
                            .then((users) => {
                                let existingUser = users[0];
                                if(existingUser) {
                                    let userMeta = JSON.parse(existingUser.user_meta);
                                    let userEntity = {
                                        id: existingUser.id,
                                        emailId: emailId,
                                        name: userMeta.name ? userMeta.name : emailId,
                                        role: userMeta.role,
                                        orgId: userMeta.orgId
                                    };
                                    console.log('user found', userEntity);
                                    done(null, userEntity);
                                }
                                else {
                                    console.log('unknown user login being attempted');
                                    
                                    const newUser = {
                                        emailId: emailId,
                                        status: 'not found',
                                        name: emailId,
                                        role: 'guest'
                                    }
                                    
                                    done(null, newUser);
                                }
                            });
        */
        /*if(emailId === Constants.AdminEmailId) {
            console.log('admin user being added');
            let userEntity = {
                emailId: emailId,
                name: Constants.AdminEmailId,
                role: Constants.AdminRole
            };
            users.Add(userEntity);
            return done(null, userEntity);
        }*/
    }
))
/*
passport.use('google-token',new GoogleTokenStrategy({
        clientID: AuthConfig.clientId,
        clientSecret: AuthConfig.clientSecret,
        callbackUrl: 'http://localhost:3001/api/admin/auth/callback'
    }, (accessToken, refreshToken, profile, done) => {
    try{
        console.log('profile authenticated', profile);
        let emailId = profile.emails[0].value;
        let existingUser = users.GetUser(emailId);
        if(existingUser !== null) {
            let userEntity = {
                emailId: emailId,
                name: profile.displayName,
                role: existingUser.role
            };
            users.UpdateUser(emailId, userEntity);
            return done(null, existingUser);
        }
        if(emailId === Constants.AdminEmailId) {
            let userEntity = {
                emailId: emailId,
                name: profile.displayName,
                role: Constants.AdminRole
            };
            users.Add(userEntity);
            return done(null, userEntity);
        }
        const newUser = {
            emailId: emailId,
            googleId: profile.id,
            status: 'not found',
            name: profile.displayName,
            role: 'guest'
        }
        // users.Add(newUser);
        done(null, newUser);
    }
    catch(err) {
        console.log('error occured in profile authentication callback');
        console.log(err);
        done(err, false, err.message);
    }
}));
*/