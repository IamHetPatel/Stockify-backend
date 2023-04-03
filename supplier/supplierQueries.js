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
    `insert into SUPPLIER(SUPPLIER_ID,CONTACT_NO,NAME,EmailID) values(?,?,?,?)`,
    [data.SUPPLIER_ID, data.CONTACT_NO, data.NAME,data.EmailID],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.getSupplierByName = (name, callback) => {
  db.query(
    `select * from SUPPLIER where NAME like '%${name}%'`,
    [name],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
    //   console.log(results)
      return callback(null, results);
    }
  );
};
