/**
 * 路由
 * @Author: Jason Zeng
 * @Email:  xiaoping_zeng@faxmail.com
 * @Date:   2016-3-6
 */
'use strict';
var Tools = require('./tools');

module.exports = function(){
    app.logger.info('rotuer load [ok]');
    
    app.io.on('connect',(socket) => {
        app.logger.info('on connect [ok] ,socket.id = ' + socket.id);

        Tools.emit(socket,{
            cmd: 'test.connect', 
            code: 200,
            rep: {
                test: 'data',
                socket_id: socket.id
            }
        });

        socket.on('router',(data) => {
            app.logger.debug('router:',data);
            _dispatch(socket,data);
        });

        socket.on('disconnect', () => {
            app.logger.info('disconnect socket.id = ' + socket.id);
            Tools.isHook((hook) => {
                if(hook){
                    hook.disconnect(socket);
                }   
            });
        });

        
    });
}

let _dispatch = (socket,data) => {
    if('string' === typeof data){
        data = JSON.parse(data);
    }        
    if(!data.cmd){
        Tools.emit(socket,{code:1001,msg:'MISS_CMD'});
        return;
    } 
    let aryCmd = data.cmd.split('.');

    try{
        let _mod = require('../../ctrl/' + aryCmd[0]);
        _mod[aryCmd[1]](data.params, socket); // 动态调用路由方法
    }catch(e){
        app.logger.error(e);
        let rs = e.code == 'MODULE_NOT_FOUND' ? {code:1002,msg:'MODULE_NOT_FOUND'} : {code:1003,msg:'FUNCTION_NOT_FOUND'}
        Tools.emit(socket,rs);
        return;
    }
}

