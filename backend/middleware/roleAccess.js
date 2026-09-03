const roleAccess = (allowedRoles = []) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!roles.length || !roles.includes(userRole)) {
      return res.status(403).json({
        error: "Access denied for this role",
      });
    }

    next();
  };
};

export default roleAccess;
