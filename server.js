const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const multer = require('multer');


const hostname = 'localhost';
const port = 8000;

// Configure Multer for file uploads with custom filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Custom filename
    }
});

const upload = multer({ storage: storage });

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} received.`);

    let parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    if (req.method === 'POST' && pathname === '/upload') {
        // Handle file upload request
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.writeHead(500);
                res.end('Error uploading file');
                return;
            }
            // File uploaded successfully
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'File uploaded successfully' }));
        });
    } else {
        // Serve static files (HTML, CSS, JavaScript, etc.)
        let filePath = `.${pathname}`;
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
