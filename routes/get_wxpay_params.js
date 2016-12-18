var express = require('express');
var router = express.Router();

var utils = require("../common/utils").utils;
var CONFIG = require("../config").CONFIG;
var request = require('request');

router.post('/', function(req, res, next) {

  //获取客户端 ip
  var localIP = req.connection.remoteAddress;
  if(localIP.includes(":")){
    localIP = localIP.substr(localIP.lastIndexOf(":")+1,localIP.length);
  }
  if(!localIP||localIP.length<7){
    localIP = "127.0.0.1";
  }

  //支付参数
  var params = {};
  params.appid = CONFIG.WxAppId;
  params.mch_id = CONFIG.WxMchId;
  params.nonce_str =  utils.getOutTradeNo();
  params.body =  "测试支付-0.01元";
  params.out_trade_no = utils.getOutTradeNo();
  params.total_fee =  "1";
  params.spbill_create_ip =  localIP+"";
  params.notify_url =  CONFIG.WxNotifyUrl;
  params.trade_type =  "APP";

  params.sign = utils.signWxParams(params,CONFIG.WxApiKey);

  var xml = utils.objectToXml(params);

  //POST请求获取prepay_id
  request({
    url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
    method: 'POST',
    body:xml
  }, function(err, response, body){
    console.log(body.toString());
    utils.xmlToObject(body,function (error, result) {
      console.log("result : "+JSON.stringify(result));
      var prepayResult = {};
      prepayResult.appid			= result['appid'];
      prepayResult.partnerid		= result['mch_id'];
      prepayResult.prepayid		= result['prepay_id'];
      prepayResult.noncestr		= result['nonce_str'];
      prepayResult.timestamp		= new Date().getTime()+"";
      prepayResult.package	= "Sign=WXPay";

      prepayResult.sign = utils.signWxParams(prepayResult);
      prepayResult.packagevalue = "Sign=WXPay";
      res.end(JSON.stringify(prepayResult));
    });
  });

});

module.exports = router;
