const http = require('http');   // requires the http package
const url = require('url'); // requires the url package
const fs = require('fs');   // requires the file server package

const port = 8000;
const hostname = 'localhost';

/* File management examples
// this appends to a file or creates a new file if the file doesn't exist
fs.appendFile('testfile.txt', 'Hello World!', (err) => {    // access 'testfile.txt' and write 'Hello World!' with the errors (err) passed into the responce
    if (err) throw err;
    console.log("Saved");
});

// similarly this opens the file 'testfile.txt' for writing which creates a new file if the file doesn't exist
fs.open('testfile.txt', 'w', (err, file) => {   // accesses 'testfile.txt' to write ('w') passes the errors (err) and the file (file) to the responce function
    if (err) throw err;
    console.log("Saved");
});

// this replaces the given file and content if it exists if it doesn't exist then it will create the file with the given content
fs.writeFile('testfile.txt', 'Hello World!', (err) => {
    if (err) throw err;
    console.log("Saved");
});

// this deletes a file
fs.unlink('testfile.txt', (err) => {
    if (err) throw err;
    console.log("File deleted");
});

// this renames a file
fs.rename('testfile.txt', 'ntestfile.txt', (err) => {
    if (err) throw err;
    console.log("File renamed");
});
*/

/* example 1
const server = http.createServer((req, res) => {    // creates the server with request (req) and responce (res)
    res.writeHead(200, { 'Content-Type': 'text/html' });    // sets the responce to be shown as html text
    res.write("Hello World!");
    const q = url.parse(req.url, true).query;   // this gets the part of the url which is the query
    console.log(q.year);    // gets the part of the url containing the year e.g. http://localhost:8000/?year=2020 gives 2020
    res.write(req.url); // writes the url from the request into the responce
    res.end();  // finishes the responce
});
*/

/* example 2
const server = http.createServer((req, res) => {    // creates the server with request (req) and responce (res)
    fs.readFile('ntest.html', (err, data) => {  // reads the file ntest.html passing error (err) and the file (data) to the responce function
        res.writeHead(200, { 'Content-Type': 'text/html' });    // reads the file as an html file
        res.write(data);    // writes the html file to the screen
        return res.end();
    });
});
*/

const server = http.createServer((req, res) => {    // creates the server with request (req) and responce (res)
    const q = url.parse(req.url, true); // parses the url to be readable
    const filename = "." + q.pathname;  // gets the desired file to open

    fs.readFile(filename, (err, data) => {  // reads the file passing error (err) and the file (data) to the responce function
        if (err)
            {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
            }
        res.writeHead(200, { 'Content-Type': 'text/html' });    // reads the file as an html file
        res.write(data);    // writes the html file to the screen
        return res.end();
    });
});

server.listen(port, hostname);  // gets the server to listen for an attempt to access the server (localhost) on the given port