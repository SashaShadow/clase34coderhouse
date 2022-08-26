import passport from 'passport';
import process from 'process';
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from '../utils.js';
import { User } from '../dbsConfig.js';
import "dotenv/config.js";
import { createTransport } from 'nodemailer';


const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: 'caballerosasha@gmail.com',
      pass: process.env.GMAILACC
  }
});

const ADMIN_MAIL = 'caballerosasha@hotmail.com';

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
        return User.findOne({$or: [{username: username}, {email: req.body.email}, {phone: req.body.phone}]})
          .then(user => {
            if (user) {
              console.log(user);
              errMsg = 'El nombre de usuario, email o el numero teléfonico ya se encuentran registrados en otra cuenta'
              return null;
            }
            
            if (req.session.phoneError) { //ERROR QUE SUCEDE SI EL NÚMERO ESTÁ EN UN FORMATO INVÁLIDO
              errMsg = req.session.phoneError;
              return null;
            }

            if (req.session.fileError) { //ERROR QUE SUCEDE SI LA FOTO/AVATAR TIENE UN FORMATO INVÁLIDO
              errMsg = req.session.fileError;
              return null;
            }
      
            const newUser = new User()
            newUser.username = username
            newUser.password = createHash(password)
            newUser.email = req.body.email
            newUser.name = req.body.name
            newUser.age = req.body.age
            newUser.address = req.body.address
            newUser.phone = req.body.phone
            newUser.photo = `${req.session.img}`
    
            req.session.user = newUser;

            // User.findOne({admin: true})
            // .then(user => {
              const mailOptions = {
                from: 'Tetsu Fragancias Admin',
                to: ADMIN_MAIL,
                subject: 'Nuevo usuario registrado',
                html: `
                <h1>Nuevo usuario registrado</h1>
                <h2>Detalles de la cuenta</h2>
                <ul>
                  <li>Nombre de usuario: ${newUser.username}</li>
                  <li>Nombre: ${newUser.name}</li>
                  <li>Email: ${newUser.email}</li>
                  <li>Teléfono: ${newUser.phone}</li>
                </ul>
                `
              }

                try {
                  transporter.sendMail(mailOptions)
                } catch (err) {
                  console.log(err)
                }
            // });
      
            return newUser.save();
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