const jwt = require('jsonwebtoken');

// Middleware to verify the user role matches the intended role
const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers['x-auth-token'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    };
};

module.exports = verifyRole;