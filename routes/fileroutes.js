const express = require('express'); // requires the express package
const multer = require('multer'); // requires the multer package
const upload = multer({ dest: 'uploads/' });    // sets upload location
const router = express.Router();    // creates a router

/* router.get('/upload', upload.single('file'), (req, res) => {
    console.log("Uploading");
    res.json(req.file);
});

router.post('/upload', upload.single('file'), (req, res) => {
    res.json(req.file);
}); */

module.exports = router;