var express = require('express');
var router = express.Router();

var getRawBody = require('raw-body');
var typer = require('media-typer');
var utils = require("../common/utils").utils;
var CONFIG = require("../config").CONFIG;


// router.get('/', function(req, res, next) {
//
// });

router.post('/', function(req, res, next) {

  if(!req||!req.headers['content-type']||!req.headers['content-type'].toString().toLowerCase().includes("xml")){
    verifyResult(res,false);
    return;
  }
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: typer.parse(req.headers['content-type']).parameters.charset
  }, function (err, xmlStr) {
    if (err) {
      console.error(err);
      verifyResult(res,false);
      return;
    }

    utils.xmlToObject(xmlStr,function (error, result) {
      if(error){
        console.error(err);
        verifyResult(res,false);
        return;
      }
      var queryData = "POST : "+JSON.stringify(result);
      console.log(queryData);
      if(utils.signWxParams(result,CONFIG.WxApiKey)==result['sign']){
          //todo 验证成功，执行后续操作

          verifyResult(res,true);
      }else {
        verifyResult(res,false);
      }

      },function (error) {
      verifyResult(res,false);
      });
  });

});

var verifyResult = function (res,isSuccess) {
  if(isSuccess){
    var result = {};
    result.return_code = "SUCCESS";
    result.return_msg = "OK";
    res.end(utils.objectToXml(result));
  }else{
    res.end("verify fail");
  }
}

module.exports = router;
