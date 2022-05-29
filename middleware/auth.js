const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['cookie'];
    const token = authHeader && authHeader.split('=')[1];
    if (!token) { res.redirect("/login"); return; }
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) { console.log('test1'); res.redirect("/login"); return; }
        req.user = user;
        next();
    });
}

exports.authenticateToken = authenticateToken;
