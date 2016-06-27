'use strict';
var hook = exports;
var notify = require('./libs/notify');
var common = require('./libs/common');
var constants = require('./libs/constants');

console.log('load hook');

hook.disconnect = (socket) => {
    let sid = socket.id;
    let user = app.socketList[sid];
    let userName = '';
    if(user){
        userName = user.uname;
        let rid = user.rid;
        console.log(app.userList[rid] , app.userList[rid][userName]);
        if(app.userList[rid] && app.userList[rid][userName]){
            // 删除用户
            delete app.userList[rid][userName];   
            // 删除socket
            delete app.socketList[sid];

            notify.notify(rid, {
                cmd: 'system.logout',
                code: constants.SUEECEE_CODE,
                rep: {
                    userName: userName,
                    users: app.userList[rid],
                    roomId: rid.replace('r', ''),
                }
            });
            console.log('{hook.disconnect}', app.userList, app.socketList);
        }
    }
    console.log('{hook.disconnect},socketId: ' + sid + ',userName: ' + userName );
};