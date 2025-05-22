const { User } = require('../models');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (error) {
      console.error('eror role MW:', error);
      res.status(500).json({ error: 'ISE' });
    }
  };
};

module.exports = { checkRole };