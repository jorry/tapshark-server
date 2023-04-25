/**
 * Created by iqianjin-liujiawei on 17/6/6.
 */

/**
 * https://github.com/caolan/nodeunit
 *
 * npm install nodeunit -g
 *
 *  nodeunit UnitTest.js
 * @param test
 */
exports.testIndexOf = function(test){
    var appServerTimeConfig = new Object();
    appServerTimeConfig.switch = 1;
    appServerTimeConfig.time = 1000;
    test.equals(appServerTimeConfig.switch,1);


    var a = new Array();
    var b = new Array();
    b.push(1);
    b.push(2);

    Array.prototype.push.apply(a, b);

    test.equals(a.length,2);


    test.done();

};

//
//exports.testNullInfo = function(test){
//    var appServerTimeConfig = new Object();
//    var o = new Object();
//    o.appServerTimeConfig = appServerTimeConfig;
//
//    test.equals(JSON.stringify(o),1);
//
//    test.done();
//
//};



exports.testCheckErrorCountIsOne = function(test){

    test.equals(checkThreshold(1),true);
    test.done();
};

exports.testDefaultValue = function(test){

    test.equals(checkDefaultValue(3),801);
    test.equals(checkDefaultValue(4),400);

    test.done();
};

function checkDefaultValue(type){
    var code;
    if (type === 3){
        code = 801;
    }else{
        code = 400;
    }
    return code;
}

exports.testCheckErrorCountIsFive = function(test){

    test.equals(checkThreshold(5),true);
    test.done();
};

exports.testCheckErrorCountIsTen = function(test){

    test.equals(checkThreshold(10),true);
    test.done();
};

exports.testCheckErrorCountIsFiveten= function(test){

    test.equals(checkThreshold(50),true);
    test.done();
}

exports.testCheckErrorCountIsFiveten= function(test){

    test.equals(checkThreshold(51),false);
    test.done();
}

exports.tesReplace_1= function(test){

    test.equals(regExpForAndroid('6.0.3'),603);
    test.done();
}

exports.tesReplace_1= function(test){

    test.equals(checkSameDay(1,1,2,2),true);
    test.done();
}

exports.test_CheckSameDay_1 = function(test){

    test.equals(checkSameDay(1,1,2,2),true);
    test.done();
}

exports.test_CheckSameDay_2 = function(test){

    test.equals(checkSameDay(1,1,1,1),true);
    test.done();
}

exports.test_CheckSameDay_3 = function(test){

    test.equals(checkSameDay(1,2,1,1),false);
    test.done();
}

exports.test_CheckSameDay_3 = function(test){

    test.equals(checkSameDay(1,1,1,2),false);
    test.done();
}

function checkSameDay(date,dbNewTime,appVersion,dbVersion) {
    return date === dbNewTime && appVersion === dbVersion;
}

var maxErrorCount_of_five_minute = 10;
var maxErrorCount_of_twenty_minute = 20;

exports.test_inFiveMinite_five_1 = function(test){

    test.equals(inFiveMinite(2,10),true);
    test.done();
}

exports.test_inFiveMinite_five_2 = function(test){

    test.equals(inFiveMinite(5,6),false);
    test.done();
}

exports.test_inFiveMinite_five_3 = function(test){

    test.equals(inFiveMinite(5,10),true);
    test.done();
}


exports.test_inFiveMinite_ten_1 = function(test){

    test.equals(inFiveMinite(10,10),false);
    test.done();
}

exports.test_inFiveMinite_ten_2 = function(test){

    test.equals(inFiveMinite(10,20),true);
    test.done();
}

exports.test_inFiveMinite_ten_3 = function(test){

    test.equals(inFiveMinite(10,21),false);
    test.done();
}


function inFiveMinite(minute,count) {

    if (minute <= 5 && count === maxErrorCount_of_five_minute){
        return true;
    }

    if (minute <= 10 && count === maxErrorCount_of_twenty_minute){
        return true;
    }
    return false;
}


exports.test_checkThreshold_10 = function(test){

    test.equals(checkThreshold(10),true);
    test.done();
}

exports.test_checkThreshold_50 = function(test){

    test.equals(checkThreshold(50),true);
    test.done();
}


exports.test_checkThreshold_11 = function(test){

    test.equals(checkThreshold(11),false);
    test.done();
}

function checkThreshold(errorCount) {
    if (errorCount === 10) {
        return true;
    } else if (errorCount === 50) {
        return true;
    }
    return false;
}


exports.tesReplace_1= function(test){

    test.equals(regExpForAndroid('6.0.3'),603);
    test.done();
}

function regExpForAndroid(error) {

    console.log(error.replace(/\./g, ''));
    return error.replace(/\./g, '');

}


function checkThreshold(test){
    const expirationTimeA = new Date(Date.now() + 60 * 60 * 1000); // 过期时间为当前时间后一小时
    const expirationTimeB = new Date(Date.now() + 60 * 60 * 1000); // 过期时间为当前时间后一小时
   test.equals(expirationTimeA > expirationTimeB)
}
