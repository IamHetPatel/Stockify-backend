const { createOrder,getOrders } = require("./orderQueries");
const db = require("../db/conn");

exports.addOrder = (req, res) => {
  const body = req.body;
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
      console.log(Prodresult)
      const productId = Prodresult[0].PRODUCT_ID;
      console.log(productId)

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
            [body.ORDER_ID, productId, supplierId, today, body.QUANTITY, id],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error inserting order.");
              } else {
                console.log("Order inserted successfully.");
                res.send("Order inserted successfully.");
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
  const id = req.decodedToken.result.user_id
    getOrders(id,(err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  };