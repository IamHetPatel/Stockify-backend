const {
  getSupplier,
  createSupplier,
  getSupplierByName,
} = require("./supplierQueries");

exports.getSuppliersList = (req, res) => {
  getSupplier((err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};

exports.createSupplier = (req, res) => {
  const body = req.body;
  console.log(req.body)
  createSupplier(body, (err, results) => {
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
exports.getSupplierBySupplierName = (req, res) => {
  const name = req.params.name;
  getSupplierByName(name, async (err, results) => {
    try {
      const val = await results;
      if (!val) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: val,
      });
    } catch (e) {
      console.log(e);
    }
    
  });
};
