var express = require('express');
var router = express.Router();

var fs = require("fs");
var utils = require("../common/utils").utils;
var CONFIG = require("../config").CONFIG;

router.post('/', function(req, res, next) {

  if(!req.body||req.length==0){
    verifyResult(res,false);
    return;
  }
  var varifyRes = utils.verifyAlipayCallback(req.body,fs.readFileSync(CONFIG.AlipayPublicKeyPath).toString());
  if(varifyRes){
    //todo 验证成功，执行后续操作

    verifyResult(res,true);
  }else{
    verifyResult(res,false);
  }
});

var verifyResult = function (res,isSuccess) {
  if(isSuccess){
    res.end("success");
  }else{
    res.end("verify fail");
  }
}

module.exports = router;
