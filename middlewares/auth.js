const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const User = require("../models/user")

const isAuthenticated = async (req, res, next) => {

    const token = req.cookies && req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "user in not authenticated" });
    }

    try {


        const decoded = await jwt.verify(token, JWT_SECRET);

        const userId = decoded.userId;
        req.userId = userId;
        next();


    } catch (e) {
        return res.status(401).json({ message: " unauthorized access " });
    }




};

const allowRoles = (roles) => {
    return async (req, res, next) => {

        const userId = req.userId;


        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({ message: " User not found" });

        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden: You do not have the required role(s) to access this resource"
            });
        }

        req.user = user;

        next();

    }
}



module.exports = {
    isAuthenticated,
    allowRoles
}

