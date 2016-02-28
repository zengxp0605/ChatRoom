
var redis = require('redis').createClient(6379,'127.0.0.1');


var sub = function(c){

	var c = c || 'first';
	redis.subscribe(c,function(e){
		console.log('starting sub channel: ' + c);
	});
}
sub();

redis.on('message',function(err,res){

	console.log('response: ' + res);
});
