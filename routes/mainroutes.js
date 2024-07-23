const express = require('express'); // requires the express package
const router = express.Router();    // creates a router

router.get ('/index', (req, res) => {
    console.log("Welcome to home");
    res.render('home');
    //res.redirect('index.html');
});

router.get ('/wipview', (req, res) => {
    console.log("\n\nWelcome to wipview");
    res.render('wipview');
    //res.redirect('wipview.html');
});

router.get ('/wipview/:id', (req, res) => {
    const ID = req.params.id;
    console.log("\n\nWelcome to wipview for" + ID);
    res.render('wipview');
    
    // res.redirect('wipview.html');
});

module.exports = router;