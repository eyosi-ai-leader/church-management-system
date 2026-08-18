const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }


    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions"
      });
    }


    next();
  };
};


module.exports = roleMiddleware;