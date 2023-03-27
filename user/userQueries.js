const db = require("../db/conn");

module.exports =
{
createUser: (data, callback) => {
  db.query(
    `INSERT INTO USERS(USER_ID,EMAIL,PASSWORD,SHOP_NAME,SHOP_PHOTO) VALUES(?,?,?,?,?)`,
    [data.user_id, data.email, data.password, data.shop_name, data.shop_photo],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
},
  getAllUsers: (callback) => {
    db.query(`select * from users`, [], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },
  getUserById: (id, callback) => {
    db.query(
      `select * from users where user_id =?`,
      [id],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  updateUser: (data, callback) => {
    db.query(
      `update users set email=?,password=?,shop_name=?,shop_photo=? where user_id = ?) values(?,?,?,?)`,
      [data.email,data.password,data.shop_name,data.shop_photo,data.user_id,],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteUser: (data, callback) => {
    db.query(
      `delete from users where user_id =?`,
      [data.user_id],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  }}
