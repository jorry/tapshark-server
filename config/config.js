
var devConfig = {
    //填写数据库连接信息，可查询数据库详情页
    username:'qiuge',//mysql数据库管理员
    password:'qqqqqq1.',//密码
    db_host:'54.95.234.204',//主机
    db_port: 3306,//端口
    db_name:'qiuge',//数据库名
    iOSMail: {
        from: {
            name: 'iQianjinIOS',
            service: 'owa.finupgroup.com',
            post: 587,
            auth: {
                user: 'jiangyu@iqianjin.com', //发送邮件邮箱
                pass: 'Jy13158008565'
            }
        },
        to: [
            'jiangyu@iqianjin.com'
        ],
        exceptionSendMailCount: 2, //每次发送崩溃邮件的条数
        exceptionSendMailTime: '',  //记录发送崩溃邮件的时间
        dnsSendMailCount: 2,
        dnsSendMailTime: ''
    },
    androidMail: {
        from: {
            name: 'iQianjinAndroid',
            service: 'owa.finupgroup.com',
            post: 587,
            auth: {
                user: 'jiangyu@iqianjin.com', //发送邮件邮箱
                pass: 'Jy13158008565'
            }
        },
        to: [
            //'shisongsong@iqianjin.com',
            //'hanlezi@iqianjin.com',
            //'hairenhang@iqianjin.com',
            'liujiawei@finupgroup.com'
            //'suzhaoqiang@iqianjin.com'
        ],
        exceptionSendMailCount: 10,
        exceptionSendMailTime: '',
        dnsSendMailCount: 100,
        dnsSendMailTime: ''
    }
}

var prodConfig = {
    //填写数据库连接信息，可查询数据库详情页
    username:'qiuge',//mysql数据库管理员
    password:'qqqqqq1.',//密码
    db_host:'f',//主机
    db_port: 3306,//端口
    db_name:'qiuge',//数据库名
    iOSMail: {
        from: {
            name: 'iQianjinIOS',
            service: 'owa.finupgroup.com',
            post: 587,
            auth: {
                user: 'jiangyu@iqianjin.com',
                pass: 'Jy13158008565'
            }
        },
        to: [
            'jiangyu@iqianjin.com',
            'wangyingjie@iqianjin.com',
            'yangzhaofeng@iqianjin.com',
            'jiakang@iqianjin.com',
            'kanghongpu@iqianjin.com'
        ],
        exceptionSendMailCount: 5,
        exceptionSendMailTime: '',
        dnsSendMailCount: 100,
        dnsSendMailTime: ''
    },
    androidMail: {
        from: {
            name: 'iQianjinAndroid',
            service: 'owa.finupgroup.com',
            post: 587,
            auth: {
                user: 'liujiawei@iqianjin.com', //发送邮件邮箱
                pass: 'qqqqqqq1.'
            }
        },
        to: [
            'shisongsong@iqianjin.com',
            'hanlezi@iqianjin.com',
            'hairenhang@iqianjin.com',
            'liujiawei@finupgroup.com',
            'suzhaoqiang@iqianjin.com'
        ],
        exceptionSendMailCount: 10,
        exceptionSendMailTime: '',
        dnsSendMailCount: 100,
        dnsSendMailTime: ''
    }
}


module.exports = prodConfig;
