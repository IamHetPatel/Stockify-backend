const {
  createProduct,
  getProducts,
  searchProduct,
} = require("./productQueries");

exports.addProduct = (req, res) => {
  const body = req.body;
  // const id = req.decodedToken.result.user_id;
  // console.log(id);
  createProduct(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "DB connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results, 
    });
  });
};

exports.getProductsList = (req, res) => {
  getProducts((err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.status(200).json(results);
  });
};

exports.searchProduct = (req, res) => {
  const name = req.params.name;
  searchProduct(name, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    }
    return res.status(200).json( results,
    );
  });
};
