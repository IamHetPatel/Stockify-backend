const { createOrder,getOrders } = require("./orderQueries");

exports.addOrder = (req, res) => {
  const body = req.body;
  const id = req.decodedToken.result.user_id;
  console.log(id)
  createOrder(body,id,(err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    } else {
      // res.locals.body = body;
      return res.status(200).json({
        success: 1,
        data: results,
      });
    }
  });
};

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