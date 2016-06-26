/**
 * test
 * @Author: Jason Zeng
 * @Email:  xiaoping_zeng@faxmail.com
 * @Date:   2016-3-15
 */
'use strict';
var notify = require('./libs/notify');
var constants = require('./libs/constants');

console.log(11111);

exports.ter = (a) => {

    console.log(222222);
    
}

exports.test = (params, socket) => {
    console.log('test.test:' , params);
    notify.emit(socket, {
        cmd: 'test.test',
        code: constants.SUEECEE_CODE,
        rep: {
            msg: 'ok...',
        }
    });
    
}


