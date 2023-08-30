var alertMessage = {

    email_1:'Please input your email',//   请输入 邮件
    email_2:'Please include @ in your email',// 请输入 邮件中包含@
    password:'Please input your password',// 请输入密码
    login_call_back: "Email does not exist or Incorrect password",// 邮件不存在或者密码错误
    name:'Please enter user name',   //请输入用户名
    register_call_back_1: "The password confirmation does not match.",//   密码不匹配
    register_call_back_2: "The password must be at least 8 characters.",//  密码至少8位
    register_call_back_3: "The email has already been taken.",//  邮件已经存在
    register_call_back_4: "Registration Successful",//  注册成功
    password_rest: "Email sent! It could take up to 5 minute to arrive.",// 邮件已经发送，大约5分钟到达
    password_reset_ssc : "Password Reset Successful",    //重置成功
    buyRechargeCodeIsHave : "Buy 0",
    Invalid_discount_code : "Invalid Discount Code",  // 折扣码不存在
    invalid_card : "Invalid Card",                    // 卡无效
    public_server_error : "Server Error!!!",          //服务器错误
    public_server_error_code : 0,
    NFC_no_register:"Please first register",   //请先注册
    NFC_no_register_code:8,  
    NFC_empty_card:"Fill in personal information.",  // 填写个人信息
    NFC_empty_card_code:9,
    NFC_display_card:"Display personal information.",  // 展示个人信息
    NFC_display_card_code:10,
    token_has_expired:"Token has expired",   //令牌过期
    Email_not_exist: "Email doesn't exist",// 邮件不存在
    password_empty: "Please enter password",   //请输入密码
    upload_error: "Upload Error", //上传失败,
    upload_ok: "Upload Successful", //上传成功,
    Not_enough_cards_left:'Not enough cards left',
    submit: "Success", // '提交成功',
    db_error: "Database Error", //数据库错误,
    id_no_find: "User ID Invalid", //用户id没有在管理系统找到,
    waitting: "Please Try Again Later", //稍后重试
       
}

module.exports = alertMessage;