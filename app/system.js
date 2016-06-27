'use strict';
var system = exports;
var common = require('./libs/common');
var constants = require('./libs/constants');
var push = require('./libs/push');
var notify = require('./libs/notify');

system.login = (params, socket) => {

    let roomId = params.roomId || 1;
    let userName = params.userName;
    let userList = app.userList;

    var _rid = 'r' + roomId;
    if('undefined' == (typeof userList[_rid])){
        userList[_rid] = {};
    }

    if(userList[_rid][userName]){
        return push.error('NICKNAME_EXISTS', 'system.login', socket);
    }

    userList[_rid][userName] = {sid: socket.id}; // { 用户名: {sid: socketID} }
    app.socketList[socket.id] = {uname: userName, rid: _rid};

    // 加入房间频道
    socket.join(_rid);

    notify.notify(_rid, {
        cmd: 'system.login',
        code: constants.SUEECEE_CODE,
        rep: {
            userName: userName,
            //socketId: socket.id,
            roomId: roomId,
            users: userList[_rid],
        }
    });

    // 通知本房间内的所有人
    // notify.broadcast(socket, {
    //     cmd: 'system.login',
    //     code: constants.SUEECEE_CODE,
    //     rep: {
    //         users: userList[_rid],
    //         userName: userName
    //     }
    // });  

    console.log(app.userList, app.socketList);  
    //console.log(socket.request); // 这里可以获取 header ，cookie 信息

};

