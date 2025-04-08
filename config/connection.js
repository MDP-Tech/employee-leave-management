const mysql = require('mysql2');
require('dotenv').config


var connection = mysql.createPool({
   
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: "new_password",
    database: process.env.DB_NAME
	
});

// var connection = mysql.createPool({
   
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: "",
//     database: process.env.DB_NAME,
// 	timezone: 'Asia/Kolkata',
//     debug    :  false
// });


module.exports= connection;