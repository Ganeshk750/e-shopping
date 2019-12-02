const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const config = require('./config');

mongoose.connect(config.database,{ useUnifiedTopology: true, useNewUrlParser: true }, err =>{
    if(err){
        console.log(err);
    }else{
        console.log('Connected to the database');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

const userRoutes = require('./routes/accounts');
const mainRoutes = require('./routes/main');

app.use('/api',mainRoutes);
app.use('/api/accounts', userRoutes);

app.get('/', (req,res, next) =>{
    res.json({
        user: 'Ganesh'
    })
});

app.listen(config.port, err =>{
    console.log('Server is running on port:'+ config.port);
});