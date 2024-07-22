const express = require('express'); // requires the express package
const router = express.Router();    // creates a router

router.get ('/ntest/man', (req, res) => {
    console.log("Welcome to home");
});

module.exports = router;