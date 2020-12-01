const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { jwtSecret } = require('./secret');
const Users = require('../users/userModels');
const { isValid } = require('../users/userService');

router.get('/register', async (req, res) => {
    const credentials = req.body;
    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 10
        const hash = bcrypt.hashSync(credentials.password, rounds);
        credentials.password = hash;
        Users.create(credentials)
            .then(user => {
                res.status(201).json({ data: user })
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message,
                    stack: err.stack,
                })
            })
    } else {
        res.status(400).json({
            message: "Please provide username and password"
        });
    };
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (isValid(req.body)) {
        Users.findBy({ username: username })
            .then(([user]) => {
                if (user && bcrypt.compare(password, user.password)) {
                    const token = makeToken(user);
                    res.status(200).json({
                        message: 'Welcome to the API', token
                    })
                } else {
                    res.status(401).json({
                        message: 'Invalid Credentials'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message,
                    stack: err.stack
                })
            })
    } else {
        res.status(400).json({
            message: 'Please Provide A Valid Username & Password'
        });
    };
});

const makeToken = user => {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    }
    const options = {
        expiresIn: '30min'
    }
    return jwt.sign(payload, jwtSecret, options)
};

module.exports = router