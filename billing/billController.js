

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
                        res.status(400).json({ error: `Product ${item.PRODUCT_NAME} with ID ${PRODUCT_ID} has lesser quantity than ordered.` });
                        // reject(`Product ${item.PRODUCT_NAME} with ID ${PRODUCT_ID} has lesser quantity than ordered.`);
                      } else if (PRESENT_QUANTITY < MIN_QUANTITY) {
                        const mailOptions = {
                          from: "moviesop99@gmail.com",
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
                          .json({TOTAL_AMOUNT: `${results[0].TOTAL_AMOUNT}`,BILL_ID: BILL_ID});
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

exports.getBillsList = function (req, res) {
  db.query(
  `SELECT BILLS.BILL_ID, BILLS.CUST_NAME, BILLS.CUST_CONTACT, BILLS.DATE, BILLS.TOTAL_AMOUNT, BILL_DETAILS.QUANTITY, PRODUCT.PRODUCT_NAME, PRODUCT.SELLING_PRICE
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
      let currentBillID = null;
      let currentContact = null;
      
      results.forEach((row) => {
        const { BILL_ID,CUST_NAME, CUST_CONTACT, DATE, TOTAL_AMOUNT, PRODUCT_NAME, QUANTITY,SELLING_PRICE } = row;
        
        if (CUST_NAME !== currentCust || CUST_CONTACT !== currentContact || BILL_ID !== currentBillID) {
          // Start a new bill for a new customer
          currentCust = CUST_NAME;
          currentContact = CUST_CONTACT;
          currentBillID = BILL_ID;
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
        currentBill.billItems.push({ PRODUCT_NAME, QUANTITY, SELLING_PRICE });
      });

      res.status(200).json(bills);
    }
  }
);
};

exports.getLastBill = function (req, res) {
  const BILL_ID= req.params.BILL_ID
  db.query(
  `SELECT BILLS.BILL_ID, BILLS.CUST_NAME, BILLS.CUST_CONTACT, BILLS.DATE, BILLS.TOTAL_AMOUNT, BILL_DETAILS.QUANTITY, PRODUCT.PRODUCT_NAME, PRODUCT.SELLING_PRICE
   FROM BILLS 
   INNER JOIN BILL_DETAILS ON BILLS.BILL_ID = BILL_DETAILS.BILL_ID 
   INNER JOIN PRODUCT ON BILL_DETAILS.PRODUCT_ID = PRODUCT.PRODUCT_ID 
   where BILLS.BILL_ID=?`,
   [BILL_ID],
  (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving bills");
    } else {
      const bills = [];
      let currentCust = null;
      let currentBill = null;
      let currentBillID = null;
      let currentContact = null;
      
      results.forEach((row) => {
        const { BILL_ID,CUST_NAME, CUST_CONTACT, DATE, TOTAL_AMOUNT, PRODUCT_NAME, QUANTITY,SELLING_PRICE } = row;
        
        if (CUST_NAME !== currentCust || CUST_CONTACT !== currentContact || BILL_ID !== currentBillID) {
          // Start a new bill for a new customer
          currentCust = CUST_NAME;
          currentContact = CUST_CONTACT;
          currentBillID = BILL_ID;
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
        currentBill.billItems.push({ PRODUCT_NAME, QUANTITY, SELLING_PRICE });
      });

      res.status(200).json(bills);
    }
  }
);
};