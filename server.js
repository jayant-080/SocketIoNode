// const express = require('express');
// const http = require('http');
// const app = express();
// const port = process.env.PORT || 5000;
// var server = http.createServer(app);
// var io = require('socket.io')(server);

import express from 'express';
import http from 'http';
import Server from 'socket.io';
const app = express();
const port = process.env.PORT || 9696;
var server = http.createServer(app);

var io = new Server(server);




//middlewear
app.use(express.json());
var clients = {};

io.on("connection",(socket)=>{
console.log("connected");
console.log(socket.id ,"has joined");


socket.on("signin",(id)=>{
  console.log(id);
  clients[id]= socket;
  console.log(clients);
 
});

socket.on("signout",(id)=>{
   delete clients[id];
   console.log(clients);
});



socket.on("message",(mssg)=>{
  let targetId = mssg.targetId;
  if(clients[targetId]){
    clients[targetId].emit("message",mssg);
  }
});





socket.on("image",(image)=>{

 let targetId = image.targetId;
 if(clients[targetId]){
   clients[targetId].emit("image",image);
 }

});

socket.on("typing",(typing)=>{
  
  let target= typing.target;
  if(clients[target]){
    clients[target].emit("typing",typing)
  }
});

socket.on("setname",(setname)=>{

  let target= setname.target;
  if(clients[target]){
    clients[target].emit("setname",setname)
  }
});

socket.on("isSeen",(data)=>{
  let friendid = data.freindid;
  let currentUser = data.currentuserid;

  console.log(friendid + currentUser)
  if(clients[friendid] && clients[currentUser]){
   clients[currentUser].emit("seen","online")
  }else{
    if(clients[currentUser])
    clients[currentUser].emit("seen","offline")
  }
});




});

server.listen(port,"0.0.0.0",()=>{
    console.log("server started");
});



