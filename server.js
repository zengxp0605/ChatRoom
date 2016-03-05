/*****************  
//test1 start
var http = require('http');

var server =  http.createServer(function(req,res){
	res.writeHead(200,{
		'Content-type':'text/plain'
	});
	res.write('hello world!');
	res.end();
});

server.listen(80);
console.log('server started.');

//  test1 end
************************/

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var userList = {}; // 在线用户昵称列表

var port = process.env.PORT || 5001;

app.use('/',express.static(__dirname + '/www')); //指定静态资源目录
server.listen(port);
console.log('server started. listening on port *' + port );

/****** test of namespace
Server.js
	var m_io = io.of('/my-namespace');
	m_io.on('connection',function(socket){ });

Client.js
	var socket = io.connect('/my-namespace');
******/
// io.sockets.on('connection',function(socket){
io.on('connection',function(socket){
	console.log('io connection [ok]');
	socket.on('sendMsg',function(msg,color){
		console.log('sendMsg from: ',socket.username,'| message: ',msg);
		 //通知除自己以外的所有人 TODO：如何用了room 后如何实现
	    //socket.broadcast.emit('newMsg',socket.username,msg,color);
	    socket.to(socket.roomId).emit('newMsg',socket.username,msg,color);
	    //io.in(socket.roomId).emit('newMsg',socket.username,msg,color);
	});

	//注册昵称
	socket.on('login',function(nickname,roomId){
		var _rid = 'room_' + roomId;
		if('undefined' == (typeof userList[_rid]))
			userList[_rid] = [];
		if(userList[_rid].indexOf(nickname) > -1){
			socket.emit('nickExisted',{port:port});
			return;
		}else{
			socket.join(_rid);
			socket.userIndex = userList[_rid].length;
			socket.username = nickname;
			socket.roomId = _rid;
			userList[_rid].push(nickname);
			socket.emit('loginSuccess',{
				userIndex:socket.userIndex,
				socketId:socket.id,
				roomId:socket.roomId
			});
			// 通知所有人用 io.sockets.emit();
			// 通知本房间内的所有人
			io.in(_rid).emit('system',{action:'join',users:userList[_rid],act_username:nickname});	
			console.info('Room_'+roomId+' userList:');
			console.log(userList);	
			//console.log(socket.request); // 这里可以获取 header ，cookie 信息
		}
	});

	//断开连接的事件
	socket.on('disconnect', function() {
		if(!socket.roomId)
			return; // 用户并未登陆，刷新页面
	    //将断开连接的用户从users中删除
	    userList[socket.roomId].splice(socket.userIndex, 1);
	    //通知除自己以外的所有人
	    //socket.broadcast.emit('system', {action:'exit',users:userList,act_username:socket.username});
	    socket.to(socket.roomId).emit('system', {action:'exit',users:userList[socket.roomId],act_username:socket.username});
	    
	    //console.log('disconnect',socket);
	    console.info('Current userList:');
		console.log(userList);
	});

	//接收用户发来的图片
	 socket.on('img', function(imgData) {
	    //通过一个newImg事件分发到除自己外的每个用户
	     //socket.broadcast.emit('newImg', socket.username, imgData);
	     socket.to(socket.roomId).emit('newImg', socket.username, imgData);
	 });

	 /**********------test redis notify-------
	  * 这里是充当客户端订阅者的角色，	
	  *	publish 的角色可以是php后台服务器手动触发，比如发布公告等
      * TODO: pub 也可以是从前端发送过来的命令，
      *		  比如在同一个频道/room 中订阅同一个频道即可
      *
      ***********************************/
/*
     try{
		 var redis = require('redis').createClient(6379,'127.0.0.1');
		 redis.subscribe('channel_1');
		 redis.on('message',function(channel,msg){
		 	console.log('channel:'+ channel,' message: ' + msg);
		 	socket.emit('notify',msg);
		 });
	}catch(e){
		console.log('redis error: ',e);
	}	 
*/

	/********************test2: 发送消息给指定的用户，需要知道对方的socket_id**********************/
	 socket.on('say-to-someone', function(socket_id, msg){
	 	console.log('say-to-someone | socket_id: ',id,' message: ',msg);
    	socket.broadcast.to(id).emit('my-message', msg);
  	});

	/********************test3: get data from client::send()******************************/ 
	socket.on('message',function(data){
		console.log(data);
	});
	socket.on('test-fn',function(name,fn){
		console.log('use a function from client,it will run at client');
		fn('my-flag-server');
	});
});


