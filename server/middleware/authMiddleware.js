import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Getting the token from the header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided." });
    }

    // Token verification
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token is invalid or expired." });
        }
        
        // Attaching the user's information to the request so the controller can use it
        req.user = user; 
        next();
    });
};

export default authMiddleware;