const db = require("../db/conn");

  
module.exports = {
  createUser: (data, callback) => {
    db.query(
      `insert into users(user_id,email,password,shop_name,shop_photo) values(?,?,?,?,?)`,
      [
        data.user_id,
        data.email,
        data.password,
        data.shop_name,
        data.shop_photo,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getAllUsers: async (callback) => {
    db.query(`select * from users`, [], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },
  getUserById: (user_id, callback) => {
    db.query(
      `select * from users where user_id =?`,
      [user_id],
      (error, results, fields) => {
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
      [
        data.email,
        data.password,
        data.shop_name,
        data.shop_photo,
        data.user_id,
      ],
      (error, results, fields) => {
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
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  }
}