const { Socket } = require('socket.io');
const app = require('./app')
const db = require('./config/db')
const port = process.env.PORT || 4000

db();

const server = app.listen(port,()=>{console.log(`server is running on ${port}`)});


//=======================Socket IO======================= 

