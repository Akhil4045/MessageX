const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = requre('mongoose');
const bodyParser = require('body-parser');
const messages = require('./models/messages');
const users = require('./models/users');
const { set } = require('express/lib/application');
const { json } = require('express/lib/response');

dotenv.config();
const port = process.env.PORT || 8089;
const mongoDb = process.env.MONGOOSPORT;

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('mongoDb connection successful');
});
db.on('error', console.error.bind(console, "MongoDB connection error:"));

app.post('/messages', async(req, res) => {
    try {
        const { user_name, name, email, phone, message } = req && req.body;
        let userRow = await db.users.find({ $or: [ { user_name:  user_name  }, { email: email } ] });
        if (userRow) {
            let msg = new messages({ user_name, name, email, phone, message });
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

app.get('/message', async(req, res) => {
    res.render('messages.ejs');
});

app.get('*', (req, res)=> {
    res.send('Welcome!');
});

app.listen(port, ()=> {
    console.log(`server running on ${port}`);
});