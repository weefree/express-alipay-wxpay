/**
 * Created by weefree on 2016/12/18.
 */
"use strict";

var config = {

     //支付宝
     AlipayPartner : "2088XXXXXXXXXXXXXX" //支付宝partner id
    ,AlipaySellerId : "XXXXXXX@XX.com"  //支付宝seller id
    ,AlipayNotifyUrl : "http://host/alipay_callback"  //支付宝回调地址
    ,AlipayPublicKeyPath : "./pem/alipay_public_key.pem"  //支付宝公钥
    ,MyPrivateKeyPath : "./pem/my_private_key.pem"  //用户私钥
    ,MyPublicKeyPath : "./pem/my_public_key.pem"  //用户公钥

    //微信
    ,WxAppId : "wxXXXXXXXXXXXXXX" //微信支付 appid
    ,WxApiKey : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX" //apikey
    ,WxMchId : "XXXXXXXXX"  //商户id
    ,WxNotifyUrl : "http://host/wxpay_callback"  //微信回调地址

}

exports.CONFIG = config;