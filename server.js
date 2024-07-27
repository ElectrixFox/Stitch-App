const express = require('express'); // requires the express package
const path = require('path');   // requires the path package

const port = 8000;
const hostname = 'localhost';

const app = express();

app.use(express.static('public')); // the location of all the static files
app.set('view engine', 'ejs');  // setting the viewing engine as ejs

app.get('/', (req, res) => {   // getting a callback from going to '/'
    console.log("Welcome to home");
    res.redirect('index.html');
});

const wipRouter = require('./routes/wiproutes');  // importing the wip routes
const overviewRouter = require('./routes/overviewroutes');  // importing the wip overview routes
const fileRouter = require('./routes/fileroutes');  // importing the file handling routes

app.get ('/index', (req, res) => {
    console.log("Welcome to home");
    const pathm = path.join(__dirname, 'public', 'index.html');
    console.log(pathm);
    res.sendFile(pathm);
});

app.use('/wipview', wipRouter);   // use the wip router
app.use('/wipoverview', overviewRouter);   // use the overview router
app.use('/', fileRouter);   // use the file router

app.listen(port, hostname);