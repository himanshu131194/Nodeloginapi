const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const api = require('./api/controller');
const app = express();
const db = mongoose.connect( 'mongodb://nodeapi1:nodeapi123@ds143262.mlab.com:43262/nodeapi' )
                   .then(conn => conn).catch(console.error);

app.use(bodyParser.json());

//MIDDLEWARE TO CHECK DB IS CONNECTED OR NOT
app.use((req, res, next)=>{
    Promise.resolve(db)
           .then((connetion, err)=>{
                (typeof connetion !== 'undefined')
                ? next()
                : next(new  Error('Mongo Error'))
           });
});

//STORE SESSION IN MONGODB
app.use(session({
         secret: 'mysecret@123',
         resave: false,
         saveUninitialized: true,
         store: new MongoStore({
             collection: 'sessions',
             mongooseConnection: mongoose.connection,
         })
}));

//app.use('/users', api);
app.listen('8000', (err)=> {
     console.log("Connted to db");
     if(err){
        console.log(err);
     }
});
