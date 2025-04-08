require('dotenv').config();
const http = require("http");
const url = require('url') ;
const app = require('./index');
// const db=require('./config/connection');




const server = http.createServer(app);
server.listen(process.env.PORT, ()=>{
    console.log('Server is running...')
});
