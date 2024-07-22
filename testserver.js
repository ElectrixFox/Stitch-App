const http = require('http');   // requires the http package
const url = require('url'); // requires the url package
const fs = require('fs');   // requires the file server package
const events = require('events');   // requires the events package
const formidable = require('formidable');   // requires the formidable package

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

/* example 3
const server = http.createServer((req, res) => {    // creates the server with request (req) and responce (res)
    const homefile = '/ntest.html';
    const q = url.parse(req.url, true); // parses the url to be readable

    if(q.pathname === "/")  // if there is no destination
        q.pathname = homefile;    // set the default file as the destination

    const filename = "." + q.pathname;  // gets the desired file to open

    fs.readFile(filename, (err, data) => {  // reads the file passing error (err) and the file (data) to the responce function
        if(err) // if there is an error
            {
            res.writeHead(404, { 'Content-Type': 'text/html' });    // setting to be an error (404) and to write as text
            return res.end("404 Not Found");    // writing the error and closing the responce
            }
        res.writeHead(200, { 'Content-Type': 'text/html' });    // reads the file as an html file
        res.write(data);    // writes the html file to the screen
        return res.end();
    });
});
*/

/* Event emitting example
const rs = fs.createReadStream('./ntestfile.txt');  // creates a read stream for tracking when the given file is open
rs.on('open', () => {   // on 'open' execute the given function
    console.log("The file is open");
});

const eventEmitter = new events.EventEmitter(); // creates an emitter for events
const eventHandler = () => {    // creates an event handler
    console.log("Event recieved");
};
eventEmitter.on('memit', eventHandler)  // when 'memit' is emitted do event handler

eventEmitter.emit('memit');
*/

/* Uploading files example
const server = http.createServer((req, res) => {    // creates the server with request (req) and responce (res)
    if (req.url == '/fileupload')   // if should upload
        {
        const form = new formidable.IncomingForm(); // create a new form
        form.parse(req, (err, fields, files) => {   // parses the incomming files
            const oldpath = files.filetoupload[0].filepath;    // gets the old file path
            const newpath = 'C:/Users/tonyp/Downloads/' + files.filetoupload[0].originalFilename; // creates the new file path
            console.log("Old Path: %s\t\t\tNew Path: %s", oldpath, newpath);
            fs.rename(oldpath, newpath, (err) => {  // changes the file path
                if (err) throw err;
                res.write("File uploaded and moved");
                res.end();
            });
            res.write("File uploaded");
            res.end();
        });
        }
    else
        {
        res.writeHead(200, { 'Content-Type': 'text/html' });    // reads the file as an html file
        
        // writing the html to be able to perform the action
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
        }
});
*/

const server = http.createServer((req, res) => {    // creates the server with request (req) and responce (res)
    const homefile = '/ntest.html';
    const q = url.parse(req.url, true); // parses the url to be readable

    if(q.pathname === "/")  // if there is no destination
        q.pathname = homefile;    // set the default file as the destination

    const filename = "." + q.pathname;  // gets the desired file to open

    fs.readFile(filename, (err, data) => {  // reads the file passing error (err) and the file (data) to the responce function
        if(err) // if there is an error
            {
            res.writeHead(404, { 'Content-Type': 'text/html' });    // setting to be an error (404) and to write as text
            return res.end("404 Not Found");    // writing the error and closing the responce
            }
        res.writeHead(200, { 'Content-Type': 'text/html' });    // reads the file as an html file
        res.write(data);    // writes the html file to the screen
        return res.end();
    });
});

server.listen(port, hostname);  // gets the server to listen for an attempt to access the server (localhost) on the given port