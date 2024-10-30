const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const invalidTokens = [];

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    if (invalidTokens.includes(token)) {
        return res.status(401).json({ error: 'Token has been invalidated' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (req.user.role === 'admin' || roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).json({ message: 'Accès refusé : rôle non autorisé.' });
    };
}

module.exports = { authenticateToken, authorizeRoles };