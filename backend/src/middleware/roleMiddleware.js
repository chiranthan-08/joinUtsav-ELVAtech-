const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }

    const userRole = req.user.role;

    // Super Admin has master access to all endpoints
    if (userRole === 'super_admin') {
      return next();
    }

    // Admin has access if allowedRoles includes 'admin', 'organizer', or 'user'
    if (userRole === 'admin' && (allowedRoles.includes('admin') || allowedRoles.includes('organizer') || allowedRoles.includes('user'))) {
      return next();
    }

    // Normal role check
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of [${allowedRoles.join(', ')}] permissions, but your role is '${userRole}'.`
    });
  };
};

module.exports = { roleMiddleware };
