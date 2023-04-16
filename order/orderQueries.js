const db = require("../db/conn");

exports.createOrder = (data,id, callback) => {
  let ts = Date.now();
let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1; 
  let year = date_ob.getFullYear();
  let today = year + "-" + month + "-" + date 
  db.query(
    `INSERT INTO ORDERS (ORDER_ID, PRODUCT_ID, SUPPLIER_ID, DATE, QUANTITY, USER_ID) values (?,?,?,?,?,?)`,
    [
      data.ORDER_ID,
      data.PRODUCT_ID,
      data.SUPPLIER_ID,
      today,
      data.QUANTITY,
      id
    ],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.getOrders = (id,callback) => {
    db.query(`SELECT O.ORDER_ID, P.PRODUCT_NAME, S.NAME,O.DATE,O.DATE_RECEIVED, O.QUANTITY, O.STATUS
    FROM ORDERS AS O 
    JOIN PRODUCT AS P ON O.PRODUCT_ID=P.PRODUCT_ID 
    JOIN SUPPLIER AS S ON O.SUPPLIER_ID = S.SUPPLIER_ID where O.USER_ID=?`, [id], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  };