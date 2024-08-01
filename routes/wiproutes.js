const express = require('express'); // requires the express package
const path = require('path');   // requires the path package
const router = express.Router();    // creates a router

router.use(express.static('public')); // the location of all the static files

router.get ('/', (req, res) => {
    console.log("\n\nWelcome to wip view home");
    const pathm = path.join(__dirname, '..', 'public', 'wipview.html')
    res.sendFile(pathm);
});

router.get ('/wipview', (req, res) => {
    console.log("\n\nWelcome to wip view");
    const pathm = path.join(__dirname, '..', 'public', 'wipview.html')
    res.sendFile(pathm);
});

router.get ('/wipoverview', (req, res) => {
    console.log("\n\nWelcome to wip overview");
    const pathm = path.join(__dirname, '..', 'public', 'wipoverview.html'); // creates the path to the wip view html
    console.log(pathm);
    res.sendFile(pathm);    // sends the static file back to be shown
});

module.exports = router;