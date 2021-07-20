const express = require('express');
const helmet = require("helmet");
const path = require('path');
const compression = require('compression');
const history = require('connect-history-api-fallback');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv/config');

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(compression());
app.use(express.json({limit: '16mb'}));
app.use(express.urlencoded({limit: '16mb'}));

const postsRoute = require('./routes/posts');
app.use('/api/posts',postsRoute);
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true},async ()=> {
    console.log('connected to DB');
});

const port = process.env.PORT || process.env.LOCALPORT;
const host = process.env.LOCALHOST;
app.listen(port,host,()=> {
    console.log("Server up and running port");
});