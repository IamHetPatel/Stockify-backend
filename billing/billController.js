const { getBills } = require("./billQueries");
const db = require("../db/conn");
const nodemailer = require("nodemailer");
require('dotenv').config({path: __dirname + '../.env'})

const transporter = nodemailer.createTransport({
  service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
        secure: false,

  auth: {
    user: "moviesop99@gmail.com",
    pass: process.env.NodeMAILER,
  },
  tls: {
    rejectUnauthorized: false
  },
  // increase the timeout value
  timeout: 60000
});

// exports.addBill = (req, res) => {
//   const { customer_name, customer_contact, product_name, quantity } = req.body;

//   const getQuery = `SELECT SELLING_PRICE FROM PRODUCT WHERE product_id = ?`;
// db.query(`SELECT PRODUCT_ID FROM PRODUCT WHERE product_name = ?`, [product_name], (Proderr, Prodres) => {
//         if (Proderr) {
//           console.log(Proderr);
//           res.status(500).send("Error searching for product ID.");
//         } else {
//         const productId = Prodres[0].PRODUCT_ID;
//         db.query(getQuery,[productId], (error, results) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send("Error getting selling price.");
//           }
//           else {
//     const selling_price = results[0].SELLING_PRICE;
//     const total_amount = quantity * selling_price;
//     let ts = Date.now();
//           let date_ob = new Date(ts);
//           let date = date_ob.getDate();
//           let month = date_ob.getMonth() + 1;
//           let year = date_ob.getFullYear();
//           let today = year + "-" + month + "-" + date;
//     const insertQuery = `INSERT INTO bill (cust_name, cust_contact, product_id, quantity, total_amount, date) VALUES ('${customer_name}', '${customer_contact}', ${productId}, ${quantity}, ${total_amount}, ?)`;

//     db.query(insertQuery,[today], (err, result) => {(err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send("Error inserting order.");
//       } else {
//         db.query(`SELECT LAST_INSERT_ID() as ID;`,[],
//         (err,result)=>{
//           if(err){
//             console.log(err)
//             res.status(500).send("Error getting ID")
//           }
//           else{
//             console.log("Order inserted successfully.");
//             res.json({
//               "bill_number":result[0].bill_number,//changes
//               "PRODUCT_ID":productId
//             });
//           }
//         })
//       }
//     }

//   });
//   };
// })
// };})}

exports.addBill = function (req, res) {
  const { CUST_NAME, CUST_CONTACT } = req.body;

  db.beginTransaction(function (err) {
    if (err) {
      res.status(500).json({ error: "Could not start transaction." });
      return;
    }

    db.query(
      `INSERT INTO BILLS (CUST_NAME, CUST_CONTACT, DATE)
        VALUES (?, ?, NOW())`,
      [CUST_NAME, CUST_CONTACT],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error adding bill");
        } else {
          const BILL_ID = results.insertId;
          console.log(BILL_ID);
          console.log(req.body);
          let promises = [];
          req.body.billItems.forEach((item) => {
            promises.push(
              new Promise((resolve, reject) => {
                db.query(
                  `SELECT p.PRODUCT_ID, p.PRESENT_QUANTITY, p.MIN_QUANTITY, s.EmailID, p.USER_ID
                   FROM PRODUCT p
                   JOIN SUPPLIER s ON p.SUPPLIER_ID = s.SUPPLIER_ID
                   WHERE p.PRODUCT_NAME = ?`,
                  [item.PRODUCT_NAME],
                  (err, nameresults) => {
                    if (err) {
                      reject(err);
                    } else {
                      const PRODUCT_ID = nameresults[0].PRODUCT_ID;
                      const PRESENT_QUANTITY = nameresults[0].PRESENT_QUANTITY;
                      const MIN_QUANTITY = nameresults[0].MIN_QUANTITY;
                      const EmailID = nameresults[0].EmailID;
                      const UserID = nameresults[0].USER_ID;
                      console.log(PRODUCT_ID)
                      console.log(EmailID)
                      if (PRESENT_QUANTITY < item.QUANTITY) {
                        reject(`Product ${item.PRODUCT_NAME} with ID ${PRODUCT_ID} has lesser quantity than ordered.`);
                      } else if (PRESENT_QUANTITY < MIN_QUANTITY) {
                        const mailOptions = {
                          from: "hetp4c@gmail.com",
                          to: EmailID,
                          subject: `Product ${item.PRODUCT_NAME} is running low in stock`,
                          text: `Dear supplier,\nThe present quantity of product ${item.PRODUCT_NAME} with ID ${PRODUCT_ID} has fallen below the minimum quantity. Please restock as soon as possible.\n\nBest regards,\nRetailer ${UserID}`
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                          if (error) {
                            console.error(error);
                          } else {
                            console.log("Email sent: " + info.response);
                          }
                        });
                        db.query(
                          `INSERT INTO BILL_DETAILS (BILL_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`,
                          [BILL_ID, PRODUCT_ID, item.QUANTITY],
                          (err, results) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(results);
                            }
                          }
                        );
                      } else {
                        db.query(
                          `INSERT INTO BILL_DETAILS (BILL_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`,
                          [BILL_ID, PRODUCT_ID, item.QUANTITY],
                          (err, results) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(results);
                            }
                          }
                        );
                      }
                    }
                  }
                );
                
              })
            );
          });
          Promise.all(promises)
            .then((results) => {
              db.query(
                `SELECT TOTAL_AMOUNT FROM BILLS WHERE BILL_ID = ?`,
                [BILL_ID],
                (err, results) => {
                  if (err) {
                    db.rollback(function () {
                      res
                        .status(500)
                        .json({ error: "Could not retrieve total amount." });
                    });
                  } else {
                    db.commit(function (err) {
                      if (err) {
                        db.rollback(function () {
                          res.status(200).send("could not commit transaction");
                        });
                      } else {
                        res
                          .status(200)
                          .json({TOTAL_AMOUNT: `${results[0].TOTAL_AMOUNT}`});
                      }
                    });
                  }
                }
              );
            })
            .catch((err) => {
              db.rollback(function () {
                res.status(500).json({ error: "Could not insert bill data. " + err });
              });
            });
        }
      }
    );
  });
};


