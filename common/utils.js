"use strict";

var crypto = require("crypto");
var xml2js = require('xml2js');

var utils = {};

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

utils.getOutTradeNo = function () {
    return new Date().format("MMddhhmmss")+Math.random().toString().substr(2,8);
};

utils.signAlipayParamsStr = function (alpayParams,privatePemStr) {
    var keys = Object.keys(alpayParams).sort();
    var prestr = [];
    keys.forEach(function (e) {
        if (e !='sign') {
            prestr.push(e+'="'+alpayParams[e]+'"');
        }
    });
    prestr = prestr.join('&');

    var signer=crypto.createSign("RSA-SHA1");
    signer.update(prestr);
    var sign=signer.sign(privatePemStr,"base64");
    var encodedSign = encodeURIComponent(sign);
    return prestr+'&sign="'+encodedSign+'"&sign_type="RSA"';
};

utils.signWxParams = function (params,apiKey) {
    var keys = Object.keys(params).sort();
    var prestr = [];
    keys.forEach(function (e) {
        if (e !='sign') {
            prestr.push(e+'='+params[e]);
        }
    });
    prestr = prestr.join('&');
    prestr = prestr+"&key="+apiKey;
    return crypto.createHash('md5').update(prestr).digest('hex').toUpperCase();
};

utils.objectToXml = function (object) {
    var builder = new xml2js.Builder({rootName:"xml",cdata:true});
    return builder.buildObject(object);
}

utils.xmlToObject = function(xml, fn){
    var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
    parser.parseString(xml, fn||function(err, result){});
};

utils.verifyAlipayCallback = function (body,alipayPublicKey) {
    try {
        var keys = Object.keys(body).sort();
        var prestr = [];
        keys.forEach(function (e) {
            if (e !='sign' && e !='sign_type') {
                prestr.push(e+'='+body[e]);
            }
        });
        prestr = prestr.join('&');
        prestr = new Buffer(prestr);
        var sign = new Buffer(body['sign'],'base64');
        return crypto.createVerify('RSA-SHA1').update(prestr).verify(alipayPublicKey, body['sign'],'base64');
    }catch (error){
        console.error(error);
        return false;
    }

};


exports.utils = utils;


