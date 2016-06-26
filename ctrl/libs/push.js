'use strict';
var push = exports;
var notify = require('./notify');

const errorMsg = {
    'MSG_UNDEFINED' : ['3000', '错误消息未定义'],
    'NICKNAME_EXISTS': ['3001', '用户名已经存在'],


};

push.error = (errorKey, cmd, socket) => {
    if(!errorMsg[errorKey]){
        errorKey = 'MSG_UNDEFINED';
    }
    let res = {
        cmd: cmd,
        code: errorMsg[errorKey][0],
        msg: errorMsg[errorKey][1]
    };
    notify.emit(socket, res);

    app.logger.log('{push.error},推送: ' + JSON.stringify(res) );
};


