'use strict';
var notify = exports;

// 推送自己
notify.emit = (socket, data) => {
    socket.emit('router', data);
};

// 推送除自己外的用户
notify.broadcast = (socket, data) => {
    socket.broadcast.emit('router', data);
};

// 推送房间
notify.notify = (rid, data) => {
    app.io.in(rid).emit('router', data);
    // socket.to(socket.roomId).emit('newMsg',socket.username,msg,color);
};

// 推送所有用户
notify.all = (data) => {
    app.io.sockets.emit('router', data);
};

