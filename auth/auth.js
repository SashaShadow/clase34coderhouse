import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from '../utils.js';
import { User } from '../dbsConfig.js';

export const login = () => {
    passport.use('login', new LocalStrategy((username, password, done) => {
        return User.findOne({ username })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'Usuario inexistente' })
            }
      
            if (!isValidPassword(user.password, password)) {
              return done(null, false, { message: 'Contraseña incorrecta' })
            }
            
            return done(null, user)
          })
          .catch(err => done(err))
      }))
}

export const signup = () => {
    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
      }, (req, username, password, done) => {
        let errMsg = '';
        return User.findOne({ username })
          .then(user => {
            if (user) {
              errMsg = 'El nombre de usuario ya existe'
              return null;
            }
      
            const newUser = new User()
            newUser.username = username
            newUser.password = createHash(password)
            newUser.email = req.body.email
    
            req.session.user = newUser;
      
            return newUser.save()
          })
          .then(user => {
            if (!user && errMsg !== '') {
              return done(null, false, {message: errMsg})
              }
              return done(null, user)
          })
          .catch(err => {
            return done(err)
          })
       }))
}

export const serialize = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
}

export const deSerialize = () => {
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })
}