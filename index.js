const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const messages = require('./models/messages');
const users = require('./models/users');
const auth = require("./config/auth");
const mailer = require("./config/mailer");
const middleware = require("./middleware/auth");
const { set } = require('express/lib/application');
const { json } = require('express/lib/response');

dotenv.config();
const port = process.env.PORT || 8089;
const mongoDb = process.env.MONGOOSPORT;

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/views",express.static(__dirname+"/views"));
app.set('view engine', 'ejs');

mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('mongoDb connection successful');
});
db.on('error', console.error.bind(console, "MongoDB connection error:"));

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
        const { to, subject, text, html } = req && req.body;
        let user = await users.findOne({ email: to }), resp = {};
        if (user) {
            let mres = await mailer.generateMail(to, subject, text, html);
            resp.status = true; resp.data = mres;
        }
        else {
            resp.status = false;
            resp.message = "User doesn't exist!";
        }
        return res.json({ resp: resp });
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
        }
        else {
            token.status = false;
            token.message = "";
        }
        console.log(token);
        res.json(token);
    }
    catch(ex) {
        res.status(425).send({ message: ex.message });
    }  
}); 

app.get('/message', middleware.authenticateToken,async(req, res) => {
    res.render('messages.ejs');
});

app.get('/login', async(req, res) => {
    res.render('login.ejs');
});

app.get('*', (req, res)=> {
    res.render('login.ejs');
});

app.listen(port, ()=> {
    console.log(`server running on ${port}`);
});