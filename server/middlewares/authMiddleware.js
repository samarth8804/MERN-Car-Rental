const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const CarOwner = require('../models/CarOwner');
const Customer = require('../models/Customer');
const Driver = require('../models/Driver');

exports.protect = (allowedRoles = []) => {
  return async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = null;
        const role = decoded.role;

        if (role === "admin") {
          user = await Admin.findById(decoded.id).select("-password");
        }
        else if (role === "carOwner") {
          user = await CarOwner.findById(decoded.id).select("-password");
        }
        else if (role === "customer") {
          user = await Customer.findById(decoded.id).select("-password");
        } 
        else if (role === "driver") {
          user = await Driver.findById(decoded.id).select("-password");
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized, user not found"
          });
        }

        if (allowedRoles.length && !allowedRoles.includes(role)) {
          return res.status(403).json({
            success: false,
            message: "Access denied."
          });
        }

        req.user = user;
        req.role = role;
        next();

      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, invalid token"
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided"
      });
    }
  }
}