const { verifyToken } = require('../utils/jwt_utils');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authenticate;