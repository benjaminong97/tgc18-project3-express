const { createRegistrationForm, bootstrapField, createLoginForm } = require("../forms")
const express = require('express')
const router = express.Router()
const {User} = require('../models')
const crypto = require('crypto')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash 
}


router.get('/register', (req,res) => {
    //display registration form
    const registerForm = createRegistrationForm()
    res.render(
        'users/register', {
            'form' : registerForm.toHTML(bootstrapField)
        }
    )

})

router.post('/register', (req, res) => {
    const registerForm = createRegistrationForm()
    registerForm.handle(req, {
        'success': async (form) => {
            const user = new User({
                'first_name': form.data.first_name,
                'last_name' : form.data.last_name,
                'email' : form.data.email,
                'password': getHashedPassword(form.data.password)
            })
            await user.save()
            req.flash('success_messages', `User with email: (${form.data.email}) signed up successfully!`)
            res.redirect('/users/login')
        },
        'error' : (form) => {
            res.render('users/register', {
                'form' : form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req,res) => {
    const loginForm = createLoginForm();
    res.render('users/login', {
        'form' : loginForm.toHTML(bootstrapField)
    })
})

router.get('/login', async (req,res) => 
{
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        'success' : async (form) => {
            //process login
            let user = await User.where({
                'email' : form.data.email
            }).fetch({
                require:false
            })
            if (!user) {
                req.flash('error_messages', "Authentication details incorrect, please try again")
                res.redirect('/users/login')
            } else {
                if (user.get('password') === getHashedPassword(form.data.password)) {
                    req.session.user = {
                        id: user.get('id'),
                        first_name: user.get('first_name'),
                        last_name: user.get('last_name'),
                        email: user.get('email')
                    }
                    req.flash('success_messages', "Welcome, " + user.get('first_name') + " " + user.get('last_name'))
                    res.redirect('/users/profile')
                } else {
                    req.flash('error_messages', 'Authentication details incorrect, please try again')
                    res.redirect('/users/login')
                }
            }
        }, 'errors': (form) => {
            req.flash('error_messages', "There are some problems logging you in, please try again")
            res.render('users/login', {
                'form' : form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', (req, res) => {
    const user = req.session.user;
    if(!user) {
        req.flash('error_messages', "Please login to see your profile")
        res.redirect('/users/login')
    } else {
        res.render('users/profile', {
            'user' : user
        })
    }
})

module.exports = router