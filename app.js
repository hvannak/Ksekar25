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

const authRoute = require('./routes/auth');
const languageRoute = require('./routes/language');
const currencyRoute = require('./routes/currency');
const categoryRoute = require('./routes/category');
const notificationRoute = require('./routes/notification');
const productRoute = require('./routes/product');
// const localizationRoute = require('./routes/localization');

app.use('/api/auth',authRoute);
app.use('/api/language',languageRoute);
app.use('/api/currency',currencyRoute);
app.use('/api/category',categoryRoute);
app.use('/api/notification',notificationRoute);
app.use('/api/product',productRoute);
// app.use('/api/localization',localizationRoute);
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/User');

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true},async ()=> {
    console.log('connected to DB');
    const userDoc = await User.countDocuments();
    if(!userDoc){
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('123456',salt);
        const user = new User({
            name: 'admin',
            email: 'vannak2010@gmail.com',
            password: hashPassword    
        });
        await user.save();
    }
});

const port = process.env.PORT || process.env.LOCALPORT;
const host = process.env.LOCALHOST;
app.listen(port,host,()=> {
    console.log("Server up and running port");
});