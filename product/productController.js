const {
  createProduct,
  getProducts,
  searchProduct,
  updateProductByOrder
} = require("./productQueries");

exports.addProduct = (req, res) => {
  const body = req.body;
  const id = req.decodedToken.result.user_id;
  console.log(id);
  createProduct(body,id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: err,
      });
    }
    return res.status(200).json({
      success: 1,
      data: results, 
    });
  });
};

exports.getProductsList = async (req, res) => {
  try {
    // console.log("decodedToken", req.decodedToken);
    const id = req.decodedToken.result.user_id;
    getProducts(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.updateafter = async (req, res) => {
  const body = req.body;
  console.log(body.toString())
  updateProductByOrder(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
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
