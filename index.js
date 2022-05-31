const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

require('./routes/api')(app);

require('./routes/views')(app);

app.get('*', (req, res)=> {
    res.render('login.ejs');
});

app.listen(port, ()=> {
    console.log(`server running on ${port}`);
});