var alertMessage = {

    email_1:'please input your email',//   请输入 邮件
    email_2:'Please include @ in your email',// 请输入 邮件中包含@
    password:'please input your password',// 请输入密码
    login_call_back: "Email doesn't exist or Incorrect password",// 邮件不存在或者密码错误
    name:'please enter user name',   //请输入用户名
    register_call_back_1: "The password confirmation does not match.",//   密码不匹配
    register_call_back_2: "The password must be at least 8 characters.",//  密码至少8位
    register_call_back_3: "The email has already been taken.",//  邮件已经存在
    register_call_back_4: "registration success",//  注册成功

    password_rest: "Email sent! It could take up to 1 minute to arrive.",// 邮件已经发送，大约1分钟到达
    password_reset_ssc : "Password reset successful",    //重置成功

    buyRechargeCodeIsHave : "buy 0",
    
    Invalid_discount_code : "Invalid discount code",  // 折扣码不存在
    invalid_card : "invalid card",                    // 卡无效
    public_server_error : "server error!!!",          //服务器错误
    public_server_error_code : 0,

    NFC_no_register:"Please first register",   //请先注册
    NFC_no_register_code:8,  
    NFC_empty_card:"Fill in personal information.",  // 填写个人信息
    NFC_empty_card_code:9,
    NFC_display_card:"Display personal information.",  // 展示个人信息
    NFC_display_card_code:10,

    token_has_expired:"token has expired",   //令牌过期

    Email_not_exist: "Email doesn't exist",// 邮件不存在
    password_empty:'please enter password name',   //请输入密码
    upload_error: '上传失败',
    upload_ok: '上传成功',
    Not_enough_cards_left:'Not enough cards left',
    submit:'提交成功'
       
}

module.exports = alertMessage;