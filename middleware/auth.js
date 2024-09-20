const jwt = require("jsonwebtoken");

module.exports =
  (requiredRole = null) =>
  (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      // Role-based authorization check (if applicable)
      if (requiredRole && req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ msg: "Forbidden: Insufficient privileges" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
