const db = require("../db/conn");

module.exports = {
  createProduct: (data, id, callback) => {
    db.query(
      `insert into PRODUCT(PRODUCT_ID, PRODUCT_NAME, PRESENT_QUANTITY, MIN_QUANTITY, SUPPLIER_ID, SELLING_PRICE, USER_ID) values(?,?,?,?,?,?,?)`,
      [
        data.PRODUCT_ID,
        data.PRODUCT_NAME,
        data.PRESENT_QUANTITY,
        data.MIN_QUANTITY,
        data.SUPPLIER_ID,
        data.SELLING_PRICE,
        data.USER_ID
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
    getProducts: (callback) => {
    db.query(`select * from PRODUCT`, [], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
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
};
