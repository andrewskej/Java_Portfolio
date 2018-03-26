module.exports = function(app,session,io,bodyParser){

  var route = require('express').Router();

  route.get('/',function(req,res){
    var username = req.session.username;
    var level = req.session.level;
    console.log('chat-username:'+username);
    var user ={username:username,level:level}
    res.render('../views/chat/chat',{user:user});

  });

  io.sockets.on('connection',function(socket){
//    socket.broadcast.emit('user join');
    console.log('io connection on - a new user')

    socket.on('sendMSG',function(name,text){
      var msg = name+': '+text+'\n';
      io.emit('sendMSG',msg);
    })

    socket.on('leave',function(){
      console.log('a user has left')
    })

    socket.on('chat_user',function(raw_msg){
      var msg = JSON.parse(raw_msg);
      var channel = '';
      if(msg['channel']!=undefined){
        channel=msg['channel'];
      }
      socket.emit('socket_evt_chat_user',JSON.stringify(users));

    })


  });

  return route;
}
