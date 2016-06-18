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

var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var userList = []; // 在线用户昵称列表

app.use('/',express.static(__dirname + '/www')); //指定静态资源目录
server.listen(80);
console.log('server started. listening on port 80' );

//require('./server/booter');

// io.sockets.on('connection',function(socket){
io.on('connection',function(socket){
	console.log('io connection [ok]');
	socket.on('sendMsg',function(msg,color){
		console.log('sendMsg from: ',socket.username,'| message: ',msg);
		 //通知除自己以外的所有人
	    socket.broadcast.emit('newMsg',socket.username,msg,color)
	});

	//注册昵称
	socket.on('login',function(nickname){
		if(userList.indexOf(nickname) > -1){
			socket.emit('nickExisted',{test:'ttt'});
			return;
		}else{
			socket.userIndex = userList.length;
			socket.username = nickname;
			userList.push(nickname);
			socket.emit('loginSuccess',socket.userIndex);
			io.sockets.emit('system',{action:'join',users:userList,act_username:nickname});	
			console.info('Current userList:');
			console.log(userList);	
		}
	});

	//断开连接的事件
	socket.on('disconnect', function() {
		if(!socket.username)
			return; // 用户并未登陆，刷新页面
	    //将断开连接的用户从users中删除
	    userList.splice(socket.userIndex, 1);
	    //通知除自己以外的所有人
	    socket.broadcast.emit('system', {action:'exit',users:userList,act_username:socket.username});
	    //console.log('disconnect',socket);
	    console.info('Current userList:');
		console.log(userList);
	});

	//接收用户发来的图片
	 socket.on('img', function(imgData) {
	    //通过一个newImg事件分发到除自己外的每个用户
	     socket.broadcast.emit('newImg', socket.username, imgData);
	 });

	 /**********------test redis notify-------
	  * 这里是充当客户端订阅者的角色，	
	  *	publish 的角色可以是php后台服务器手动触发，比如发布公告等
      * TODO: pub 也可以是从前端发送过来的命令，
      *		  比如在同一个频道/room 中订阅同一个频道即可
      *
      ***********************************/
	 var redis = require('redis').createClient(6379,'127.0.0.1');
	 redis.subscribe('channel_1');
	 redis.on('message',function(channel,msg){
	 	console.log('channel:'+ channel,' message: ' + msg);
	 	socket.emit('notify',msg);
	 });

});


