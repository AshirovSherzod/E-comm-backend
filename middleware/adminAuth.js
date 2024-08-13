import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export const Auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg: "Access denied.",
            variant: "error",
            payload: null,
        });
    }

    try {
        jwt.verify(token, process.env.ADMIN_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    msg: "Invalid token.",
                    variant: "error",
                    payload: null,
                });
            }
f

            if (decoded.role === "owner") {
                req.admin = decoded;
                next();
            }
            else {
                res.status(401).json({
                    msg: "Invalid token.",
                    variant: "error",
                    payload: null,
                });
            }
        });
    } catch {
        res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
        });
    }
};

export const OwnerOrAdminAuth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg: "Access denied.",
            variant: "error",
            payload: null,
        });
    }

    jwt.verify(token, process.env.ADMIN_SECRET, function (err, decoded) {
        req.admin = decoded;
        if (req.admin.role === "owner" || req.admin.role === "admin") {
            next();
        }
        else {
            res.status(401).json({
                msg: "Invalid token.",
                variant: "error",
                payload: null,
            });
        }
    });
};
