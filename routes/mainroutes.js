const express = require('express'); // requires the express package
const path = require('path');   // requires the path package
const router = express.Router();    // creates a router

router.use(express.static('public')); // the location of all the static files

router.get ('/', (req, res) => {
    console.log("\n\nWelcome to wipview");
    const pathm = path.join(__dirname, '..', 'public', 'wipview.html')
    res.sendFile(pathm);
    //res.redirect('wipview.html');
});

router.get ('/:id', (req, res) => {
    const ID = req.params.id;
    console.log("\n\nWelcome to wipview for " + ID);
    const pathm = path.join(__dirname, '..', 'public', 'wipview.html');

    console.log(pathm);
    res.sendFile(pathm);
});

module.exports = router;