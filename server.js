const express = require('express');
const app = express();
const config = require('./config.json');
const WebSocket = require('ws').Server;
const http = require('http').createServer();
const fs = require('fs');
//const path = require('path');
const ws = new WebSocket({server:http});
let changes = [];

app.get('/*',function(req,res){
    //console.log(fs.existsSync(__dirname + '/webapp' + req.path));
    if (fs.existsSync('pages' + req.path) && fs.lstatSync('pages/' + req.path).isFile()){
        res.sendFile(__dirname + '/webapp/index.html');
    }else if (req.path == '/'){
        res.sendFile(__dirname + '/webapp/index.html');
    }else if (fs.existsSync(__dirname + '/webapp' + req.path)){
        res.sendFile(__dirname + '/webapp' + req.path);
    }else{
        res.sendFile(__dirname + '/webapp/index.html');
    }
});
ws.on('connection',function(f){
    f.on('message',function(msg){
        array = new Uint8Array(msg);
        let message = "";
        array.forEach(function (h) {
            let char = String.fromCharCode(h);
            message += char
        });
        message = JSON.parse(message);
        if (message[0] == 'page'){
            try{
                f.send(JSON.stringify(['page',fs.readFileSync('pages' + message[1],{encoding:'utf-8'})]))
            }catch(e){
                f.send(JSON.stringify(['page','This page does not exist']));
            }
        }
        if (message[0] == 'random'){
            files = fs.readdirSync('pages/');
            random = files[Math.floor(Math.random() * files.length)]
            f.send(JSON.stringify(['random',random]))
        }
        if (message[0] == 'recent'){
            f.send(JSON.stringify(['recent',changes]));
        }
        if (message[0] == 'edit'){
            fs.writeFileSync('pages' + message[2],message[1]);
            date = new Date();
            changes.unshift([message[2],date.toDateString()]);
        }
    })
});

//app.use(express.static('webapp'))
http.on('request',app);
http.listen(config.port);