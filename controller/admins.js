import { Admins, validateAdmins } from "../models/adminSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AdminsController {
  async get(req, res) {
    try {
      const admins = await Admins.find().sort({ createdAt: -1 });

      if (!admins.length) {
        return res.status(400).json({
          msg: "User is not defined",
          variant: "error",
          payload: null,
          totalCount: 0,
        });
      }

      res.status(200).json({
        msg: "Admins fetched successfully",
        variant: "success",
        payload: admins,
        totalCount: admins.length,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async getprofile(req, res) {
    try {
      const id = req.admin._id;
      const admin = await Admins.findById(id).select("-password");

      if (!admin || !admin.isActive) {
        return res.status(400).json({
          msg: "Invalid token",
          variant: "error",
          payload: null,
        });
      }

      res.status(200).json({
        msg: "Admin or Owner fetched successfully",
        variant: "success",
        payload: admin,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getOneAdmin(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.findById(id).select("-password");

      res.status(200).json({
        msg: "Admin or Owner fetched successfully",
        variant: "success",
        payload: admin,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      const { error } = validateAdmins(req.body);
      if (error)
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "error",
          payload: null,
        });

      const { username, password } = req.body;

      const existingUser = await Admins.findOne({ username });

      if (existingUser)
        return res.status(400).json({
          msg: "User already exists.",
          variant: "error",
          payload: null,
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = await Admins.create({
        ...req.body,
        password: hashedPassword,
      });

      res.status(201).json({
        msg: "User registered successfully",
        variant: "success",
        payload: admin,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async signin(req, res) {
    const { username, password } = req.body;
    const admin = await Admins.findOne({ username });
    if (!admin) {
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });
    }

    const token = jwt.sign(
      { _id: admin._id, role: admin.role, isActive: admin.isActive },
      process.env.ADMIN_SECRET
    );

    res.status(200).json({
      msg: "Logged in successfully",
      variant: "success",
      payload: {
        admin,
        token,
      },
    });
  }
  async update(req, res) {
    try {
      const { id } = req.params;

      if (req.body.password || req.body.password === "") {
        return res.status(400).json({
          msg: "Password kiritilmasin",
          variant: "error",
          payload: null,
        });
      }

      const { username } = req.body;
      const existingAdmin = await Admins.findOne({ username });
      if (existingAdmin && id !== existingAdmin._id?.toString())
        return res.status(400).json({
          msg: "Admin or Owner already exists.",
          variant: "error",
          payload: null,
        });

      let user = await Admins.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        msg: "user updated",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: "server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const existBlog = await Admins.findById(id);
      if (!existBlog) {
        return res.status(400).json({
          msg: "Admin is not found",
          variant: "warning",
          payload: null,
        });
      }
      const users = await Admins.findByIdAndDelete(id, { new: true });

      res.status(200).json({
        msg: "Admin is deleted",
        variant: "success",
        payload: users,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new AdminsController();
