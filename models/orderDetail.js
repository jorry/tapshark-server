var db = require('./dbhelper');
var dbv2 = require('./dbhelper_v2');
var messageModel = require('../config/message');
const { v4: uuidv4 } = require('uuid');
function orderDetailUtils() {
}

module.exports = orderDetailUtils;

function query(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (error, results) => {
            if (error) {
                db.rollback(() => {
                    db.release();
                    reject(error);
                });
            } else {
                resolve(results);
            }
        });
    });
}

orderDetailUtils.getCardDetailByOrderId = async function(order_id,callback){
    var descGetCardId = "select o.email,a.*,c.* from orders o Left join shipping_address a ON o.shipping_address_id = a.address_id Left join order_cards oc ON oc.order_id = o.order_id Left join cards c ON c.card_id = oc.card_id where o.order_id = '"+order_id+"';";
    query(descGetCardId)
        .then((results) => {
            return results;
        })
        .then((results) => {
            callback(20000, results);
        })
        .catch((error) => {
            callback(-1, null);
        });
}


orderDetailUtils.cardmanagerSelect = async function(callback){
    var descGetCardId = "SELECT email,created_at,card_count,status,order_id FROM orders ;";
    query(descGetCardId)
        .then((results) => {
            return results;
        })
        .then((results) => {
            callback(20000, results);
        })
        .catch((error) => {
            callback(-1, null);
        });
}

orderDetailUtils.PromiseUtil = async function (cards, orders, address, callback) {
//    // var checkDiscountCode = "select * from discountCode where email = '" + orders.email + "' and discountCode = '" + orders.payment_code + "' and buyCount = " + cards.buy_count + ";";
    await dbv2.executeTransaction(async (connection) => {
        console.log("-----connection--"+connection);
        if (connection == null){
            callback(-100,"稍后重试");
            return;
        }
        console.log('验证支付码:'+orders.email, orders.payment_code, cards.buy_count);
        //                                      '
        const [result] = await connection.query('select * from discountCode where email = ? AND discountCode = ? ', [orders.email, orders.payment_code]);
        const rowsResutlBuyCount = result[0].buyCount;
        if (result.length > 0 && result[0].status == 0 && rowsResutlBuyCount >= cards.buy_count) {
            console.log("支付码有效" + result[0])
            const [addressResult] = await connection.query('INSERT INTO shipping_address(first_name,last_name,company,full_address,address_line,city,state,zip_code,phone_number,vat,email,country) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                [address.first_name,
                    address.last_name,
                    address.company,
                    address.full_address,
                    address.address_line,
                    address.city,
                    address.state,
                    address.zip_code,
                    address.phone_number,
                    address.vat,
                    address.email,address.country]);

            const addressId = addressResult.insertId;
            orders.shipping_address_id = addressId;

            orders.order_id = uuidv4();
            const [orderQueryResult] = await connection.query('INSERT INTO orders (order_id,email,shipping_address_id,payment_code,card_count,status) VALUES(?,?,?,?,?,?)', [orders.order_id,orders.email,orders.shipping_address_id,
                orders.payment_code,cards.buy_count,'no']);
            const orderId = orderQueryResult.insertId;
            console.log("-----------------------------------------------------");
            console.log("插入 订单表:"+JSON.stringify(orderQueryResult))

            console.log("订单表 订单id:"+orders.order_id)
            console.log("-----------------------------------------------------");
            //--------------------------卡号
            const [cardResult, fields] = await connection.query('SELECT card_num FROM cards ORDER BY card_id DESC LIMIT 1');

            let card_n = 0;
            if (cardResult.length == 0) {
                card_n = 600000 + 1
            } else {
                card_n = cardResult[0].card_num + 1;
            }

            const usersArray = [];
            for (let i = 0; i < cards.buy_count; i++) {
                const company_logo = cards.company_logo;
                const card_name = cards.card_name;
                const small_logo = cards.small_logo;
                const qr_logo = cards.qr_logo;
                const card_material_url = cards.card_material_url;
                const card_num = ++card_n;
                const font_color = cards.font_color;
                const create_time = cards.creatTime;
                const email = cards.email;
                usersArray.push({company_logo, card_name, small_logo, qr_logo, card_material_url, card_num,font_color,create_time,email});
            }
            console.log("此订单几个卡"+usersArray.length)

            for (const cardS of usersArray) {
                const [result3] = await connection.query('INSERT INTO cards (company_logo,user_name,user_logo,qr_url,card_material_url,card_num,font_color,create_time,email) VALUES(?,?,?,?,?,?,?,?,?)',[ cardS.company_logo
                    ,cardS.card_name,cardS.small_logo,cardS.qr_logo,cardS.card_material_url,cardS.card_num,cardS.font_color,cardS.create_time,cardS.email]);


                console.log("----------------card-----------")
                console.log(cardS.company_logo)
                console.log(cardS.card_name)
                console.log(cardS.small_logo)
                console.log(cardS.qr_logo)
                console.log(cardS.card_material_url)
                console.log(cardS.card_num)
                console.log(cardS.font_color)
                console.log(cardS.email)

                console.log("----------------card---------end--")


                const cardId = result3.insertId;
                console.log("cardId = "+result3.insertId)
                // Associate card with order
                await connection.query('INSERT INTO order_cards (order_id, card_id) VALUES (?, ?)', [orders.order_id , result3.insertId]);
            }
            //订单提交后，重置支付码状态
            // await connection.query('UPDATE discountCode SET status = ? WHERE discountCode = ?', ['1',orders.payment_code]);
            
            if(rowsResutlBuyCount - cards.buy_count >= 1 ){
                console.log('--------减');
                await connection.query('UPDATE discountCode SET buyCount = ?  WHERE discountCode = ?', [rowsResutlBuyCount - cards.buy_count,orders.payment_code]);
            }else{
                console.log('-------重置1');
                await connection.query('UPDATE discountCode SET status = ? , buyCount = ? WHERE discountCode = ?', ['1',0,orders.payment_code]);
            }

            callback(1, messageModel.submit);
        } else {
            if (result.length > 0) {
                console.log("0 未使用，1 使用 = " + result[0].status)
                callback(-1, messageModel.Not_enough_cards_left);
            }else{
                console.log(result.length + "支付码无效")
                callback(-1, messageModel.Not_enough_cards_left);
            }

        }
    })

}
orderDetailUtils.insertOrder = function (email, card_template_id, card_name, card_quantity, unit_price, card_template_url, customized_card_url,
                                         order_date, purchase_code, callback) {

    // 使用Promise执行两个SQL语句
    var descGetCardId = "SELECT card_id FROM order_detail ORDER BY order_detail_id DESC LIMIT 1";
    query(descGetCardId)
        .then((results) => {
            var cardId = 60000000000 + 1;
            console.log("results" + results.length)
            if (results.length == 1) {
                cardId = results[0].card_id + 1;
            }
            var order_detail = "INSERT INTO order_detail SET " +
                "email='" + email + "' ,card_template_id='" + card_template_id + "', " +
                "card_name='" + card_name + "', card_quantity=" + card_quantity + "," +
                "card_template_url='" + card_template_url + "'," +
                "card_id='" + cardId + "', customized_card_url='" + customized_card_url + "'," +
                "purchase_code='" + purchase_code + "', order_date='" + order_date + "';";
            return query(order_detail);
        })
        .then((results) => {
            callback(1, null);
        })
        .catch((error) => {
            callback(-1, null);
        });
}


