import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export const Auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg: "Access denied. A",
            variant: "error",
            payload: null,
        });
    }

    try {
        jwt.verify(token, process.env.ADMIN_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    msg: "Invalid token. A",
                    variant: "error",
                    payload: null,
                });
            }

            if (decoded.isActive) {
                req.admin = decoded;
                next();
            }
            else {
                res.status(401).json({
                    msg: "Invalid token. B",
                    variant: "error",
                    payload: null,
                });
            }
        });
    } catch {
        res.status(401).json({
            msg: "Invalid token. C",
            variant: "error",
            payload: null,
        });
    }
};

export const OwnerAuth = (req, res, next) => {
    if (req.admin.role === "owner") {
        next();
    }
    else {
        res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
        });
    }

};
