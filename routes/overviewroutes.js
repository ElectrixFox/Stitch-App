const express = require('express'); // requires the express package
const path = require('path');   // requires the path package
const router = express.Router();    // creates a router

router.use(express.static('public')); // the location of all the static files

router.get ('/:id', (req, res) => {
    console.log("\n\nWelcome to wip overview");
    // const ID = req.params.id;
    const pathm = path.join(__dirname, '..', 'public', 'wipoverview.html'); // creates the path to the wip view html
    console.log(pathm);
    res.sendFile(pathm);    // sends the static file back to be shown
});

module.exports = router;
