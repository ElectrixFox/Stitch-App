const express = require('express'); // requires the express package
const path = require('path');   // requires the path package
const router = express.Router();    // creates a router

router.use(express.static('public')); // the location of all the static files

router.get ('/index', (req, res) => {
    console.log("Welcome to home");
    res.redirect('index.html');
});

router.get ('/wipview', (req, res) => {
    console.log("\n\nWelcome to wipview");
    res.redirect('wipview.html');
});

router.get ('/wipview/:id', (req, res) => {
    const ID = req.params.id;
    console.log("\n\nWelcome to wipview for " + ID);
    const pathm = path.join(__dirname, '..', 'public', 'wipview.html')
    console.log(pathm);
    res.sendFile(pathm);
});

module.exports = router;