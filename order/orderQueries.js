const db = require("../db/conn");

exports.createOrder = (data, callback) => {
  db.query(
    `INSERT INTO ORDERS (ORDER_ID, PRODUCT_ID, SUPPLIER_ID, DATE, QUANTITY) values (?,?,?,?,?)`,
    [
      data.ORDER_ID,
      data.PRODUCT_ID,
      data.SUPPLIER_ID,
      data.DATE,
      data.QUANTITY,
    ],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.getOrders = (callback) => {
    db.query(`select * from ORDERS`, [], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  };