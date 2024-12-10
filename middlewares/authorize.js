const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user?.role?.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).send('Forbidden');
    }

    next();
  };
};

module.exports = authorize;
