const db = require("../db/conn");

exports.getBills = (id,callback) => {
    db.query(`select b.BILL_ID,b.cust_name,b.cust_contact,b.total_amount,b.date from BILLS as b`, [id], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  };