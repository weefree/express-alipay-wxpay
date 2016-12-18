"use strict";
var express = require('express');
var router = express.Router();

var fs = require("fs");
var utils = require("../common/utils").utils;
var CONFIG = require("../config").CONFIG;

router.get('/', function(req, res, next) {

  var subject = "测试商品-0.01";
  var body = "这是测试商品";
  var total_fee = "0.01";

  var params = {
    parter : CONFIG.WxApiKey,
    seller_id : CONFIG.AlipaySellerId,
    out_trade_no : utils.getOutTradeNo(),
    subject : subject,
    body : body,
    total_fee : total_fee,
    notify_url : CONFIG.AlipayNotifyUrl,
    service : "mobile.securitypay.pay",
    payment_type : "1",
    _input_charset : "utf-8",
    it_b_pay : "30m",
    return_url : "m.alipay.com"
};
  // var paramsStr = 'partner="'+CONFIG.AlipayPartner+'"&seller_id="'+CONFIG.AlipaySellerId+'"&out_trade_no="'+utils.getOutTradeNo()+'"&subject="'+subject+'"&body="'+body+'"&total_fee="'+total_fee+'"&notify_url="'+CONFIG.AlipayNotifyUrl+'"&service="mobile.securitypay.pay"&payment_type="1"&_input_charset="utf-8"&it_b_pay="30m"&return_url="m.alipay.com"';

  //参数签名
  var signedStr = utils.signAlipayParamsStr(params,fs.readFileSync(CONFIG.MyPrivateKeyPath).toString());

  var result = {};
  result.code = 0;
  result.data = signedStr;

  res.end(JSON.stringify(result));

});

module.exports = router;
