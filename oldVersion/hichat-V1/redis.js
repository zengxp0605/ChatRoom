
var redis = require('redis').createClient(6379,'127.0.0.1');


redis.set('aaa',111111);

redis.get('aaa',function(err,reply){
	console.log(reply);
});

redis.publish('first','first channel 1----');
redis.publish('second','second channel 2#####');


redis.info(function(err,response){
	//console.log(err,response);
});