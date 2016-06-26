/**
 * Tools
 * @Author: Jason Zeng
 * @Email:  xiaoping_zeng@faxmail.com
 * @Date:   2016-3-6
 */
 'use strict';

// 测试 class 的写法
// 无法在外部文件直接引入后 new ClassName 操作???

exports.time = () => {
    let d = new Date();
    return d.toLocaleString() + ' ' + d.getMilliseconds();
}

/**
 * 推送当前用户的消息
 * @param  {[type]}   flag [description]
 * @param  {[type]}   data [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
exports.emit = (socket,data,cb) => {
    socket.emit('router',data);
    if(cb) cb();
}


 //    class Tools {
 //        time(){
 //            let d = new Date();
 //            return d.toLocaleString() + ' ' + d.getMilliseconds();
 //        }
 //    }


exports.isHook = (cb) => {
    var hookFile = __dirname + '/../../ctrl/hook.js';
    require('fs').exists(hookFile, (flag) => {
        if(flag){
            cb(require(hookFile));
        } else {
            cb(false);
        }
    });
};

 