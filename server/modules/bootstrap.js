/**
 * bootstrap.js
 * @Author: Jason Zeng
 * @Email:  xiaoping_zeng@faxmail.com
 * @Date:   2016-3-6
 */

 'use strict';

 let init = () => {
    app.logger.info('bootstrap [ok]');
    let server = require('http').Server(app);
    app.setting = require('../config/server.json');
    
    app.io = require('socket.io').listen(server);

    let port = process.env.PORT || app.setting.port;

    server.listen(port,function(){
     app.logger.info('server started. listening on port *' + port );
    });

    if(app.setting.need_redis){
        _connRedis(app.setting.redis,() => {
            // 依赖redis 的应用,则必须等redis 连接success 才启动路由
            require('./router')();
        });
    }else{
        // 启动路由
        require('./router')();
    }

}

var reConnInterval,reConnCount = 0,flag = 0;

let _connRedis = (redisUrl,success) => {
    let opts = {
        retry_max_delay:100,
        connect_timeout:2000,
   }
   var client = require('ioredis').createClient(redisUrl,opts);

    client.on('error',(err) => {
        if(err.code === 'CONNECTION_BROKEN' && flag === 0){
            flag = 1;
            // 连接超时自动重连redis
            reConnInterval = setInterval( () => {
                reConnCount ++;
                app.logger.info('tring connet redis ' + reConnCount);
                if(reConnCount >= opts.retry_max_delay)
                    clearInterval(reConnInterval); 
                _connRedis(redisUrl,success);
            },2000); 
        }
    });

    client.on('connect',() => {
        clearInterval(reConnInterval);
        app.logger.info('redis load [ok]');
        app.redis = client;
        if(success)  success();
    });
}


module.exports = init;