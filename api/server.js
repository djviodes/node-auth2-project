const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const authRouter = require('../auth/authRouter');
const userRouter = require('../users/userRouter');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/auth', authRouter);
server.use('/api/users', userRouter);

module.exports = server;