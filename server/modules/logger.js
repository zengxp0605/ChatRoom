/**
 * logger
 * @Author: Jason Zeng
 * @Email:  xiaoping_zeng@faxmail.com
 * @Date:   2016-3-6
 */
 'use strict';
var Tools =  require('./tools.js');

 exports.log = function(){
    for(let i in arguments){
        console.log(Tools.time() ,'logger::log => ',arguments[i]);
    }
}

exports.info = function(){
    for(let i in arguments){
        console.log(Tools.time() ,'logger::info => ',arguments[i]);
    }
}

exports.error = function(){
    for(let i in arguments){
        console.log(Tools.time() ,'logger::error => ',arguments[i]);
    }
}

exports.debug = function(){
    for(let i in arguments){
        console.log(Tools.time() ,'logger::debug => ',arguments[i]);
    }
}