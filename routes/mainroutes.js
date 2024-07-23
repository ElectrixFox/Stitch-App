const express = require('express'); // requires the express package
const router = express.Router();    // creates a router

router.get ('/index', (req, res) => {
    console.log("Welcome to home");
    res.redirect('index.html');
});

router.get ('/wipview', (req, res) => {
    console.log("\n\nWelcome to wipview");
    res.redirect('wipview.html');
});

module.exports = router;