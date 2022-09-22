const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {checkIfAuthenticatedJWT} = require('../../middlewares')



const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign({
        'id': user.id,
        'email': user.email
    },
        secret, {
        expiresIn: expiresIn

    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const {User, BlacklistedToken} = require('../../models')

router.post('/login', async (req,res) => {
    
    
    let user = await User.where({
        'email' : req.body.email
    }).fetch({
        require: false
    })

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user.toJSON(), process.env.TOKEN_SECRET, '15m')
        let refreshToken = generateAccessToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '7d')
        res.send({
            accessToken, 
            refreshToken,
            'user_id' : user.get('id'),
            'user_first_name': user.get('first_name')
        })
    } else {
        res.status(204)
        res.send("Wrong email or password")
    }
})

router.post('/refresh', async(req,res) => {
    let refreshToken = req.body.refreshToken
    if (!refreshToken) {
        res.sendStatus(401)
    }

    //check if the refresh token has been black listed 
    let blacklistedToken = await BlacklistedToken.where({
        'token' : refreshToken
    }).fetch({
        require: false
    })

    if (blacklistedToken) {
        res.status(401)
        return res.send('The refresh token has expired')
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }

        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '15m')
        res.send({
            accessToken
        })
    })
})

router.get('/profile', async (req,res) => {
    let user = await User.where({
        'id' : req.headers.id
    }).fetch({
        require: false
    })
    res.send(user)
})

router.post('/register', async(req,res) => {
    let user = new User({
        'first_name' : req.body.first_name,
        'last_name' : req.body.last_name,
        'email': req.body.email,
        'password': getHashedPassword(req.body.password)
    })

    await user.save()
    res.send(user)
})

router.post('/logout', async (req, res) => {
    console.log('logout route reached')
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,async (err, user) => {
            if (err) {
                res.json({
                    error: 'Refresh token not found.'
                })
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date()); // use current date
            await token.save();
            res.send({
                'message': 'Logged Out'
            })
        })

    }

})

module.exports = router 