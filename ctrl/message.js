'use strict';
var message = exports;
var common = require('./libs/common');
var constants = require('./libs/constants');
var push = require('./libs/push');
var notify = require('./libs/notify');

message.send = (params, socket) => {

    var roomId = params.roomId;
    if(!roomId){
        return push.error('ROOM_ID_NOT_EXISTS', 'message.send', socket);
    }

    notify.notify('r' + roomId, {
        cmd: 'message.send',
        code: constants.SUEECEE_CODE,
        rep: {
            userName: params.userName,
            msg: params.msg,
            color: params.color,
            roomId: roomId,
        }
    });
};