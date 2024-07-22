const express = require('express'); // requires the express package
const multer = require('multer'); // requires the multer package

const port = 8000;
const hostname = 'localhost';

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // file name
    }
});

const upload = multer({storage});    // sets storage details

app.post('/save=text', upload.single('file'), (req, res) => {
    res.sendFile(`${__dirname}/public/${req.file.filename}`);
});

app.use(express.static('public')); // the location of all the static files
app.set('view engine', 'ejs');  // setting the viewing engine as ejs

app.get('/', (req, res) => {   // getting a callback from going to '/'
    console.log("Welcome to home");
    res.redirect('index.html');
});

const mainRouter = require('./routes/mainroutes');  // importing the main routes
const fileRouter = require('./routes/fileroutes');  // importing the file handling routes

app.use('/', mainRouter);   // use the main router
app.use('/', fileRouter);   // use the file router

app.listen(port, hostname);