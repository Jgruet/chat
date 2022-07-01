const http = require("http");
const fs = require("fs");
const path = require("path");

function send404(response) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("Error 404: Resource not found.");
    response.end();
}

const mimeLookup = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/x-png",
    ".ttf": "font/ttf",
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".svg": "image/svg+xml",
    ".html": "text/html",
};

const server = http.createServer((req, res) => {
    if (req.method == "GET") {
        let fileurl;
        if (req.url == "/") {
            fileurl = "public/index.html";
        } else if (req.url == "/documentation") {
            fileurl = "public/documentation.html";
        } else {
            fileurl = req.url;
            console.log(req.url);
        }
        let filepath = path.resolve("./" + fileurl);

        if (fs.existsSync(filepath) && fs.lstatSync(filepath).isFile() && fileurl.search(/\.\./) === -1) {
            let fileExt = path.extname(filepath);
            let mimeType = mimeLookup[fileExt];

            if (!mimeType) {
                send404(res);
                return;
            }

            fs.exists(filepath, (exists) => {
                if (!exists) {
                    send404(res);
                    return;
                }

                res.writeHead(200, { "Content-Type": mimeType });
                fs.createReadStream(filepath).pipe(res);
            });
        } else {
            send404(res);
            return;
        }
    }
});

server.listen(process.env.PORT || 8000, () => {
    console.log(`http://localhost:${process.env.PORT || 8000}`);
});

const ServerChat = require("./app/ServerChat.js");
new ServerChat(server);

/* const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');


const server = http.createServer((req,res, next = ()=>{}) => {
    if(req.url == '/') req.url='index.html';
    serveStatic( path(__dirname,'public'));
});

server.listen(9000, () => { console.log(`http://localhost:9000`); });

//----------------------------------------------------------
// Mise en place du chat
//----------------------------------------------------------
const ServerChat = require('./app/ServerChat.js');
new ServerChat(server); */
