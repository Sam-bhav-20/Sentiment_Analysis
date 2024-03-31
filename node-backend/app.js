require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express()

const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
    ttl: process.env.SESSION_EXPIRY,
    autoRemove: 'native' 
});

const sess = {
    store,
    secret: process.env.SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
}

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) 
    sess.cookie.secure = true 
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(session(sess))
  
// Routing 
const userRoutes = require('./routes/userRoutes')

app.use('/api', userRoutes)

//global error handling
const errorHandler = require('./middlewares/errorHandler')
app.use(errorHandler)

module.exports = app