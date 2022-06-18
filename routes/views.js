const middleware = require("../middleware/auth");
const messages = require('../models/messages');
const users = require('../models/users');
const forgotlog = require('../models/forgot');
const auth = require("../config/auth");
const mailer = require("../config/mailer");

module.exports = function(app) {
    app.get('/message', middleware.authenticateToken,async(req, res) => {
        res.render('messages.ejs');
    });

    app.get('/login', async(req, res) => {
        res.render('login.ejs');
    });
}