//   const productName = req.body.PRODUCT_NAME;
//   const supplierName = req.body.SUPPLIER_NAME;

//   const sql1 = "SELECT product_id FROM PRODUCT WHERE PRODUCT_NAME = ?";
//   const sql2 = "SELECT SUPPLIER_ID FROM SUPPLIER WHERE NAME = ?";
//   db.query(sql1, [productName], (Proderr, Prodresult) => {
//     if (Proderr) {
//       console.log(Proderr);
//       res.status(500).send("Error searching for product ID.");
//     } else {
//       const productId = Prodresult[0].product_id;

//       db.query(sql2, [supplierName], (Supperr, Suppresult) => {
//         if (Supperr) {
//           console.log(Supperr);
//           res.status(500).send("Error searching for product ID.");
//         } else {
//           const supplierId = Suppresult[0].SUPPLIER_ID;
//           let ts = Date.now();
//           let date_ob = new Date(ts);
//           let date = date_ob.getDate();
//           let month = date_ob.getMonth() + 1;
//           let year = date_ob.getFullYear();
//           let today = year + "-" + month + "-" + date;
//           const sql = `INSERT INTO ORDERS (ORDER_ID, PRODUCT_ID, SUPPLIER_ID, DATE, QUANTITY, USER_ID) values (?,?,?,?,?,?)`;
//           db.query(
//             sql,
//             [body.ORDER_ID, productId, supplierId, today, body.QUANTITY, id],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//                 res.status(500).send("Error inserting order.");
//               } else {
//                 console.log("Order inserted successfully.");
//                 res.send("Order inserted successfully.");
//               }
//             }
//           );
//         }
//       });
//     }
//   });

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

exports.getBillsList = function (req, res) {
  db.query(
  `SELECT BILLS.CUST_NAME, BILLS.CUST_CONTACT, BILLS.DATE, BILLS.TOTAL_AMOUNT, BILL_DETAILS.QUANTITY, PRODUCT.PRODUCT_NAME 
   FROM BILLS 
   INNER JOIN BILL_DETAILS ON BILLS.BILL_ID = BILL_DETAILS.BILL_ID 
   INNER JOIN PRODUCT ON BILL_DETAILS.PRODUCT_ID = PRODUCT.PRODUCT_ID 
   ORDER BY BILLS.DATE DESC`,
  (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving bills");
    } else {
      const bills = [];
      let currentCust = null;
      let currentBill = null;
      
      results.forEach((row) => {
        const { CUST_NAME, CUST_CONTACT, DATE, TOTAL_AMOUNT, PRODUCT_NAME, QUANTITY } = row;
        
        if (CUST_NAME !== currentCust || CUST_CONTACT !== currentContact) {
          // Start a new bill for a new customer
          currentCust = CUST_NAME;
          currentContact = CUST_CONTACT;
          currentBill = {
            CUST_NAME,
            CUST_CONTACT,
            DATE,
            TOTAL_AMOUNT,
            billItems: [],
          };
          bills.push(currentBill);
        }
        
        // Add the product to the current bill
        currentBill.billItems.push({ PRODUCT_NAME, QUANTITY });
      });

      res.status(200).json(bills);
    }
  }
);
};


