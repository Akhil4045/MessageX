const middleware = require("../middleware/auth");
const messages = require('../models/messages');
const users = require('../models/users');
const forgotlog = require('../models/forgot');
const auth = require("../config/auth");
const mailer = require("../config/mailer");

module.exports = function(app) {
        app.post('/messages', async(req, res) => {
                try {
                        const { user_name, name, email, phone, subject, message } = req && req.body;
                        let userRow = await db.collection("users").find({ $or: [ { user_name:  user_name  } ] });
                        if (userRow) {
                                let msg = new messages({ user_name, name, email, phone, subject, message });
                                await msg.save();
                                res.send("sucess");
                        }
                        else 
                                res.status(425).send({ message: "User doesn't exist" });
                }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        });
        
        app.post('/addUser', async(req, res) => {
                try {
                const { name, email, phone, user_name, password } = req && req.body;
                let user = new users({ user_name, name, email, phone, password });
                let exuser = await users.findOne({ user_name: user_name });
                if (!exuser) {
                        await user.save();
                        res.json({ status: true });
                }
                else {
                        res.json({ status: false });
                }       
                }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        });
        
        app.post('/getMessages', middleware.authenticateToken, async(req, res) => {
                try {
                let msgs = await messages.aggregate([
                        { $match : { user_name : req.user.user_name } },
                        { $addFields: { sendDate: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$send_date" } } } } 
                ]);
                res.json({ messages: (msgs? msgs: []) });    }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        }); 
        
        app.post('/forgotPassword', async(req, res) => {
                try {
                const { to, subject, text, html, pin } = req && req.body;
                let user = await users.findOne({ email: to }), resp = {};
                if (user) {
                        let user_name = user['user_name'];
                        let fg = new forgotlog({ user_name, email: to, pin });
                        await fg.save();
                        let mres = await mailer.generateMail(to, subject, text, html);
                        resp.status = true; resp.data = mres;
                }
                else {
                        resp.status = false;
                        resp.message = "User doesn't exist!";
                }
                return res.json(resp);
                }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        });
        
        app.post('/reset', async(req, res) => {
                try {
                const { email, pin, password } = req && req.body;
                let reset = await forgotlog.findOne({ email: email, pin: pin }), resp = {};
                if (reset) {
                        let t = new Date(reset.time), ext = t.setMinutes(t.getMinutes() + 30);
                        if ( t < new Date() < ext) {
                        await users.updateOne({ user_name: reset.user_name }, { $set: { password: password } });
                        resp.status = true; resp.message = "Password Changed successfully!";
                        }
                        else {
                        resp.status = false;
                        resp.message = "Expired";
                        }
                }
                else {
                        resp.status = false;
                        resp.message = "Invalid credentials!";
                }
                return res.json(resp);
                }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        });
        
        app.post('/sendMail', middleware.authenticateToken, async(req, res) => {
                try {
                const { to, subject, text, html } = req && req.body;
                let mres = await mailer.generateMail(to, subject, text, html);
                return res.json({ res: mres });
                }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        });
        
        app.post("/signin", async(req, res) => {
                try {
                const { user_name, password } = req && req.body, token = {};
                let user = await users.findOne({ user_name: user_name, password: password });
                if (user) {
                        token.status = true;
                        token.accessToken = auth.generateAccessToken({ user_name: user_name });
                        token.user = { Name: user.name, UserName: user.user_name, IsAdmin: user.isAdmin, Email: user.email, Phone: user.phone };
                }
                else {
                        token.status = false;
                        token.message = "";
                }
                res.json(token);
                }
                catch(ex) {
                res.status(425).send({ message: ex.message });
                }  
        }); 
}