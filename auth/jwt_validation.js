const {verify} = require ("jsonwebtoken");

exports.checkJwt = async (req,res,next) =>{
    try {
        var token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          token = req.headers.authorization.split(" ")[1];
          if (token) {
            verify(token, "qwerty123", (err, decodedToken) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Token invalid",
                });
              } else {
                req.decodedToken = decodedToken;
                next();
              }
            });
          }
        }
        // console.log(token);
        if (!token) {
          res.status(401).json({
            message: "You are not authorized to access this"
          });
        }
    }
       catch (err) {
        res.status(400).json({
          status: "failed",
          message: err.message,
        });
      }
    
}