
var client = require('redis').createClient(6379,'127.0.0.1',{
    retry_max_delay:10,
    connect_timeout:2000,
});

client.on('reconnecting', ()=>{
    console.log('reconnecting');
});

client.on('ready', ()=>{
    console.log('ready');
});
client.on('connect', ()=>{
    console.log('connect');
});

client.on('error', (err)=>{
    console.log('error',err);
});

client.set('aaa',111111);

client.get('aaa',function(err,reply){
	console.log(reply);
});

client.publish('first','first channel 1----');
client.publish('second','second channel 2#####');



client.info(function(err,response){
	//console.log(err,response);
});