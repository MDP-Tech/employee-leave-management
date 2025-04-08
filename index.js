process.env.TZ = 'Asia/Kolkata';
const express=require('express');
const cors = require('cors');
const fs=require('fs');
const path = require('path');
const formidable = require('formidable');
const fileUpload = require('express-fileupload');
const session=require('express-session');
const bodyParser=require('body-parser');
const loginRoutes=require('./routes/loginRoutes');
const employeesRoutes = require('./routes/employeesRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const adminRoutes=require('./routes/adminRoutes');
const app=express();

app.use(cors());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
 
app.use(session({
    secret: 'yui1256', 
    resave: false, 
    saveUninitialized: false 
}));


app.use('/',loginRoutes);

app.use('/employees',employeesRoutes);
app.use('/leave',leaveRoutes);
app.use('/admin',adminRoutes);


app.post('/uploadFile', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const files = req.files['uploaded_document'];

    // Check if files is an array (multiple files) or a single file
    const fileList = Array.isArray(files) ? files : [files];

    const uploadDirectory = 'C:/inetpub/wwwroot/shiftwavehr/assets/uploads';

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    // Process each file in the array
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];

      if (!file || !file.name) {
        console.error(`Invalid file data for file at index ${index}`);
        continue;
      }

      const destinationPath = path.join(uploadDirectory, file.name);

      // Move the file to the destination
      file.mv(destinationPath, function (err) {
        if (err) {
          fs.writeFile(__dirname + '/error_log.log', err.toString(), 'UTF-8', (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
            }
          });
          console.error(err);
          res.status(500).send(JSON.stringify(err));
        } else {
          console.log(`File ${file.name} uploaded successfully`);
        }
      });
    }

    res.status(200).send({status:'Successfully created'});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



console.log(new Date().toLocaleString());

module.exports=app;














