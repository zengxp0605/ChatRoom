
        var _$ = function(_id){
            return document.getElementById(_id);
        };
        !function($){
            var socket = io.connect();
            // 注册唯一的昵称，进入聊天室
            $('loginBtn').onclick = function(){
                var _nickname = $('nicknameInput').value;
                if(_nickname.trim().length > 0){
                    socket.emit('login',_nickname);
                }else{
                    $('nicknameInput').focus();
                }
            }

            // 发送消息
            $('sendBtn').onclick = function(){
                 var messageInput = document.getElementById('messageInput'),
                    msg = messageInput.value,
                    //获取颜色值
                    color = document.getElementById('colorStyle').value;
                messageInput.value = '';
                messageInput.focus();
                if (msg.trim().length != 0) {
                    //显示和发送时带上颜色值参数
                    socket.emit('sendMsg', msg, color);
                    displayNewMsg('me', msg, color);
                };
            }
            // 监听事件
            socket.on('connect',function(data){
                // 连接成功后自动触发的事件
                console.info('connect',data);
                $('info').textContent = 'get yourself a nickname :)';
                $('nickWrapper').style.display = 'block';
                $('nicknameInput').focus();
            });
            socket.on('nickExisted',function(data){
                console.info('nickExisted',data);
                // 昵称已存在
                $('info').textContent = 'Sorry,nickname is taken,pls choose another one';
            });
            socket.on('loginSuccess',function(data){
                console.info('login success ',data);
                document.title = 'Hichat-' + $('nicknameInput').value;
                $('loginWrapper').style.display = 'none'; // 隐藏遮罩层
                $('messageInput').focus();
            });
            socket.on('newMsg',function(username,msg,color){
                // 显示其他用户发出的消息
                displayNewMsg(username,msg,color);
            });
            socket.on('system',function(data){
                console.info('system',data);
                if(data){
                    var _userStr = 'Users: ';
                    for(var i in data.users){
                        _userStr += '<i>'+ data.users[i] +'</i>';
                    }
                    $('users').innerHTML = _userStr;
                    $('online').textContent = 'Online: ' + data.users.length;
                    //提示加入，退出用户等
                    var _msg = data.act_username;
                    if(data.action =='join'){
                        _msg += ' joined';
                    }else{
                        _msg += ' left';
                    }
                    
                    displayNewMsg('system',_msg,'red');
                }
            });
            var displayNewMsg = function(user, msg, color) {
                    var container = document.getElementById('historyMsg'),
                        msgToDisplay = document.createElement('p'),
                        date = new Date().toTimeString().substr(0, 8);
                    msgToDisplay.style.color = color || '#000';
                    if(user =='me'){ // 自己的消息加上背景颜色
                        msgToDisplay.style.backgroundColor = 'gray';
                    }
                    msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
                    container.appendChild(msgToDisplay);
                    container.scrollTop = container.scrollHeight;
                }
            var displayImage = function(user, imgData, color) {
                    var container = document.getElementById('historyMsg'),
                        msgToDisplay = document.createElement('p'),
                        date = new Date().toTimeString().substr(0, 8);
                    msgToDisplay.style.color = color || '#000';
                    msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
                    container.appendChild(msgToDisplay);
                    container.scrollTop = container.scrollHeight;
                }    

            // 上传图片
            document.getElementById('sendImage').addEventListener('change', function() {
                //检查是否有文件被选中
                 if (this.files.length != 0) {
                    //获取文件并用FileReader进行读取
                     var file = this.files[0],
                         reader = new FileReader();
                     if (!reader) {
                         displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                         this.value = '';
                         return;
                     };
                     reader.onload = function(e) {
                        //读取成功，显示到页面并发送到服务器
                         this.value = '';
                         socket.emit('img', e.target.result);
                         displayImage('me', e.target.result);
                     };
                     reader.readAsDataURL(file);
                 };
             }, false);    
            socket.on('newImg', function(username, img) {
                 displayImage(username, img);
             });
		 /**********------test notify-------**********/
		 socket.on('notify',function(msg){
		 	console.info('notify: ',msg);
		 });

        }(window._$);