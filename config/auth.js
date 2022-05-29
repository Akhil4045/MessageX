const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '180000s' });
}

exports.generateAccessToken = generateAccessToken;