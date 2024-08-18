let http = require('http');
let mime = require('mime');
let fs = require('fs');
let path = require('path');
let chatServer = require('./lib/chat_server.js');
let cache = {}

//Helper Functions
function send404(res){
  res.writeHead(404,{'Content-Type':'text/plain'});
  res.write('Error 404, resource not found');
  res.end();
}

function sendFile(res,filePath,fileContents){
  res.writeHead(
    200,
    {'Content-Type':mime.lookup(path.basename(filePath))}
  );
  res.end(fileContents);
}

function serveStatic(res,cache,absPath){
if(cache[absPath]){
    sendFile(res,absPath,cache[absPath]);
}else{
  fs.exists(absPath,(exists)=>{
      if(exists){
        fs.readFile(absPath,function(err,data){
          if(err){
            send404(res);
          }
          else{
            cache[absPath] = data;
            sendFile(res,absPath,data)
          }
        });
      }else{
        send404(res);
      }
    });
  }
}
//Helper Function finished

//Creating Server
var server = http.createServer((req,res)=>{
  var filePath = false;
  if(req.url=='/'){
    filePath = 'Public/index.html';
  }else{
    filePath = 'Public/'+req.url;
  }
  var absPath = './'+filePath;
  serveStatic(res,cache,absPath);
});

server.listen(3000,function(){
  console.log("Server listening on port 3000");
})

chatServer.listen(server);