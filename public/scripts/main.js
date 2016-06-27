var _$ = function(_id) {
    return document.getElementById(_id);
};
var App = window.App || {};

App.router = {};
App.cmd = {};
App.self = {};
App.socket = null;

!function($, App) {
    try{
        var socket = io.connect();
        App.socket = socket;
        
    } catch(e){
        console.error(e);
        return;
    }



    // 监听事件
    socket.on('connect', (data) => {
        // 连接成功后自动触发的事件
        console.info('connect', data);
        $('info').textContent = 'get yourself a nickname :)';
        $('nickWrapper').style.display = 'block';
        $('nicknameInput').focus();

        socket.on('router', (data) => {
            console.log('--------', data);
            App.dispatch(data);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('reconnect', function(){
            console.log('reconnect');
        });

        socket.on('reconnecting', function(){
            console.log('reconnecting...');
        });

        socket.on('close', function(){
            console.log('close...');
        });

        socket.on('error', function(error){
            console.log('error: ', error);
        });
    });

    // 路由
    App.dispatch = function(data){
        console.info('{App.dispatch}', data);
        if(typeof data === 'string'){
            data = JSON.parse(data);
        }

        if(!data.cmd){
            if(typeof data.code !== 'undefined'){
                console.error('Code:'  + data.code + '  Error: ' + data.msg);
                return;
            } else {
                console.error('缺少cmd');
                return;
            }
        }

        if(data.code != '200'){
            if(typeof data.code !== 'undefined'){
                console.error('Code:'  + data.code + '  Error: ' + data.msg);
                return;
            } else {
                console.error('Error: ', data);
                return;
            }
        }

        let aryCmd = data.cmd.split('.');
        console.log(aryCmd);
        try{
            let module = aryCmd[0];
            let act = aryCmd[1];
            if(!App.router[module] || typeof App.router[module][act] !== 'function'){
                console.error('模块或方法不存在');
                return;
            }
            App.router[module][act](data.rep || data); // 动态调用路由方法
        }catch(e){
            console.error(e);
            return;
        }
    };

    App.emit = function(res){
        res.params = res.params || {};
        res.params.roomId = App.self.roomId;
        res.params.userName = App.self.userName;

        App.socket.emit('router', res);
    };  

    App.router.test = {
        connect: (data) => console.log('测试1', data),
        connect2: (data) => console.log('测试2', data),
    };

    App.router.message = {
        send: data => displayNewMsg(data),
    };

    App.router.system = {
        login: (data) => {
            reloadUserList(data);
            if(data.userName == App.self.userName){
                document.title = 'Hichat-' + data.userName;
                $('messageInput').focus();

                $('loginWrapper').style.display = 'none'; // 隐藏遮罩层
            } else {  // 其他人进入
                //提示加入
                var _msg = data.userName + ' joined';
                displayNewMsg({
                    userName: data.userName,
                    msg: _msg,
                    color: 'red',
                });
            }
        },
        logout: (data) => {
            reloadUserList(data);
            //提示退出用户
            var _msg = data.userName + ' left';
            displayNewMsg({
                userName: data.userName,
                msg: _msg,
                color: 'red',
            });
        }
    };

    function reloadUserList (data){
        var _userStr = 'Users: ';
        var count = 0;
        for(var name in data.users){
            _userStr += '<i>'+ name +'</i>';
            count ++;
        }
        $('users').innerHTML = _userStr;
        $('online').textContent = 'Room_' + data.roomId + ' online: ' + count;
    }

    function displayNewMsg(data) {
        var userName = data.userName, 
            msg = data.msg, 
            color = data.color;
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);

        msgToDisplay.style.color = color || '#000';
        if(userName == App.self.userName){ // 自己的消息加上背景颜色
            msgToDisplay.style.backgroundColor = 'gray';
        }
        msgToDisplay.innerHTML = userName + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
} (window._$, window.App || {});


// 绑定事件
!function($, App){

    App.cmd = {
        login: 'system.login',
        sendMsg: 'message.send'
    };

    // 注册唯一的昵称，进入聊天室
    $('loginBtn').onclick = function() {
        let _nickname = $('nicknameInput').value;
        console.log(_nickname);
        if (_nickname.trim().length > 0) {
            App.self.roomId = $('room').value || 1;
            App.self.userName = _nickname;

            App.emit({
                cmd: App.cmd.login
            });
        } else {
            $('nicknameInput').focus();
        }
    };

    // 发送消息
    $('sendBtn').onclick = function() {
        var messageInput = document.getElementById('messageInput'),
        msg = messageInput.value,
        //获取颜色值
        color = document.getElementById('colorStyle').value;
        messageInput.value = '';
        messageInput.focus();
        if (msg.trim().length != 0) {
            //显示和发送时带上颜色值参数
            App.emit({
                cmd: App.cmd.sendMsg,
                params: {
                    msg: msg,
                    color: color,
                }
            });
        };
    };




}(window._$, window.App);


