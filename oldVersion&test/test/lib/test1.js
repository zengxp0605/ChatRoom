

var fn = function (){
	return {
		pro:'pro-1',
		showMsg:function(){
			console.log('Message from test1 showMsg()');
		}
	};
}


module.exports = fn;

console.log('test1 init');