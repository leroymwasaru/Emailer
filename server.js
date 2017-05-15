const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

let db = null;
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(config.DB_URL);

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Mongo Model Schemas
const EmailSchema = mongoose.Schema({
    from: String,
    name: String,
  //  attachments: [String],
    subject: String,
    message: String
});

//Mongo Models
let Email = mongoose.model('Emails', EmailSchema);

//Handlers
db.once('open', function() {
    console.log("Connection to DB Establish");
    app.listen(config.PORT, () => {
        console.info('Listening on port ' + config.PORT);
    });
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/client/index.html')
    });
    app.post('/new-email', (req, res) => {
        new Email(req.body)
        .save((err, res) => {
            console.log("Saved: "+ res);
        })
        res.redirect('/');
    });
});


