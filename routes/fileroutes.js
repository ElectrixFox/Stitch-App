const express = require('express'); // requires the express package
const fs = require('fs');   // requires the file system package
const path = require('path');   // requires the path package
const url = require('url'); // requires the url package
const multer = require('multer'); // requires the multer package
const router = express.Router();    // creates a router

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // file name
    }
});

const upload = multer({storage});    // sets storage details
// app.use(bodyParser.json()); // to parse json bodies

router.post('/write-file', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file)
        {
        return res.status(400).send({ error: "File upload failed" });        
        }

    const q = url.parse(req.url, true); // parses the url
    const filename = q.query['name'];   // gets the name query
    const content = req.body; // gets the body of the request
    const filePath = __dirname + '..\\uploads' + filename;  // gets the new file path
    
    res.json({ message: "File uploaded successfully", filePath });
    
    
});

router.get('/read-file/:filename', (req, res) => {
    const { filename } = req.params;    // gets the file name
    const filePath = path.join(__dirname, '../uploads', filename);  // gets the file path

    fs.readFile(filePath, 'utf8', (err, data) => {  // starts the reading of the file
        if (err)
            {
            return res.status(500).json({ error: "Failed to read file" }); // gives an error message
            }
        res.json({ content: data });
    });
});

module.exports = router;