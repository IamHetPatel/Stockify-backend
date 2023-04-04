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
      // `select * from PRODUCT where USER_ID =?`,
      `SELECT P.PRODUCT_ID,P.PRODUCT_NAME,P.PRESENT_QUANTITY,P.MIN_QUANTITY,S.NAME, P.SELLING_PRICE FROM PRODUCT as P JOIN SUPPLIER as S ON P.SUPPLIER_ID = S.SUPPLIER_ID WHERE P.USER_ID=?;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteProd: (id, callback) => {
    db.query(
      `delete from PRODUCT where product_id=?`,
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
        console.log(data.ORDER_ID)
        console.log(data.PRODUCT_ID)
        return callback(null, results);
      }
    );
  },
  updateProductByBill: (data, callback) => {
    db.query(
      `UPDATE PRODUCT SET PRESENT_QUANTITY = PRESENT_QUANTITY-(SELECT b.QUANTITY FROM bill as b where b.bill_number=?) WHERE PRODUCT_ID=?`,
      [data.bill_number, data.PRODUCT_ID],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        console.log(data.bill_number)
        console.log(data.PRODUCT_ID)
        return callback(null, results);
      }
    );
  }
};
