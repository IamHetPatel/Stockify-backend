const db = require("../db/conn");

exports.getSupplier = (callback) => {
  db.query(`select * from SUPPLIER`, [], (error, results, fields) => {
    if (error) {
      return callback(error);
    }
    return callback(null, results);
  });
};

exports.createSupplier = (data, callback) => {
  db.query(
    `insert into SUPPLIER(SUPPLIER_ID,CONTACT_NO,NAME) values(?,?,?)`,
    [data.SUPPLIER_ID, data.CONTACT_NO, data.NAME],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.getSupplierByName = (supplier_name, callback) => {
  db.query(
    `select * from SUPPLIER where NAME like '%${supplier_name}%'`,
    [supplier_name],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
    //   console.log(results)
      return callback(null, results);
    }
  );
};
