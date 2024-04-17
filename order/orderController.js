const { createOrder, getOrders,updateOrders } = require("./orderQueries");
const db = require("../db/conn");

exports.addOrder = (req, res) => {
  const id = req.decodedToken.result.user_id;

  const productName = req.body.PRODUCT_NAME;
  const supplierName = req.body.SUPPLIER_NAME;
  const sql1 = "SELECT PRODUCT_ID FROM PRODUCT WHERE PRODUCT_NAME = ?";
  const sql2 = "SELECT SUPPLIER_ID FROM SUPPLIER WHERE NAME = ?";

  db.query(sql1, [productName], (Proderr, Prodresult) => {
    if (Proderr) {
      console.log(Proderr);
      res.status(500).send("Error searching for product ID.");
    } else {
      const productId = Prodresult[0].PRODUCT_ID;

      db.query(sql2, [supplierName], (Supperr, Suppresult) => {
        if (Supperr) {
          console.log(Supperr);
          res.status(500).send("Error searching for product ID.");
        } else {
          const supplierId = Suppresult[0].SUPPLIER_ID;
          let ts = Date.now();
          let date_ob = new Date(ts);
          let date = date_ob.getDate();
          let month = date_ob.getMonth() + 1;
          let year = date_ob.getFullYear();
          let today = year + "-" + month + "-" + date;
          const sql = `INSERT INTO ORDERS (ORDER_ID, PRODUCT_ID, SUPPLIER_ID, DATE, QUANTITY, USER_ID) values (?,?,?,?,?,?)`;
          db.query(
            sql,
            [
              req.body.ORDER_ID,
              productId,
              supplierId,
              today,
              req.body.QUANTITY,
              id,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error inserting order.");
              } else {
                db.query(
                  `SELECT LAST_INSERT_ID() as ID;`,
                  [],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send("Error getting ID");
                    } else {
                      console.log("Order inserted successfully.");
                      res.json({
                        ORDER_ID: result[0].ID, //changes
                        PRODUCT_ID: productId,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  });
};
// exports.addOrder = (req, res) => {
//   const body = req.body;
//   const id = req.decodedToken.result.user_id;
//   console.log(id)
//   createOrder(body,id,(err, results) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({
//         success: 0,
//         message: "Database connection error",
//       });
//     } else {
//       // res.locals.body = body;
//       return res.status(200).json({
//         success: 1,
//         data: results,
//       });
//     }
//   });
// };

exports.getOrdersList = (req, res) => {
  const id = req.decodedToken.result.user_id;
  getOrders(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.status(200).json(results);
  });
};

exports.updateOrderStatus = (req,res) =>{
  const status = req.body.status;
  const order_id = req.body.order_id;
    updateOrders(order_id,status, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    db.query(
      `SELECT PRODUCT_ID
      FROM ORDERS WHERE ORDER_ID=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
    // 
    return res.status(200).json(results);
  });
}