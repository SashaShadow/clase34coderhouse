import passport from 'passport';

export const loginRoute = () => {
    return (req, res) => {

        if (req.user) {
            return res.redirect('/api/')
        } else {
            res.render("pages/login.ejs", { message: req.flash('error')})
        }
    }
}

export const loginPost = () => {
    return passport.authenticate('login', {
        successRedirect: '/api',
        failureRedirect: '/api/login',
        failureFlash: true
      })
}

export const signupRoute = () => {
    return (req, res) => {
        if (req.user) {
            return res.redirect('/api/')
        } else {
            res.render("pages/signup.ejs", { message: req.flash('error') })
        }
    }
}

export const signupPost = () => {
    return passport.authenticate('signup', {
        successRedirect: '/api',
        failureRedirect: '/api/signup',
        failureFlash: true
    })
}

export const logout = () => {
    return (req, res) => {

        const nameRemanent = req.user; 
    
        if (nameRemanent) {
            return req.session.destroy(err => {
                if (!err) {
                  return res.render("pages/logout.ejs", {name: nameRemanent})
                }
                return res.send({ error: err })
              })
        } else {
            return res.render("pages/expired.ejs")
        }  
       }
}