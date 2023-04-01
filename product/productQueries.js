const db = require("../db/conn");

module.exports = {
  createProduct: (data,id, callback) => {
    db.query(
      `insert into PRODUCT(PRODUCT_ID, PRODUCT_NAME, PRESENT_QUANTITY, MIN_QUANTITY, SUPPLIER_ID, SELLING_PRICE, USER_ID) values(?,?,?,?,?,?,?)`,
      [
        data.PRODUCT_ID,
        data.PRODUCT_NAME,
        data.PRESENT_QUANTITY,
        data.MIN_QUANTITY,
        data.SUPPLIER_ID,
        data.SELLING_PRICE,
        id
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getProducts: (id, callback) => {
    db.query(
      `select * from PRODUCT where USER_ID =?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  searchProduct: (name, callback) => {
    db.query(
      `select * from PRODUCT where product_name like '%${name}%'`,
      [name],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  updateProductByOrder: (data, callback) => {
    db.query(
      `UPDATE PRODUCT SET PRESENT_QUANTITY = PRESENT_QUANTITY+(SELECT o.QUANTITY FROM ORDERS as o where o.ORDER_ID=?) WHERE PRODUCT_ID=?`,
      [data.ORDER_ID, data.PRODUCT_ID],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
