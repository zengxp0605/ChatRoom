
/************************
测试引入其他模块的写法

*********************/

var t1 = require('./lib/test1')();

t1.showMsg();

var t2 = require('./lib/test2');

t2.showMsg();


console.log('index init',t1,t2);

global.a = null;

require('./lib/test3')

console.log(a);

